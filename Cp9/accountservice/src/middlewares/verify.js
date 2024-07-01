const jwt = require('jsonwebtoken');
const path = require('path');
const { createConfig } = require('../config/config');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for presence and format of Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing JWT token' });
    }

    const token = authHeader.split(' ')[1];

    const configPath = path.join(__dirname, '../../configs/.env');
    const appConfig = createConfig(configPath);
    // Verify the JWT token
    jwt.verify(token, appConfig.jwt.access_token, (err, decoded) => {
        if (err) {
            // Handle JWT verification errors
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized: Invalid JWT token format' });
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: JWT token expired' });
            } else {
                // Handle other errors (e.g., signature verification failure)
                console.error('JWT verification error:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }

        // Attach decoded user information to the request object
        req.user = decoded;
        next(); // Allow the request to proceed
    });
};

module.exports = verifyJWT;