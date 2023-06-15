const jwt = require("jsonwebtoken")

 const requireLogin = async (req, res, next) => {
  const token = req.headers.authorization;
  const tokenValue = token.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try{
   const decode = await jwt.verify(tokenValue,"testaxiansjwtjwt");
   next();
  }catch(error){
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = requireLogin;
