import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [islogin, setislogin] = useState(false);
  const [userdata, setuserdata] = useState(null);
  const [loading, setLoading] = useState(true);

  // default to send cookies on every request
  axios.defaults.withCredentials = true;

  const getuserdata = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/data`);
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
      const { data } = await axios.get(`${backendurl}/api/auth/islogin`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    backendurl,
    islogin,
    setislogin,
    userdata,
    setuserdata,
    getuserdata,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};
