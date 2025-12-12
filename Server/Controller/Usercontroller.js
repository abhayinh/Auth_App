import express from "express"
import usermodel from "../model/Usermodel.js"

const userdata= async(req,res)=>{
 try {
   
   
    const{userid}=req.body

    const user=await usermodel.findById(userid)


    if(!user){

       return res.json({
            success:false,
            message:"User not found "
        })

    }

        return res.json({
    success:true,
    userdata:{
        _id: user._id,  // ADD THIS LINE
        name:user.name,
        isaccountverify:user.isaccountverify
    }
})

    } catch (error) {
        res.json({
            success:false,
            message:`Invild request ${error}`
        })
    }


}

export default userdata