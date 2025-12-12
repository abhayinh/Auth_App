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

    // FIXED: correct variable name
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // FIXED: attach userid correctly
    req.userid = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Authentication error: ${error.message}`
    });
  }
};

export default userauth;
