import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [islogin, setislogin] = useState(false);
  const [userdata, setuserdata] = useState(false);
  const [loading, setLoading] = useState(true);

  const getuserdata = async () => {
    try {
      const { data } = await axios.get(
        `${backendurl}/api/user/data`,
        { withCredentials: true }
      );

      if (data.success) {
        setuserdata(data.userdata);
      } else {
        setuserdata(null);
      }

    } catch (error) {
      setuserdata(null);
    }
  };

  const getauth = async () => {
    try {
      const { data } = await axios.get(
        `${backendurl}/api/auth/isauthenticated`,
        { withCredentials: true }
      );

      if (data.success) {
        setislogin(true);
        await getuserdata();
      } else {
        setislogin(false);
        setuserdata(null);
      }

    } catch (error) {
      setislogin(false);
      setuserdata(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getauth();
  }, []);

  const value = {
    backendurl,
    islogin,
    setislogin,
    userdata,
    setuserdata,
    getuserdata,
    loading,
  };

  return <AppContext.Provider value={value}>
    {!loading && children}
  </AppContext.Provider>;
};
