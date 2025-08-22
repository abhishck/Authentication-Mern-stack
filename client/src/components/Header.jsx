import React from "react";
import Navbar from "./Navbar";
import robot from "../assets/robot.svg";
import { useAppContext } from "../AppContext";

function Header() {
  const context=useAppContext()
  return (
    <>
      <div className="w-full h-screen overflow-hidden ">
        <Navbar />
        <div className="flex  px-8 py-2 sm:py-6 sm:px-12 md:px-24 lg:px-32 flex-col items-center justify-center gap-2 w-full h-full  object-contain object-center overflow-hidden">
          <img src={robot} alt="" className="h-60" />
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium font-[Outfit] text-gray-900 capitalize">
           {context.user ?`hii ${context.user.user.name}` :" hii developer 👋"}
          </h1>
          <p className="mt-2 text-gray-700 text-lg font-[Outfit] font-medium capitalize text-center max-w-[90vw]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora
            ratione fugiat ducimus magnam consectetur laudantium!
          </p>
        </div>
      </div>
    </>
  );
}

export default Header;
