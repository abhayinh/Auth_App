import App from "../App.jsx";
import { assets } from "../assets/assets.js";

import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/AppContext.jsx";

const Header = () => {
  const { userdata } = useContext(AppContext);
  const [showGreeting, setShowGreeting] = useState(false);

  // Trigger transition whenever userdata changes
  useEffect(() => {
    setShowGreeting(false); // reset
    const timer = setTimeout(() => setShowGreeting(true), 50); // fade in
    return () => clearTimeout(timer);
  }, [userdata]);

  const displayName = userdata ? userdata.name : "";

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 transition-all duration-500 ease-in-out">
      
      <img
        src={assets.header_img}
        className="w-36 h-36 rounded-full mb-6 transition-transform duration-500 ease-in-out transform hover:scale-105"
      />

      <h1
        className={`flex items-center gap-2 text-xl sm:3xl font-medium mb-2 transition-all duration-500 ease-in-out 
          ${showGreeting ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        Hey {displayName} <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4 transition-opacity duration-700 ease-in-out">
        Welcome to Our App
      </h2>

      <p className="mb-8 max-w-md transition-opacity duration-700 ease-in-out">
        Let's start with Quick Product tour and we will have you up and running in no time!!
      </p>

      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all duration-300 ease-in-out">
        Get started
      </button>
    </div>
  );
};

export default Header;
