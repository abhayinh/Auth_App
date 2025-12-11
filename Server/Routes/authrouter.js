import express from "express"
import { isauthenticated,login, logout, register, reset_password, sendresetotp, sendverifyotp, verifyemail } from "../Controller/AuthController.js"
import userauth from "../Middleware/Userauth.js"



const authrouter=express.Router()


authrouter.post("/register",register)
authrouter.post("/login",login)
authrouter.post("/logout",logout)
authrouter.post("/sendverifyotp",userauth, sendverifyotp)
authrouter.post("/verifyaccount",userauth,verifyemail )
authrouter.get("/islogin",userauth, isauthenticated)
authrouter.post("/send_reset_otp", sendresetotp)
authrouter.post("/reset_password",reset_password)


export default authrouter