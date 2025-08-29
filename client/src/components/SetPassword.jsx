import React, { useEffect, useState } from "react";
import background from "../assets/background.jpg";
import vector from "../assets/circleVector.svg";
import { useAppContext } from "../AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


function SetPassword() {
  
  const [newPassword,setNewPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("");

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
   newPassword:"",
   confirmPassword:""
  });
  const [isLoading,setIsLoading]=useState(false);
  const navigate=useNavigate();

  const context = useAppContext();
  // console.log(context);

 

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsError(false);

    const error = {
      
     newPassword:"",
     confirmPassword:""
      
    };

    
    if (!newPassword) {
      setIsError(true);
      error.newPassword = "**New Password is required !!";
    }
    if (!confirmPassword) {
      setIsError(true);
      error.confirmPassword = "**Password is required !!";
    }
    

    setErrorMsg(error);
    if (error.confirmPassword || error.newPassword ) return;

    try {
      setIsLoading(true)
      const { data } = await axios.post(`${context.backendUrl}/api/auth/reset-password`,{newPassword,confirmPassword}, {
        withCredentials: true,
      });
      if (data.success) {
        console.log(data.message);
        toast.success(data.message)
      } else {
        toast.error(data.message)
        console.log(data.message);
      }
     setTimeout(()=>{
       navigate("/login")
     },1500)

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
    finally{
      setIsLoading(false)
    }
  };
  return (
    <div
      className="flex items-center justify-center w-full min-h-screen bg-cover bg-top"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-0 right-0">
        <img src={vector} />
      </div>
      <div className="container1 w-full h-screen sm:w-[50vw] sm:h-fit lg:w-[40vw] xl:w-[30vw] bg-white/20 backdrop-blur-xl border border-white/40 shadow-lg flex flex-col gap-7 p-10 sm:rounded-xl transition-all duration-400">
        <div className="left">
          <div className="heading flex items-center justify-center flex-col gap-2 w-full text-center">
            <h1 className="text-3xl font-medium text-white font-[Outfit]">
             Reset your Password
            </h1>
            <p className="text-xl font-medium text-white/60 font-[Outfit]">
              Do not worry for password!!
            </p>
          </div>
          <form
            onSubmit={submitHandler}
            className="flex flex-col gap-4 w-full mt-2"
          >
           
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="email"
                className="text-md font-[Outfit] text-white"
              >
                New Password :{" "}
              </label>
              <input
                type="text"
                placeholder="Enter Email "
                className="px-5 py-2 focus:outline-none  backdrop-blur-lg  border border-white/70 focus:ring-2 placeholder-white/80  focus:ring-pink-400 rounded-xl  text-white"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
              {isError && (
                <span className="text-light text-sm text-red-500 font-[Outfit] ">
                  {errorMsg.newPassword}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="email"
                className="text-md font-[Outfit] text-white"
              >
                Confirm Password :{" "}
              </label>
              <input
                type="password"
                placeholder="Enter Email "
                className="px-5 py-2 focus:outline-none  backdrop-blur-lg  border border-white/70 focus:ring-2 placeholder-white/80  focus:ring-pink-400 rounded-xl  text-white"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              {isError && (
                <span className="text-light text-sm text-red-500 font-[Outfit] ">
                  {errorMsg.confirmPassword}
                </span>
              )}
            </div>
           
          
           
            <button
              type="submit"
              className="px-5 py-2  outline-none rounded-lg text-white bg-blue-600 cursor-pointer"
            >
             Update Password
            </button>
          </form>
          
         
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
