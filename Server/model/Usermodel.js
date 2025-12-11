import mongoose, { Schema } from "mongoose";

const userschema=new mongoose.Schema({

    name:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    verifyotp:{type:String ,default:""},
    verify_otp_extpiry:{type:Number,default:0},
    isaccountverify:{type:Boolean,default:false},
    resetotp:{type:String,default:" "},
    resetotpexpiryat:{type:Number,default:0}


})

const usermodel= mongoose.models.user || mongoose.model("user",userschema)

export default usermodel 