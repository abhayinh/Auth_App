import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import connect_db from "./Config/Mongodb.js";

const port = process.env.PORT || 4000;

connect_db();

import authrouter from "./Routes/authrouter.js";
import userroute from "./Routes/User_route.js";

const allowedorigins = [
  "http://localhost:5173",
  "https://auth-app-gamma-five.vercel.app",  
];

const app = express();

app.set("trust proxy", 1); // IMPORTANT FOR COOKIES

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedorigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS Not Allowed"), false);
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Api working ");
});

app.use("/api/auth", authrouter);
app.use("/api/user", userroute);

app.listen(port, () => {
  console.log(`App is listen in ${port}`);
});
