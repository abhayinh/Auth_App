import usermodel from "../model/Usermodel.js";

const userdata = async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) return res.json({ success: false, message: "userid missing" });

    const user = await usermodel.findById(userid);
    if (!user) return res.json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      userdata: {
        name: user.name,
        isaccountverify: user.isaccountverify,
        email: user.email
      }
    });
  } catch (error) {
    return res.json({ success: false, message: `Invalid request ${error.message}` });
  }
};

export default userdata;
