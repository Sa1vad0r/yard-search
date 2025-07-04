"use client";
import React, { useEffect, useState } from "react";
import { Post } from "./commonInterface/PostInt";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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
            <th className="p-2 text-2xl text-left">Price</th>
            <th className="p-2 text-2xl text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t">
              <td className="p-2 text-black">{post.Title}</td>
              <td className="p-2 text-black">{post.Content}</td>
              <td className="p-2 text-black">${post.price}</td>
              <td className="p-2 text-black">
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPosts;
