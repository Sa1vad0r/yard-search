"use client";
import React, { useEffect, useState } from "react";
import CardItem from "../CardItem";
import HeaderBar from "@/app/HeaderBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

interface Post {
  authorID: string;
  id: string;
  Title: string;
  Content: string;
  price: number;
  // distance?: string;
  // imageUrl?: string;
}

const Page: React.FC = () => {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCol = collection(db, "posts");
      const postSnapshot = await getDocs(postsCol);
      const postList = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(postList);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <HeaderBar query={query} onQueryChange={setQuery} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[300px] shadow-inner p-4 border-l bg-gray-100 border-green-900 border-r-2 hidden lg:block">
          <h2 className="text-lg text-black font-bold mb-4">Sidebar</h2>
        </aside>

        <div className="flex-1 overflow-y-auto p-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {posts.map((post) => (
              <CardItem key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
