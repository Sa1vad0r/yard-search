"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

interface Post {
  authorID: string;
  id: string;
  Title: string;
  Content: string;
  price: number;
  imageUrl?: string;
}

interface CardItemProps {
  post: Post;
}

const CardItem: React.FC<CardItemProps> = ({ post }) => {
  const [authorName, setAuthorName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const docRef = doc(db, "users", post.authorID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAuthorName(data.name || "Unknown Seller");
        } else {
          setAuthorName("Unknown Seller");
        }
      } catch {
        setAuthorName("Unknown Seller");
      }
    };

    fetchAuthor();
  }, [post.authorID]);

  return (
    <button
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 text-left w-full"
      onClick={() => router.push(`/Item/${post.id}`)}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.Title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col gap-0.5">
        <p className="text-base font-bold text-gray-900">
          ${post.price?.toLocaleString() ?? "0"}
        </p>
        <p className="text-sm text-gray-700 line-clamp-2 leading-snug">
          {post.Title}
        </p>
        <p className="text-xs text-gray-400 mt-1">{authorName}</p>
      </div>
    </button>
  );
};

export default CardItem;
