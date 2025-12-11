import jwt from "jsonwebtoken"

const userauth = (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return res.json({
      success: false,
      message: "User is Invalid Or user Does not exists"
    })
  }

  try {
    const decodetoken = jwt.verify(token, process.env.JWT_TOKEN)

    
    req.body = req.body || {}
    req.body.userid = decodetoken.id

    next()
  } catch (error) {
    return res.json({
      success: false,
      message: `There is something wrong here: ${error.message}`
    })
  }
}

export default userauth
