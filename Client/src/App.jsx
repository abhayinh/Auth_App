import {  Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Email_verify from "./Pages/Email_verify"
import Reset_password from "./Pages/Reset_password"
import { ToastContainer } from 'react-toastify';

function App(){

    return<>

    <ToastContainer/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="Login" element={<Login/>}/>
        <Route path="Email_verify" element={<Email_verify/>}/>
        <Route path="Reset_password" element={<Reset_password/>}/>
    </Routes>



    </>


}


export default App