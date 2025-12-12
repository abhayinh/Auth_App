import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const { userdata, loading, backendurl, setislogin, setuserdata } = useContext(AppContext);

  if (loading) return null;

  const sendverifyotp = async () => {
    try {
      if (!userdata?._id) {
        toast.error("User data not available");
        return;
      }
      const { data } = await axios.post(`${backendurl}/api/auth/sendverifyotp`, {
        userid: userdata._id
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/email_verify");
      } else {
        toast.error(data.message || "Unable to send verification OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const Logout = async () => {
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/logout`, {});
      if (data.success) {
        setislogin(false);
        setuserdata(null);
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full flex justify-between p-4 sm:p-6 sm:px-24 absolute top-0 items-center">
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />
      {userdata ? (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-bold relative group">
          {userdata?.name?.[0]?.toUpperCase()}
          <div className="absolute top-7 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 z-20">
            <ul className="flex flex-col text-sm text-gray-700">
              {!userdata.isaccountverify && (
                <li onClick={sendverifyotp} className="px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer rounded-t-xl">
                  Verify Email
                </li>
              )}
              <li onClick={Logout} className="px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer rounded-b-xl">Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate("/login")} className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
          Login <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
}

export default Navbar;
