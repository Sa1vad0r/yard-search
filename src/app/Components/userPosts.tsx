"use client";
import React, { useEffect, useState } from "react";
import { Post } from "./commonInterface/PostInt";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { v4 } from "uuid";
import { getAuth } from "firebase/auth";

const UserPosts: React.FC = () => {
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPhoto, setItemPhoto] = useState<string>("");
  const [itemPrice, setItemPrice] = useState(null as number | null);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleUserData = async (
    itemName: string,
    itemDescription: string,
    itemPhoto: string,
    itemPrice: number | null
  ) => {
    console.log("Running handleUserPostData");

    const postId = v4();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No authenticated user.");
      return;
    }
    const uid = user.uid;
    try {
      await setDoc(doc(db, "posts", postId), {
        Content: itemDescription,
        Title: itemName,
        authorID: uid,
        price: itemPrice,
        createdAt: serverTimestamp(),
        imageUrl: itemPhoto || "",
      });
      console.log("User document created.");
      const userDocRef = doc(db, "users", uid);

      await updateDoc(userDocRef, {
        posts: arrayUnion(postId),
      });
    } catch (err) {
      console.error("Error creating user document:", err);
    }
  };

  const handleDelete = async (postId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await deleteDoc(doc(db, "posts", postId));

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        posts: arrayRemove(postId),
      });

      console.log(`Post ${postId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid || "";
    const unsubscribe = onSnapshot(doc(db, "users", uid), async (userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const postIds: string[] = userData.posts || [];

        const postPromises = postIds.map(async (postId) => {
          const postSnap = await getDoc(doc(db, "posts", postId));
          return postSnap.exists()
            ? ({ id: postSnap.id, ...postSnap.data() } as Post)
            : null;
        });

        const resolvedPosts = await Promise.all(postPromises);
        setPosts(resolvedPosts.filter((post): post is Post => post !== null));
      } else {
        console.warn("User document not found.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full rounded-2xl bg-gray-200 grid-cols-1 md:grid-cols-2">
      <table className="text-black table-auto w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-2xl text-left">Title</th>
            <th className="p-2 text-2xl text-left">Content</th>
            <th className="p-2 text-2xl text-left">JPG</th>
            <th className="p-2 text-2xl text-left">Price</th>
            <th className="p-2 text-2xl text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t">
              <td className="p-2 text-black">{post.Title}</td>
              <td className="p-2 text-black">{post.Content}</td>
              <td className="p-2 text-black">{post.photoUrl || "###"} </td>
              <td className="p-2 text-black">${post.price}</td>
              <td className="p-2 text-black">
                <button
                  onClick={() => {
                    handleDelete(post.id);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr key="create post" className="border-t">
            <td className="p-2 text-black">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-1 rounded border"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </td>
            <td className="p-2 text-black">
              <input
                type="text"
                placeholder="Content"
                className="w-full p-1 rounded border"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </td>
            <td className="p-2 text-black">
              <input
                type="text"
                placeholder="photo URL"
                className="w-full p-1 rounded border"
                min="0"
                value={itemPhoto}
                onChange={(e) => setItemPhoto(e.target.value)}
              />
            </td>
            <td className="p-2 text-black">
              <input
                type="number"
                placeholder="Price"
                className="w-full p-1 rounded border"
                min="0"
                value={itemPrice || ""}
                onChange={(e) => setItemPrice(Number(e.target.value))}
              />
            </td>
            <td className="p-2 text-black">
              <button
                onClick={() => {
                  handleUserData(
                    itemName,
                    itemDescription,
                    itemPhoto,
                    itemPrice
                  );

                  setItemName("");
                  setItemDescription("");
                  setItemPhoto("");
                  setItemPrice(null);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserPosts;
