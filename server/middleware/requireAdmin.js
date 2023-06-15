const jwt = require("jsonwebtoken");

const requireAdmin = async (req, res, next) => {
  const token = req.headers.authorization;
  const tokenValue = token.split(" ")[1];

  try {
    const decoded = await jwt.verify(tokenValue, "testaxiansjwtjwt");
    const isAdmin = decoded.isAdmin;
    if (isAdmin){
        next();
    }else{
          // User is not an admin, return a 403 Forbidden error
      res.status(403).json({ error: 'Access denied. User is not an admin.' });
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = requireAdmin;
