import { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const { backendurl, setislogin, getuserdata } = useContext(AppContext);

  const [state, setstate] = useState("signup");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const onsubmithandle = async (e) => {
    e.preventDefault();
    try {
      if (state === "signup") {
        const { data } = await axios.post(`${backendurl}/api/auth/register`, { name, email, password });
        if (data.success) {
          setislogin(true);
          await getuserdata();
          navigate("/");
        } else {
          toast.error(data.message || "Signup failed");
        }
      } else {
        const { data } = await axios.post(`${backendurl}/api/auth/login`, { email, password });
        if (data.success) {
          setislogin(true);
          await getuserdata();
          navigate("/");
        } else {
          toast.error(data.message || "Invalid email or password");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={() => navigate("/")} src={assets.logo} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" alt="logo" />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">{state === "signup" ? "Create Account" : "Login"}</h2>
        <p className="text-center text-sm mb-6">{state === "signup" ? "Create your account" : "Login to your account"}</p>
        <form onSubmit={onsubmithandle}>
          {state === "signup" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input onChange={(e) => setname(e.target.value)} value={name} className="bg-transparent outline-none text-gray-200 w-full" type="text" placeholder="Enter Name" required />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setemail(e.target.value)} value={email} className="bg-transparent outline-none text-gray-200 w-full" type="email" placeholder="Enter Email" required />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setpassword(e.target.value)} value={password} className="bg-transparent outline-none text-gray-200 w-full" type="password" placeholder="Enter Password" required />
          </div>
          <p onClick={() => navigate("/reset_password")} className="mb-4 text-indigo-500 cursor-pointer">Forgot password?</p>
          <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">{state === "signup" ? "Sign Up" : "Login"}</button>
        </form>
        {state === "signup" ? (
          <p className="text-gray-400 text-center text-xs mt-4">Already have an account?<span onClick={() => setstate("login")} className="ml-2 text-blue-400 cursor-pointer underline">Login here</span></p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">Don’t have an account?<span onClick={() => setstate("signup")} className="ml-2 text-blue-400 cursor-pointer underline">Create account</span></p>
        )}
      </div>
    </div>
  );
}

export default Login;
