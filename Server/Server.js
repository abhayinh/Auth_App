import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

import connect_db from "./Config/Mongodb.js";
import authrouter from "./Routes/authrouter.js";
import userroute from "./Routes/User_route.js";

const port = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://auth-app-gamma-five.vercel.app"
];

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS not allowed for this origin"), false);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

connect_db();

app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/auth", authrouter);
app.use("/api/user", userroute);

app.listen(port, () => {
  console.log(`App running on ${port}`);
});
