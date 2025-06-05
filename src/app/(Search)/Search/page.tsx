"use client";
import HeaderBar from "@/app/HeaderBar";
import React, { useState } from "react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults([
        `Result for "${query}" #1`,
        `Result for "${query}" #2`,
        `Result for "${query}" #3`,
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-100">
      <HeaderBar
        showSearchByDefault={true}
        query={query}
        onQueryChange={setQuery}
      />
      <form onSubmit={handleSearch} className="px-4 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="text-black p-2 w-2/3 rounded"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-emerald-700 text-white rounded"
        >
          Search
        </button>
      </form>
      <ul className="text-black px-4">
        {results.map((result, idx) => (
          <li key={idx}>{result}</li>
        ))}
      </ul>
    </main>
  );
};

export default SearchPage;
