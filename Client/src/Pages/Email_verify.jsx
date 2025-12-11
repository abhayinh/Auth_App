import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Email_verify() {
  const { backendurl, islogin, userdata, getuserdata } = useContext(AppContext);
  const navigate = useNavigate();

  const inputrefs = React.useRef([]);

  const handleinput = (e, index) => {
    if (e.target.value.length > 0 && index < 5) {
      inputrefs.current[index + 1].focus();
    }
  };

  const handlekeydown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputrefs.current[index - 1].focus();
    }
  };

  const onsubmithandler = async (e) => {
    e.preventDefault();

    const otp = inputrefs.current.map((i) => i.value).join("");

    try {
      const { data } = await axios.post(
        `${backendurl}/api/auth/verifyemail`,
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await getuserdata();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (islogin && userdata?.isaccountverify) {
      navigate("/");
    }
  }, [islogin, userdata]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 w-28 cursor-pointer"
      />

      <form onSubmit={onsubmithandler} className="bg-slate-900 p-8 rounded-lg w-96">
        <h1 className="text-white text-2xl text-center mb-4">Email Verify OTP</h1>

        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                maxLength="1"
                ref={(e) => (inputrefs.current[index] = e)}
                onInput={(e) => handleinput(e, index)}
                onKeyDown={(e) => handlekeydown(e, index)}
                className="w-12 h-12 bg-[#333A5C] text-white text-xl rounded-md text-center"
                required
              />
            ))}
        </div>

        <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
}

export default Email_verify;
