import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import usermodel from "../model/Usermodel.js";
import transporter from "../Config/Nodemailer.js"
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../Config/EmailTemplete.js";

// REGISTER
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Detail" });
    }

    try {
        const existing_user = await usermodel.findOne({ email });

        if (existing_user) {
            return res.json({
                success: false,
                message: "User already exists !! Try login "
            });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const user = new usermodel({ name, email, password: hashpassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        const sendmail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Our Website",
            text: "Special thank you for creating an account!",
        };
        await transporter.sendMail(sendmail);

        return res.json({ success: true });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid username or password, or Register first"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Password is incorrect"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        return res.json({ success: true });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

// LOGOUT  (✔ FIXED VERSION)
export const logout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        return res.json({
            success: true,
            message: "Logged Out"
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        });
    }
};

// SEND VERIFY OTP
export const sendverifyotp = async (req, res) => {
    try {
        const { userid } = req.body;
        const user = await usermodel.findById(userid);

        if (user.isaccountverify) {
            return res.json({
                success: false,
                message: "Account is already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyotp = otp;
        user.verify_otp_extpiry = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailoption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account verification OTP",
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailoption);

        res.json({
            success: true,
            message: "Verification mail sent to your email"
        });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// VERIFY EMAIL OTP
export const verifyemail = async (req, res) => {
    const { userid, otp } = req.body;

    if (!userid || !otp) {
        return res.json({
            success: false,
            message: "Enter a valid OTP"
        });
    }

    try {
        const user = await usermodel.findById(userid);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.verifyotp || user.verifyotp !== otp) {
            return res.json({
                success: false,
                message: "Incorrect OTP"
            });
        }

        if (user.verify_otp_extpiry < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        user.isaccountverify = true;
        user.verifyotp = "";
        user.verify_otp_extpiry = 0;

        await user.save();

        return res.json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        return res.json({
            success: false,
            message: `Something went wrong: ${error.message}`
        });
    }
};

export const isauthenticated = (req, res) => {
    try {
        res.json({
            success: true,
            message: "Authenticated"
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// SEND RESET OTP
export const sendresetotp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetotp = otp;
    user.resetotpexpiryat = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mail = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Reset Password OTP",
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };

    await transporter.sendMail(mail);

    return res.json({
        success: true,
        message: `OTP sent to ${user.email}`
    });
};

// RESET PASSWORD
export const reset_password = async (req, res) => {
    const { otp, email, newpassword } = req.body;

    if (!otp || !email || !newpassword) {
        return res.json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetotp || user.resetotp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.resetotpexpiryat < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        const hashpassword = await bcrypt.hash(newpassword, 10);

        user.password = hashpassword;
        user.resetotp = "";
        user.resetotpexpiryat = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};
