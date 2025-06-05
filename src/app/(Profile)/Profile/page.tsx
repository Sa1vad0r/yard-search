"use client";
import HeaderBar from "@/app/HeaderBar";
import React from "react";

const ProfilePage = () => {
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
        <p className="text-gray-700 text-xl">Name: John Doe</p>
        <p className="text-gray-700 text-xl">Email: </p>
        <p className="text-gray-700 text-xl">fill this outs </p>
      </main>
    </div>
  );
};

export default ProfilePage;
