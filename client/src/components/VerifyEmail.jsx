import React, { useEffect, useState } from "react";
import background from "../assets/background.jpg";
import { useAppContext } from "../AppContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";

function VerifyEmail() {
  // const [timer, setTimer] = useState(5);
  const context = useAppContext();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState(
    `${location.state?.from}` || "verifyemail"
  );

  console.log(location);

  useEffect(() => {
    if (state === "verifyemail") {
      alreadyVerifiedHandler();
      sendEmail();
    }
  }, []);

  const sendEmail = async () => {
    try {
      const { data } = await axios.get(
        `${context.backendUrl}/api/auth/send-otp`,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.log(error.response.data.message);
      // toast.error(error.response.data.message);
    }
  };

  const alreadyVerifiedHandler = () => {
    const isVerified = context.user.user.isAccountverified;
    if (isVerified) {
      toast.error("Account Already verified!!");

      navigate("/");

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  console.log(otp);

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (state === "verifyemail") {
      try {
        const { data } = await axios.post(
          `${context.backendUrl}/api/auth/verify-otp`,
          { otp },
          { withCredentials: true }
        );
        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }
    } else {
      try {
        const { data } = await axios.post(
          `${context.backendUrl}/api/auth/verify-forget-otp`,
          { otp },
          { withCredentials: true }
        );
        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            navigate("/update-password");
          }, 1500);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }
    }
  };


const resendOtp = async () => {
  try {
    const { data } = await axios.get(
      `${context.backendUrl}/api/auth/send-otp`,
      { withCredentials: true }
    );
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  } catch (error) {
    console.log(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

return (
  <>
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="container1 w-full h-screen sm:w-[50vw] sm:h-fit lg:w-[40vw] xl:w-[30vw] bg-white/20 backdrop-blur-xl border border-white/40 shadow-xl  p-10 sm:rounded-xl transition-all duration-400">
        <div className="flex flex-col w-full items-center justify-center gap-4">
          <h1 className="text-3xl font-medium text-white font-[Outfit] capitalize">
            verify otp
          </h1>
          <p className="text-xl font-medium text-white/60 font-[Outfit] text-center">
            Enter the Otp sent to your email
          </p>
          <form
            onSubmit={verifyOtp}
            className="flex  flex-col items-center justify-center gap-6 w-full mt-2"
          >
            <div className="flex items-center justify-center space-x-4 w-full">
              <input
                type="text"
                maxLength={1}
                onChange={(e) => setOtp((prev) => prev + e.target.value)}
                className="w-10 h-10 rounded-lg bg-white/70 focus:ring-2 focus:ring-pink-300 flex items-center justify-center outline-none text-gray-800 p-3"
              />
              <input
                type="text"
                maxLength={1}
                onChange={(e) => setOtp((prev) => prev + e.target.value)}
                className="w-10 h-10 rounded-lg bg-white/70 focus:ring-2 focus:ring-pink-300 flex items-center justify-center outline-none text-gray-800 p-3"
              />
              <input
                type="text"
                maxLength={1}
                onChange={(e) => setOtp((prev) => prev + e.target.value)}
                className="w-10 h-10 rounded-lg bg-white/70 focus:ring-2 focus:ring-pink-300 flex items-center justify-center outline-none text-gray-800 p-3"
              />
              <input
                type="text"
                maxLength={1}
                onChange={(e) => setOtp((prev) => prev + e.target.value)}
                className="w-10 h-10 rounded-lg bg-white/70 focus:ring-2 focus:ring-pink-300 flex items-center justify-center outline-none text-gray-800 p-3"
              />
              <input
                type="text"
                maxLength={1}
                onChange={(e) => setOtp((prev) => prev + e.target.value)}
                className="w-10 h-10 rounded-lg bg-white/70 focus:ring-2 focus:ring-pink-300 flex items-center justify-center outline-none text-gray-800 p-3"
              />
              <input
                type="text"
                maxLength={1}
                onChange={(e) => setOtp((prev) => prev + e.target.value)}
                className="w-10 h-10 rounded-lg bg-white/70 focus:ring-2 focus:ring-pink-300 flex items-center justify-center outline-none text-gray-800 p-3"
              />
            </div>
            {/* <div className="timer text-center">{timer}</div> */}
            <div className="flex items-center gap-5 w-full justify-center mt-2">
              <button
                type="submit"
                className="px-5 py-2  outline-none rounded-lg text-white bg-blue-600 cursor-pointer"
              >
                Submit
              </button>
              {state === "verifyemail" && (
                <button
                  type="submit"
                  onClick={resendOtp}
                  className="px-5 py-2  outline-none rounded-lg text-white bg-red-600 cursor-pointer"
                >
                  Resend
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);
}

export default VerifyEmail;
