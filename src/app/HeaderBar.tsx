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
    <div className="flex flex-row items-center bg-emerald-900 h-16 p-4 w-full flex-shrink-0">
      {/* Left - Logo */}
      <div className="w-1/5 flex items-center">
        <button
          className="px-3 font-bold text-2xl font-serif text-white bg-transparent border-none cursor-pointer"
          onClick={() => router.push("/Home")}
          style={{ outline: "none" }}
          aria-label="Go to home page"
        >
          YARD ~ SEARCH
        </button>
      </div>

      {/* Center - Search Bar */}
      <div className="w-3/5 px-16 flex items-center">
        {showSearchByDefault && (
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
            className="w-full h-10 p-4 rounded-full placeholder:text-white placeholder:font-bold bg-emerald-700 shadow-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            style={{ transition: "all 0.3s ease-in-out" }}
          />
        )}
      </div>

      {/* Right - Profile Button */}
      <div className="w-1/5 flex justify-end pr-4 gap-2">
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
