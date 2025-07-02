"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { auth } from "../../firebaseConfig"; // Adjust the import path as necessary

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
  const [showMenu, setShowMenu] = React.useState(false);
  const router = useRouter();
  const user = useAuth();

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
        {/* Hamburger Menu - Mobile */}
        <div className="md:hidden relative">
          <button
            className="w-10 h-10 rounded-full bg-white text-emerald-900 font-bold flex items-center justify-center hover:bg-gray-200 transition"
            onClick={() => setShowMenu((prev) => !prev)}
            title="Menu"
          >
            ☰
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
              <button
                onClick={() => router.push("/Profile")}
                className="w-full text-left px-4 py-2 hover:bg-emerald-100"
              >
                Profile
              </button>
              <button
                onClick={() => router.push("/Settings")}
                className="w-full text-left px-4 py-2 hover:bg-emerald-100"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  auth.signOut();
                  router.push("/SignIn");
                }}
                className="w-full text-left px-4 py-2 hover:bg-emerald-100 text-red-600"
              >
                Sign Out
              </button>
            </div>
          )}
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
      {/* Hamburger Menu - Desktop */}
      <div
        className={`hidden md:flex relative justify-end items-center ${
          showSearchByDefault ? "w-1/5" : "w-full"
        } pr-2`}
      >
        {user ? (
          <button
            className="w-10 h-10 rounded-full bg-white text-emerald-900 font-bold flex items-center justify-center hover:bg-gray-200 transition"
            onClick={() => setShowMenu((prev) => !prev)}
            title="Menu"
          >
            ☰
          </button>
        ) : (
          <button
            onClick={() => {
              auth.signOut();
              router.push("/SignIn");
            }}
            className=" px-4 py-2 text-center text-green-400 hover:text-green-200"
          >
            Sign In
          </button>
        )}

        {showMenu && (
          <div className="absolute right-0 top-12 w-40 bg-white shadow-lg rounded-lg z-50">
            <button
              onClick={() => router.push("/Profile")}
              className="w-full px-4 py-2 text-black text-center rounded-t-lg hover:bg-emerald-100"
            >
              Profile
            </button>
            <button
              onClick={() => router.push("/Settings")}
              className="w-full px-4 py-2 text-black text-center hover:bg-emerald-100"
            >
              Settings
            </button>
            <button
              onClick={() => {
                auth.signOut();
                router.push("/Home");
              }}
              className="w-full px-4 py-2 hover:bg-emerald-100 rounded-b-lg text-center text-red-600"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBar;
