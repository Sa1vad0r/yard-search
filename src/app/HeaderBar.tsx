"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface HeaderBarProps {
  showSearchByDefault?: boolean;
  query: string;
  onQueryChange: (val: string) => void;
  pageChange?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  showSearchByDefault = true,
  query,
  onQueryChange,
  pageChange = true,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-center bg-emerald-900 p-4 w-full flex-shrink-0 gap-2 md:gap-0">
      {/* Top Row: Logo and Mobile Profile Button */}
      <div className="flex justify-between items-center w-full md:w-1/5 md:justify-start md:gap-4">
        {/* Logo */}
        <button
          className="font-bold text-xl sm:text-2xl font-serif text-white"
          onClick={() => router.push("/Home")}
          aria-label="Go to home page"
        >
          YARD ~ SEARCH
        </button>

        {/* Profile Button on mobile (visible below md) */}
        <div className="md:hidden">
          <button
            className="w-10 h-10 rounded-full bg-white text-emerald-900 font-bold flex items-center justify-center hover:bg-gray-200 transition"
            title="Profile"
            onClick={() => router.push("/Profile")}
          >
            P
          </button>
        </div>
      </div>

      {/* Search Bar if enabled */}
      {showSearchByDefault && (
        <div className="w-full md:w-3/5 md:mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && pageChange) {
                router.push("/Search");
              }
            }}
            placeholder="Search"
            autoComplete="off"
            className="w-full h-10 p-3 mx-0 sm:mx-16 rounded-full placeholder:text-white placeholder:font-semibold bg-emerald-700 shadow-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      )}

      {/* Profile Button on desktop (always visible on md+) */}
      <div
        className={`hidden md:flex justify-end items-center ${
          showSearchByDefault ? "w-1/5" : "w-full"
        } pr-2`}
      >
        <button
          className="w-10 h-10 rounded-full bg-white text-emerald-900 font-bold flex items-center justify-center hover:bg-gray-200 transition"
          title="Profile"
          onClick={() => router.push("/Profile")}
        >
          P
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
