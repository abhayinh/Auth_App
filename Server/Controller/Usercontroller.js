import usermodel from "../model/Usermodel.js";

const userdata = async (req, res) => {
  try {
    // FIX: userid comes from middleware, NOT from req.body
    const userid = req.userid;

    if (!userid) {
      return res.json({ success: false, message: "User ID missing" });
    }

    const user = await usermodel.findById(userid);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      userdata: {
        name: user.name,
        email: user.email,
        isaccountverify: user.isaccountverify,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Invalid request: ${error.message}`,
    });
  }
};

export default userdata;
