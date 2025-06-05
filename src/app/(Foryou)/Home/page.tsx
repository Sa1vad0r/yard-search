"use client";
import React, { useState } from "react";
import CardItem from "../CardItem";
import HeaderBar from "@/app/HeaderBar";

const Page: React.FC = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header Bar */}
      <HeaderBar
        query={query}
        onQueryChange={(newQuery: string) => {
          setQuery(newQuery);
          console.log("Query changed, go to search page");
        }}
      />

      {/* Scrollable Content */}
      <main className="overflow-y-auto w-4/5 ml-auto bg-gray-100 shadow-2xl px-2 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
        </div>
      </main>
    </div>
  );
};

export default Page;
