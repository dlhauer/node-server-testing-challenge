const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, jwtSecret, (error, decodedToken) => {
      if (error) {
        console.log(error);
        res.status(401).json({
          message: 'You messed with that token.'
        })
      } else {
        req.user = decodedToken.user;
        next();
      }
    })
  } else {
    res.status(401).json({
      message: "You ain't logged in!"
    });
  }
}