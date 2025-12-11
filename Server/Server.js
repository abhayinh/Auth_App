import express from "express"
import cors from "cors"
import "dotenv/config.js"
import cookieParser from "cookie-parser"
import { connect } from "mongoose"


const port =process.env.PORT || 4000
connect_db()

import connect_db from "./Config/Mongodb.js"


import authrouter from "./Routes/authrouter.js"
import userroute from "./Routes/User_route.js"

const allowedorigins = [
  "http://localhost:5173",
  "https://auth-app-gamma-five.vercel.app"  
];


const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedorigins,credentials:true}))



// All Router end points 

app.get("/",(req,res)=>{
    res.send("Api working ")
})

app.use("/api/auth",authrouter)
app.use("/api/user",userroute)



app.listen(port,()=>{
    console.log(`App is listen in ${port}`)
})