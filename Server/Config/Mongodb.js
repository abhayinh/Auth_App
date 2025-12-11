import mongoose from "mongoose";

const connect_db=async()=>{

    mongoose.connection.on("connected",()=>console.log("Database connected"))

    await mongoose.connect(`${process.env.monogodb_url}/Auth_App`)
}


export default connect_db