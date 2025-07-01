"use client";
import React, { useEffect, useState } from "react";
import HeaderBar from "@/app/HeaderBar";
import { auth } from "../../../../firebaseConfig"; // adjust if needed
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <HeaderBar
        showSearchByDefault={false}
        query={""}
        onQueryChange={() => {
          console.log("Query changed, go to search page");
        }}
      />

      <main className="flex-row h-full w-4/6 mx-auto bg-gray-100 shadow-2xl p-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-black">Profile</h1>

        {user ? (
          <>
            <p className="text-gray-700 text-xl">
              Name: {user.displayName || "N/A"}
            </p>
            <p className="text-gray-700 text-xl">Email: {user.email}</p>
            <p className="text-gray-700 text-xl">You're signed in ✔️</p>
          </>
        ) : (
          <p className="text-red-500 text-lg">You are not signed in.</p>
        )}
      </main>
    </div>
  );
}
