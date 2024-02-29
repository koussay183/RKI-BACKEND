const jwt = require('jsonwebtoken');
const Op = require('../modules/op');

const generateToken = (id , opId ,role) => {
  return jwt.sign({ id , opId , role}, process.env.SECRET_KEY , { expiresIn: '1h' });
};

const subAdminAuthVerify = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const op = await Op.findById(decoded.id);

    if (!op || decoded.role !== "op") {
      return res.status(403).send('Access denied. Not a op.');
    }

    // If JWT is valid and signed with role "op", proceed to the next middleware
    next();
  } catch (error) {
    // Check if token has expired
    if (error.name === 'TokenExpiredError') {
      // If expired, generate a new token and set it in a cookie
      const newToken = generateToken(decoded.id,decoded.opId , decoded.role);
      res.cookie('token', newToken, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour
      next(); // Continue to next middleware
    } else {
      // If other error, return unauthorized
      res.status(401).send('Unauthorized.');
    }
  }
};

module.exports = subAdminAuthVerify;