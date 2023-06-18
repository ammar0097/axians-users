const jwt = require("jsonwebtoken")

const requireLogin = async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const tokenValue = token.split(' ')[1];
  
  try {
    const decode = await jwt.verify(tokenValue, "testaxiansjwtjwt");
    req.userId = decode.userId;
    req.isAdmin = decode.isAdmin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = requireLogin;
