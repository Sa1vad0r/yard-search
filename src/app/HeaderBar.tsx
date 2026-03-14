"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { auth } from "../../firebaseConfig";

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
    <header className="flex items-center bg-white border-b border-gray-200 px-4 py-2 w-full flex-shrink-0 gap-3 shadow-sm sticky top-0 z-40">
      {/* Logo */}
      <button
        className="flex items-center gap-2 flex-shrink-0"
        onClick={() => router.push("/Home")}
        aria-label="Go to home page"
      >
        <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">YS</span>
        </div>
        <span className="hidden sm:block font-bold text-lg text-gray-900 tracking-tight">
          Yard Search
        </span>
      </button>

      {/* Search Bar */}
      {showSearchByDefault && (
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pageChange) {
                  router.push("/Search");
                }
              }}
              placeholder="Search Yard Search"
              autoComplete="off"
              className="w-full h-10 pl-9 pr-4 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      {/* Spacer when no search */}
      {!showSearchByDefault && <div className="flex-1" />}

      {/* Right side actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-100 transition"
              onClick={() => setShowMenu((prev) => !prev)}
              title="Account menu"
            >
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setShowMenu(false); router.push("/Profile"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); auth.signOut(); router.push("/SignIn"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push("/SignIn")}
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
