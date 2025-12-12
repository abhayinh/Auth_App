import jwt from "jsonwebtoken";

const userauth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User is invalid or token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    // add user id into request body for downstream controllers
    req.body = req.body || {};
    req.body.userid = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Authentication error: ${error.message}`
    });
  }
};

export default userauth;
