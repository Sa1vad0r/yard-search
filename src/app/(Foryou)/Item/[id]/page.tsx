"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import { Post } from "@/app/Components/commonInterface/PostInt";
import HeaderBar from "@/app/HeaderBar";

export default function Page() {
  const params = useParams();
  const [query, setQuery] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  const id = params?.id as string;

  useEffect(() => {
    const fetchSinglePost = async () => {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setPost(postSnap.data() as Post);
      } else {
        throw new Error("Post not found");
      }
    };

    if (id) {
      fetchSinglePost();
    }
  }, [id]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <HeaderBar
        query={query}
        onQueryChange={setQuery}
        showSearchByDefault={false}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-green-200 w-full h-full rounded-2xl p-4"></div>
        </div>
        <aside className="w-[420px] shadow-inner p-4 bg-gray-100 border-green-900 border-l-2 hidden lg:block">
          <h2 className="text-lg text-black font-bold mb-4">
            Message Seller? {post?.authorID}
          </h2>
        </aside>
      </div>
    </div>
  );
}
