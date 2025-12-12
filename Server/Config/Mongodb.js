import mongoose from "mongoose";

const connect_db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // options recommended by mongoose
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};

export default connect_db;
