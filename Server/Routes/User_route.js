import express from "express"
import userauth from "../Middleware/Userauth.js"
import userdata from "../Controller/Usercontroller.js"


const userroute=express.Router()

userroute.get("/data",userauth,userdata)





export default userroute