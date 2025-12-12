import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usermodel from "../model/Usermodel.js";
import transporter from "../Config/Nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../Config/EmailTemplete.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const existing_user = await usermodel.findOne({ email });
    if (existing_user) {
      return res.json({ success: false, message: "User already exists. Try login." });
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
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our App",
      text: "Thank you for creating an account!"
    }).catch(err => {
      console.warn("Welcome email failed (non-fatal):", err.message);
    });

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required." });
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password." });
    }

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) return res.json({ success: false, message: "Incorrect password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax"
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// SEND VERIFY OTP (protected: expects userid in body provided by middleware)
export const sendverifyotp = async (req, res) => {
  try {
    const { userid } = req.body;
    const user = await usermodel.findById(userid);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.isaccountverify) return res.json({ success: false, message: "Account already verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verify_otp_extpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your email",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }).catch(err => {
      console.warn("Verify email send failed (non-fatal):", err.message);
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// VERIFY EMAIL OTP (protected: middleware sets userid)
export const verifyemail = async (req, res) => {
  const { userid, otp } = req.body;
  if (!userid || !otp) return res.json({ success: false, message: "Invalid request" });

  try {
    const user = await usermodel.findById(userid);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (!user.verifyotp || user.verifyotp !== otp) return res.json({ success: false, message: "Incorrect OTP" });
    if (user.verify_otp_extpiry < Date.now()) return res.json({ success: false, message: "OTP expired" });

    user.isaccountverify = true;
    user.verifyotp = "";
    user.verify_otp_extpiry = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// IS AUTHENTICATED (protected)
export const isauthenticated = (req, res) => {
  return res.json({ success: true });
};

// SEND RESET OTP (public)
export const sendresetotp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email required" });

  try {
    const user = await usermodel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetotp = otp;
    user.resetotpexpiryat = Date.now() + 15 * 60 * 1000;
    await user.save();

    transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset password OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }).catch(err => {
      console.warn("Reset OTP email failed (non-fatal):", err.message);
    });

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// RESET PASSWORD (public)
export const reset_password = async (req, res) => {
  const { otp, email, newpassword } = req.body;
  if (!otp || !email || !newpassword) {
    return res.json({ success: false, message: "All fields required" });
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.resetotp || user.resetotp !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetotpexpiryat < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newpassword, 10);
    user.resetotp = "";
    user.resetotpexpiryat = 0;
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
