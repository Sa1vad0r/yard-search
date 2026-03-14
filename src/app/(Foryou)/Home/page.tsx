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
  imageUrl?: string;
}

const CATEGORIES = [
  { label: "All", icon: "🛍️" },
  { label: "Electronics", icon: "📱" },
  { label: "Clothing", icon: "👗" },
  { label: "Furniture", icon: "🛋️" },
  { label: "Garden", icon: "🌱" },
  { label: "Sports", icon: "⚽" },
  { label: "Toys", icon: "🧸" },
  { label: "Other", icon: "📦" },
];

const Page: React.FC = () => {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

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

  const filteredPosts = posts.filter((post) =>
    query.trim()
      ? post.Title?.toLowerCase().includes(query.toLowerCase()) ||
        post.Content?.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderBar query={query} onQueryChange={setQuery} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Marketplace</h2>

            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.label
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Filter by price
              </h3>
              <div className="space-y-2">
                {["Under $25", "$25–$100", "$100–$500", "Over $500"].map(
                  (range) => (
                    <button
                      key={range}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {range}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile category chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat.label
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {activeCategory === "All" ? "Today's picks" : activeCategory}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredPosts.length} listing{filteredPosts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No listings found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredPosts.map((post) => (
                  <CardItem key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
