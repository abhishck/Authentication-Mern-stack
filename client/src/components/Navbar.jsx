import React, { useState } from "react";
import image from "../assets/auth.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../AppContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
function Navbar() {

  const context = useAppContext();
  const navigate=useNavigate()
  const logoutHandler=async()=>{
    try {
      const {data}=await axios.get(`${context.backendUrl}/api/auth/logout`,{withCredentials:true});
      if(data.success){
        toast.success(data.message)
        context.setIsLoggedIn(false);
      context.setUser(false);
      }else{
        toast.error(data.message)
      }
      setTimeout(()=>{
        navigate("/")
      },1500)
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response.data.message)
    }
  }
  
  
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full h-[80px] fixed z-10 shadow-md bg-white top-0 px-8 py-2 lg:py-0 sm:px-12 md:px-24 lg:px-32">
      {/* laptop view */}

      <div className="w-full flex items-center justify-between  ">
        <div className="left-img h-15 w-15 lg:h-20 lg:w-20 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src={image}
            alt=""
            className="h-20 sm:h-24 md:h-38rounded-full object-center object-cover "
          />
        </div>
        {!context.isLoggedIn && (
          <div className="lg:hidden flex items-center h-full ">
          <FontAwesomeIcon
            icon={faBars}
            className="text-xl sm:text-2xl text-red-500"
            onClick={() => setIsOpen(true)}
          />
        </div>
        )}
        
        {context.isLoggedIn ? (
          <div className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center  cursor-pointer group  relative">
            <h1 className="uppercase text-xl text-white">
              {(context.user?.user?.name || "U")[0]}
            </h1>
            <div className="absolute top-[100%] right-[50%] rounded-lg overflow-hidden w-fit hidden group-hover:block">
             <Link to="/verify-email"> 
              <button className="px-5 py-2 hidden lg:block text-nowrap bg-red-500  text-white font-medium font-[Outfit] hover:bg-red-700 transition-all duration-300 cursor-pointer">
                verify email
              </button>
             </Link>
              <button onClick={logoutHandler} className="px-5 py-2 w-full hidden lg:block bg-red-500  text-white font-medium font-[Outfit] hover:bg-red-700 transition-all duration-300 cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <button className="px-5 py-2 hidden lg:block bg-red-500 rounded-lg text-white font-medium font-[Outfit] hover:bg-red-700 transition-all duration-300 cursor-pointer">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* mobile view */}

      <div
        className={`lg:hidden fixed inset-0 bg-white px-8 py-4 sm:py-6 sm:px-12 md:px-24 lg:px-32 z-10 flex flex-col items-center gap-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transiton-all duration-400`}
      >
        <div className="w-full flex items-center justify-between">
          <div className="left-img h-18 w-18 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={image}
              alt=""
              className="h-20 sm:h-24 md:h-30 lg:h-32 rounded-full object-center object-cover "
            />
          </div>

          <div className="lg:hidden">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-xl  sm:text-2xl text-red-500"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
        <Link to="/login" className="px-5 py-3 rounded-lg hover:bg-red-500 w-full hover:text-white transition-all duration-300 text-xl font-medium font-[Outfit] text-center border-b border-gray-500">
        
          Login
        </Link>
        
        <a
          href=""
          className="px-5 py-3 rounded-lg hover:bg-red-500 w-full hover:text-white transition-all duration-300 text-xl font-medium font-[Outfit] text-center border-b border-gray-500"
        >
          verify Email
        </a>
        <a
          href=""
          className="px-5 py-3 rounded-lg hover:bg-red-500 w-full hover:text-white transition-all duration-300 text-xl font-medium font-[Outfit] text-center border-b border-gray-500"
        >
          Logout
        </a>
      </div>
    </div>
  );
}

export default Navbar;
