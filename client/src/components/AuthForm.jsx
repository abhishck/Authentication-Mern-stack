import React, { useEffect, useState } from "react";
import background from "../assets/background.jpg";
import vector from "../assets/circleVector.svg";
import { useAppContext } from "../AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


function AuthForm() {
  const [state, setState] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading,setIsLoading]=useState(false);
  const navigate=useNavigate();

  const context = useAppContext();
  // console.log(context);

  const url =
    state === "register"
      ? `${context.backendUrl}/api/auth/register`
      : `${context.backendUrl}/api/auth/login`;

  const payload =
    state === "register" ? { name, email, password } : { email, password };

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsError(false);

    const error = {
      username: "",
      email: "",
      password: "",
    };

    if (state==="register" && !name) {
      setIsError(true);
      error.username = "**Username is required !!";
    }
    if (!email) {
      setIsError(true);
      error.email = "**Email is required !!";
    }
    if (!password) {
      setIsError(true);
      error.password = "**Password is required !!";
    }

    setErrorMsg(error);
    if (error.username || error.email || error.password) return;

    try {
      setIsLoading(true)
      const { data } = await axios.post(url, payload, {
        withCredentials: true,
      });
      if (data.success) {
        context.setIsLoggedIn(true)
        context.getUserData()
        console.log(data.message);
        toast.success(data.message)
      } else {
        toast.error(data.message)
        console.log(data.message);
      }
     setTimeout(()=>{
       navigate("/")
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
              {state === "register" ? "Create Account" : "Login"}
            </h1>
            <p className="text-xl font-medium text-white/60 font-[Outfit]">
              {state === "register"
                ? "Create your account to get started!"
                : "Welcome Back !!"}
            </p>
          </div>
          <form
            onSubmit={submitHandler}
            className="flex flex-col gap-4 w-full mt-2"
          >
            {state === "register" && (
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="username"
                  className="text-md font-[Outfit] text-white "
                >
                  Username :{" "}
                </label>
                <input
                  type="text"
                  placeholder="Enter Username "
                  className="px-5 py-2 focus:outline-none  backdrop-blur-lg  border border-white/70 focus:ring-2 placeholder-white/80  focus:ring-pink-400 rounded-xl  text-white"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {isError && (
                  <span className="text-light text-sm text-red-500 font-[Outfit] ">
                    {errorMsg.username}
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="email"
                className="text-md font-[Outfit] text-white"
              >
                Email :{" "}
              </label>
              <input
                type="email"
                placeholder="Enter Email "
                className="px-5 py-2 focus:outline-none  backdrop-blur-lg  border border-white/70 focus:ring-2 placeholder-white/80  focus:ring-pink-400 rounded-xl  text-white"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {isError && (
                <span className="text-light text-sm text-red-500 font-[Outfit] ">
                  {errorMsg.email}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="username"
                className="text-md font-[Outfit] text-white"
              >
                Password :{" "}
              </label>
              <input
                type="password"
                placeholder="Enter Password "
                className="px-5 py-2 focus:outline-none  backdrop-blur-lg border border-white/70 focus:ring-2 placeholder-white/80  focus:ring-pink-400 rounded-xl  text-white"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {isError && (
                <span className="text-light text-sm text-red-500 font-[Outfit] ">
                  {errorMsg.password}
                </span>
              )}
            </div>
                {state==="login" && (
            <div className="w-full items-center justify-end flex lg:justify-center">
           <Link to="/forget" className="text-center text-sm font-[Outfit] text-white font-medium mt-3 hover:text-blue-500 hover:underline transition-colors duration-300">Forget Password?</Link>
          </div>
        )}
            <button
              type="submit"
              className="px-5 py-2  outline-none rounded-lg text-white bg-blue-600 cursor-pointer"
            >
              {state === "register" ? "Get Started" : "Login"}
            </button>
          </form>
          
          {state === "register" ? (
            <p className="text-center text-sm font-[Outfit] text-white font-medium mt-3">
              Already have an account ?{" "}
              <a
                href="#"
                onClick={() => setState("login")}
                className="cursor-pointer text-blue-600"
              >
                Login
              </a>
            </p>
          ) : (
            <p className="text-center text-sm font-[Outfit] text-white font-medium mt-3">
              Dont have an account ?{" "}
              <a
                href="#"
                onClick={() => setState("register")}
                className="cursor-pointer text-blue-600"
              >
                Register here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
