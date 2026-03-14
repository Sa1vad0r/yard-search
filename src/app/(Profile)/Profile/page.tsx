"use client";
import React, { useEffect, useState } from "react";
import HeaderBar from "@/app/HeaderBar";
import { auth, db } from "../../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import UserPosts from "@/app/Components/userPosts";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserName("");
        return;
      }
      setUser(currentUser);
      const docRef = doc(db, "users", currentUser.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || "");
        }
      } catch {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderBar
        showSearchByDefault={false}
        query=""
        onQueryChange={() => {}}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {user ? (
          <>
            {/* Profile header card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold">
                  {(userName || user.email || "U")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {userName || "Your Profile"}
                </h1>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">Member</p>
              </div>
            </div>

            {/* Listings section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Your Listings</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage and create your marketplace listings
                </p>
              </div>
              <div className="p-4">
                <UserPosts />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">You are not signed in</p>
            <p className="text-gray-400 text-sm mt-1">Sign in to view your profile and listings</p>
          </div>
        )}
      </main>
    </div>
  );
}
