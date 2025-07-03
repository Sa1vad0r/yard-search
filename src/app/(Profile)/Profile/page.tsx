"use client";
import React, { useEffect, useState } from "react";
import HeaderBar from "@/app/HeaderBar";
import { auth, db } from "../../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User is signed in:", currentUser.uid);

        console.log("Searching for UID:", currentUser.uid);
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("UID", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          console.log("Query snapshot size:", querySnapshot.size);
          querySnapshot.forEach((doc) => console.log(doc.id, doc.data()));

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserName(userData.name || "Unknown Author");
            console.log("Query snapshot size:", querySnapshot.size);
            querySnapshot.forEach((doc) => {
              console.log("Matched doc ID:", doc.id);
              console.log("Matched data:", doc.data());
            });
          } else {
            console.warn("No user document found for UID:", currentUser.uid);
            setUserName("Unknown Author");
          }
        } catch (err) {
          console.error("Error while fetching user:", err);
          setUserName("Unknown Author");
        }
      } else {
        console.warn("No user is logged in.");
        setUser(null);
        setUserName(""); // Reset name if signed out
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
