import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Email_verify from "./Pages/Email_verify.jsx";
import Reset_password from "./Pages/Reset_password.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email_verify" element={<Email_verify />} />
        <Route path="/reset_password" element={<Reset_password />} />
      </Routes>
    </>
  );
}

export default App;
    