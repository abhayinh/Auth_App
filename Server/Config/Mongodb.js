import mongoose from "mongoose";

const connect_db = async () => {
  mongoose.connection.on("connected", () => console.log("Database connected"));

  await mongoose.connect(process.env.MONGO_URI);
};

export default connect_db;
