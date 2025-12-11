import React, { useState, useRef, useContext } from "react"; // added React import and useRef
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Reset_password() {


    const{backendurl}=useContext(AppContext)

    axios.defaults.withCredentials=true


    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newpassword,setnewpassword]=useState("")

    const[isemailsent,setisemailsent]=useState("")
    const[isotpsubmit,setisotpsubmit]=useState(false)

    const[otp,setotp]=useState(0)

    const inputrefs = useRef([]); // changed React.useRef to useRef

    const handleinput = (e, index) => {
        if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
            inputrefs.current[index + 1].focus();
        }
    }

    const handlekeydown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === '' && index > 0) {
            inputrefs.current[index - 1].focus();
        }
    }

    const handlepaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pastearray = paste.split('');
        pastearray.forEach((char, index) => {
            if (inputrefs.current[index]) {
                inputrefs.current[index].value = char;
            }
        })
    }


    const onSubmitemail= async(e)=>{
        e.preventDefault()
        try {
            const {data} =await axios.post(backendurl+"/api/auth/send_reset_otp",{email})
            data.success ? toast.success(data.message):toast.error(data.message)
            data.success && setisemailsent(true) 
        } catch (error) {
            toast.error(error.message)
        }
    }


    const otpsumbit=async(e)=>{
        e.preventDefault();
        const otparray=inputrefs.current.map(e=>e.value)
        setotp(otparray.join(''))
        setisotpsubmit(true)
    }


    const onsubmitnewpassword=async(e)=>{
          e.preventDefault();
          try {
            const {data}=await axios.post(backendurl+"/api/auth/reset_password" ,{email,otp,newpassword},)
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate("/")
          } catch (error) {
            toast.error(error.message)
          }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">

            <img
                onClick={() => navigate("/")}
                src={assets.logo}
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />

    {!isemailsent && 
                <form onSubmit={onSubmitemail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password </h1>
                    <p className="text-center mb-6 text-indigo-300 ">Enter You register input field  </p>

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-gray-100">
                        <img src={assets.mail_icon} alt="" className="w-3 h-3" />
                        <input
                            type="email"
                            placeholder="Email Id "
                            className="bg-transparent outline-none w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
                        Submit
                    </button>

                </form>
    }

    
    {/* reset passoword otp input form */}

 {!isotpsubmit && isemailsent &&
        <form onSubmit={otpsumbit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Email verify Otp </h1>
                <p className="text-center mb-6 text-indigo-300 ">Enter the 6 digit code send to your email id  </p>

                <div className="flex justify-between mb-8" onPaste={handlepaste} >
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            type="text"
                            maxLength="1"
                            key={index}
                            required
                            className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md"
                            ref={e => inputrefs.current[index] = e}
                            onInput={(e) => handleinput(e, index)}
                            onKeyDown={(e) => handlekeydown(e, index)}
                        />
                    ))}
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Sumbit</button>

            </form>
    }
          
          

            

{/* Enter new password  */}


{isotpsubmit && isemailsent &&

     <form onSubmit={onsubmitnewpassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

                <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password </h1>
                <p className="text-center mb-6 text-indigo-300 ">Enter the new password below  </p>

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-gray-100">
                    <img src={assets.lock_icon} alt="" className="w-3 h-3" />
                    <input
                        type="password"
                        placeholder="password "
                        className="bg-transparent outline-none w-full"
                        value={newpassword}
                        onChange={(e) => setnewpassword(e.target.value)}
                        required
                    />
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
                    Submit
                </button>

            </form>

}
            
         
        </div>

    )
}

export default Reset_password;
