"use client";
import React from "react";

function truncateDescription(description: string) {
  const sentences = description.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= 0) return description;
  return sentences.slice(0, 2).join(" ").trim() + "...";
}

const CardItem: React.FC = () => {
  const description = " lorem. ipsum. siweragr wrgra aw";
  return (
    <main className="flex flex-col w-full h-[280px] relative">
      <div className="flex flex-row p-2 w-full h-full hover:shadow-2xl hover:bg-white transition-all duration-500 ease-in-out rounded-2xl relative">
        {/* Options Menu Button */}
        <div className="absolute top-4 right-4">
          <button
            className="text-black hover:bg-gray-300 w-8 rounded-full text-2xl font-bold focus:outline-none"
            title="Options"
            onClick={() => {
              // Placeholder for options menu functionality
              console.log("Options clicked");
            }}
          >
            ⋮
          </button>
        </div>

        {/* Left Image/Preview Box */}
        <div className="bg-green-100 shadow-inner rounded-2xl h-full w-4/6"></div>

        {/* Right Info Section */}
        <div className="flex flex-col w-2/6 mx-4 space-y-2">
          <h1 className="text-black text-xl font-serif font-bold">1000$</h1>
          <h1 className="text-black text-lg font-serif">
            {truncateDescription(description)}
          </h1>
          <h1 className="text-black text-sm font-serif font-bold">
            14 miles away
          </h1>

          <div className="w-2/6 absolute bottom-2 right-2 flex flex-col transition-all ease-in-out duration-500 bg-gray-200 hover:bg-gray-300 rounded-2xl">
            <button className="bg-green-600 h-14 transition-all ease-in-out duration-500 w-full hover:bg-green-700 hover:shadow-2xl text-2xl  font-bold text-white rounded-2xl">
              CONTACT
            </button>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-[1px] w-full bg-gray-300 rounded-full"></div>
    </main>
  );
};

export default CardItem;
