"use client";
import React, { useEffect, useState } from "react";
import HeaderBar from "@/app/HeaderBar";
import { auth, db } from "../../../../firebaseConfig";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Overlay from "@/app/Components/Overlay";
import { v4 } from "uuid";
import UserPosts from "@/app/Components/userPosts";

export default function ProfilePage() {
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPhoto, setItemPhoto] = useState<string>("");
  const [itemPrice, setItemPrice] = useState(null as number | null);

  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  const handleUserData = async (
    itemName: string,
    itemDescription: string,
    itemPhoto: string,
    itemPrice: number | null
  ) => {
    console.log("Running handleUserPostData");

    const postId = v4();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No authenticated user.");
      return;
    }
    const uid = user.uid;
    try {
      await setDoc(doc(db, "posts", postId), {
        Content: itemDescription,
        Title: itemName,
        authorID: uid,
        price: itemPrice,
        createdAt: serverTimestamp(),
        imageUrl: itemPhoto || "",
      });
      console.log("User document created.");
      const userDocRef = doc(db, "users", uid);

      await updateDoc(userDocRef, {
        posts: arrayUnion(postId),
      });
    } catch (err) {
      console.error("Error creating user document:", err);
    }
  };

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
            {/* <p className="text-gray-700 text-xl">You&apos;re signed in ✔️</p> */}
            <div className="bg-gray-700 w-full p-[1px] rounded"></div>
            <div className="flex flex-col space-y-2">
              <UserPosts></UserPosts>
            </div>
            {/* <button
              onClick={toggleOverlay}
              className="text-white bg-blue-600 px-7 py-4 rounded-2xl font-bold  hover:bg-blue-500 transition-all duration-300 ease-in-out"
            >
              POST
            </button> */}

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
              <form
                className="flex flex-col items-center space-y-6"
                action={() => {
                  handleUserData(
                    itemName,
                    itemDescription,
                    itemPhoto,
                    itemPrice
                  );
                  setIsOpen(false);
                }}
              >
                <legend className=" text-black text-2xl font-bold mb-4">
                  Create a Post
                </legend>
                <div className="flex flex-row w-2/3 mx-auto">
                  <label className="flex-none text-black " htmlFor="fname">
                    Item name:
                  </label>
                  <input
                    className="text-black w-full bg-gray-100 rounded-2xl mx-2 px-3"
                    type="text"
                    id="fname"
                    name="fname"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  ></input>
                </div>

                <div className="flex flex-row w-2/3 mx-auto">
                  <label className="flex-none text-black" htmlFor="fdesc">
                    Item Description:
                  </label>
                  <input
                    className="text-black w-full bg-gray-100 rounded-2xl mx-2 px-3"
                    type="text"
                    id="fdesc"
                    name="fdesc"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    required
                  ></input>
                </div>

                <div className="flex flex-row w-2/3 mx-auto">
                  <label className="flex-none text-black" htmlFor="fphoto">
                    Item photo URL (leave empty if not available):
                  </label>
                  <input
                    className="text-black w-full bg-gray-100 rounded-2xl mx-2 px-3"
                    type="text"
                    id="fphoto"
                    name="fphoto"
                    value={itemPhoto}
                    onChange={(e) => setItemPhoto(e.target.value)}
                  ></input>
                </div>

                <div className="flex flex-row w-2/3 mx-auto">
                  <label className="flex-none text-black" htmlFor="fprice">
                    Item price:
                  </label>
                  <input
                    className="text-black w-full bg-gray-100 rounded-2xl mx-2 px-3"
                    type="text"
                    id="fprice"
                    name="fprice"
                    value={itemPrice || ""}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    required
                  ></input>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </Overlay>
          </>
        ) : (
          <p className="text-red-500 text-lg">You are not signed in.</p>
        )}
      </main>
    </div>
  );
}
