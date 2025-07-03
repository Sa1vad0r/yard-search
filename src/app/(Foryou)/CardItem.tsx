"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Make sure this is the Firestore export

interface Post {
  authorID: string;
  id: string;
  Title: string;
  Content: string;
  price: number;
}

interface CardItemProps {
  post: Post;
}

const CardItem: React.FC<CardItemProps> = ({ post }) => {
  const [authorName, setAuthorName] = useState<string>("");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        console.log("Fetching user with ID:", post.authorID);
        const docRef = doc(db, "users", post.authorID);
        console.log("DocRef path:", docRef.path);

        const docSnap = await getDoc(docRef);
        console.log("Document exists:", docSnap.exists());

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Document data:", data);

          setAuthorName(data.name || "Unknown Author");
        } else {
          console.warn("No such document found.");
          setAuthorName("Unknown Author");
        }
      } catch (err) {
        console.error("Error while fetching author:", err);
        setAuthorName("Unknown Author");
      }
    };

    fetchAuthor();
  }, [post.authorID]);

  return (
    <button className="flex flex-col w-full h-[280px] relative">
      <div className="flex flex-row p-2 w-full h-full hover:shadow-lg hover:bg-white transition-all duration-500 ease-in-out rounded-2xl relative">
        <div className="bg-green-100 shadow-inner rounded-2xl h-full w-4/6">
          {/* {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover rounded-2xl"
            />
          )} */}
        </div>

        <div className="flex flex-col text-left w-2/6 mx-4 space-y-2">
          <h1 className="text-black text-xl font-serif font-bold">
            {post.Title}
          </h1>

          <h1 className="text-black text-md font-serif">{post.Content}</h1>
          <div className="my-auto w-full"></div>
          <h1 className="text-green-600 text-xl font-serif font-bold">
            {post.price}$
          </h1>
          <h1 className="text-black text-xs italic">Seller: {authorName}</h1>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-300 rounded-full"></div>
    </button>
  );
};

export default CardItem;
