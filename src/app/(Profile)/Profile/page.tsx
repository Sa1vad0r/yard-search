"use client";
import React, { useEffect, useState } from "react";
import HeaderBar from "@/app/HeaderBar";
import { auth, db } from "../../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
          console.log("Fetched user:", data);
          setUserName(data.name || "Unknown Author");
        } else {
          console.warn("User document not found.");
          setUserName("Unknown Author");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUserName("Unknown Author");
      }
    });

    return () => unsubscribe();
  }, []);

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
            <p className="text-gray-700 text-xl">Name: {userName || "N/a"}</p>
            <p className="text-gray-700 text-xl">Email: {user.email}</p>
            <p className="text-gray-700 text-xl">You&apos;re signed in ✔️</p>
          </>
        ) : (
          <p className="text-red-500 text-lg">You are not signed in.</p>
        )}
      </main>
    </div>
  );
}
