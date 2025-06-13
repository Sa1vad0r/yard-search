"use client";
import React from "react";
import HeaderBar from "../HeaderBar";
import { useState } from "react";

const ItemPage: React.FC = () => {
  const [query, setQuery] = useState("");
  return (
    <main>
      <HeaderBar
        query={query}
        onQueryChange={(newQuery: string) => {
          setQuery(newQuery);
          console.log("Query changed, go to search page");
        }}
      />
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="h-full w-4/6 bg-gray-100 shadow-2xl mx-auto p-8 space-y-4">
          {/* <img className="rounded-2xl border-2 border-gray-400 bg-green-100 w-[600px] h-[450px]"></img> */}
        </div>
      </div>
    </main>
  );
};

export default ItemPage;
