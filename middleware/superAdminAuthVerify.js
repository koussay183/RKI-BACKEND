const jwt = require('jsonwebtoken');
const Admin = require('../modules/superAdmin');

const generateToken = (id , adminId ,role) => {
  return jwt.sign({ id , adminId , role}, process.env.SECRET_KEY , { expiresIn: '1h' });
};

const superAdminAuthVerify = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const admin = await Admin.findById(decoded.id);

    if (!admin || decoded.role !== "superAdmin") {
      return res.status(403).send('Access denied. Not a super admin.');
    }

    // If JWT is valid and signed with role "superAdmin", proceed to the next middleware
    next();
  } catch (error) {
    // Check if token has expired
    if (error.name === 'TokenExpiredError') {
      // If expired, generate a new token and set it in a cookie
      const newToken = generateToken(decoded.id,decoded.adminId , decoded.role);
      res.cookie('token', newToken, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour
      next(); // Continue to next middleware
    } else {
      // If other error, return unauthorized
      res.status(401).send('Unauthorized.');
    }
  }
};

module.exports = superAdminAuthVerify;