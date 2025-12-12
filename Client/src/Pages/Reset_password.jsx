import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function Reset_password() {
  const { backendurl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [isemailsent, setisemailsent] = useState(false);
  const [isotpsubmit, setisotpsubmit] = useState(false);
  const inputrefs = useRef([]);

  const handleinput = (e, index) => {
    if (e.target.value.length > 0 && index < 5) inputrefs.current[index + 1]?.focus();
  };

  const handlekeydown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) inputrefs.current[index - 1]?.focus();
  };

  const onSubmitemail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/send_reset_otp`, { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setisemailsent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const otpsumbit = (e) => {
    e.preventDefault();
    const otparray = inputrefs.current.map(i => i.value);
    const otp = otparray.join("");
    // store OTP in local state or pass as required to reset endpoint
    // We'll send otp and email/newpassword on next step
    sessionStorage.setItem("reset_otp", otp);
    setisotpsubmit(true);
  };

  const onsubmitnewpassword = async (e) => {
    e.preventDefault();
    const otp = sessionStorage.getItem("reset_otp") || "";
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/reset_password`, { email, otp, newpassword });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) {
        sessionStorage.removeItem("reset_otp");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img src={assets.logo} onClick={() => navigate("/")} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" alt="logo" />
      {!isemailsent && (
        <form onSubmit={onSubmitemail} className="bg-slate-900 p-8 rounded-lg w-96">
          <h1 className="text-white text-2xl text-center mb-4">Reset Password</h1>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} className="w-3 h-3" alt="mail" />
            <input type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none text-gray-100 w-full" required />
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Submit</button>
        </form>
      )}

      {!isotpsubmit && isemailsent && (
        <form onSubmit={otpsumbit} className="bg-slate-900 p-8 rounded-lg w-96">
          <h1 className="text-white text-2xl text-center mb-4">Verify OTP</h1>
          <div className="flex justify-between mb-8">
            {Array(6).fill(0).map((_, index) => (
              <input key={index} maxLength="1" ref={e => inputrefs.current[index] = e} className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" onInput={(e) => handleinput(e, index)} onKeyDown={(e) => handlekeydown(e, index)} required />
            ))}
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Submit OTP</button>
        </form>
      )}

      {isotpsubmit && isemailsent && (
        <form onSubmit={onsubmitnewpassword} className="bg-slate-900 p-8 rounded-lg w-96">
          <h1 className="text-white text-2xl text-center mb-4">New Password</h1>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} className="w-3 h-3" alt="lock" />
            <input type="password" placeholder="New Password" value={newpassword} onChange={(e) => setnewpassword(e.target.value)} className="bg-transparent text-white outline-none w-full" required />
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Save Password</button>
        </form>
      )}
    </div>
  );
}

export default Reset_password;
