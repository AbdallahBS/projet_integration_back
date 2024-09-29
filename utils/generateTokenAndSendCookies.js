
const jwt = require('jsonwebtoken');
const generateTokenAndSetCookie = (res, userId,userRole) => {
  const token = jwt.sign({ userId,userRole }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: false,
    secure: false, // must be set to true on production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};
module.exports = generateTokenAndSetCookie;
