"use client";
import React, { useState } from "react";
import CardItem from "../CardItem";
import HeaderBar from "@/app/HeaderBar";

const Page: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <HeaderBar
        query={query}
        onQueryChange={(newQuery: string) => {
          setQuery(newQuery);
          console.log("Query changed, go to search page");
        }}
      />

      {/* Body Section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Right Sidebar (Fixed Width) */}
        <aside className="w-[300px] shadow-inner p-4 border-l bg-gray-100 border-green-900 border-r-2 hidden lg:block">
          <h2 className="text-lg text-black font-bold mb-4">Sidebar</h2>
          <p className="text-sm text-gray-600">
            You can put filters, info, or ads here.
          </p>
        </aside>
        {/* Main Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardItem key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
