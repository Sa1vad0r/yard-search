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
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUserData = async (
    itemName: string,
    itemDescription: string,
    itemPhoto: string,
    itemPrice: number | null
  ) => {
    setSubmitting(true);
    const postId = v4();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
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
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        posts: arrayUnion(postId),
      });
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setSubmitting(false);
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
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!itemName.trim() || !itemPrice) return;
    await handleUserData(itemName, itemDescription, itemPhoto, itemPrice);
    setItemName("");
    setItemDescription("");
    setItemPhoto("");
    setItemPrice(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Create listing button */}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create new listing
      </button>

      {/* Create listing form */}
      {showForm && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4">
          <h3 className="font-semibold text-gray-900">New Listing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                placeholder="What are you selling?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  value={itemPrice || ""}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input
                type="text"
                placeholder="Describe your item..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Photo URL (optional)</label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={itemPhoto}
                onChange={(e) => setItemPhoto(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSubmit}
              disabled={submitting || !itemName.trim() || !itemPrice}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Publishing..." : "Publish listing"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Listings grid */}
      {posts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-sm">No listings yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {post.photoUrl || post.imageUrl ? (
                  <img
                    src={post.photoUrl || post.imageUrl}
                    alt={post.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5 flex-1">
                <p className="text-sm font-bold text-gray-900">${post.price}</p>
                <p className="text-xs text-gray-600 truncate">{post.Title}</p>
              </div>

              {/* Delete button */}
              <div className="px-2.5 pb-2.5">
                <button
                  onClick={() => handleDelete(post.id)}
                  className="w-full py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  Remove listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
