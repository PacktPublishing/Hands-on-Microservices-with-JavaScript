const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const util = require('util');
const { createConfig } = require('../config/config');
const promisifyJwtVerifyFn = util.promisify(jwt.verify);

const verifyJWT = async (req, res, next) => { 
    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith('Bearer ')) { 
        return res.status(401).json({ message: 'Unauthorized: Missing JWT token' }); 
    }
    const token = authHeader.split(' ')[1]; 
    const configPath = path.join(__dirname, '../../configs/.env'); 
    const appConfig = createConfig(configPath);

    const decoded = await promisifyJwtVerifyFn(token, appConfig.jwt.access_token).catch(err=>{
        // Handle JWT verification errors 
        switch(err.name){
            case 'JsonWebTokenError':
                return res.status(401).json({ message: 'Unauthorized: Invalid JWT token format' }); 
            case 'TokenExpiredError':
                return res.status(401).json({ message: 'Unauthorized: JWT token expired' }); 
            default:
                // Handle other errors (e.g., signature verification failure) 
                console.error('JWT verification error:', err); 
                return res.status(500).json({ message: 'Internal Server Error' }); 
        }
    });
    
    // Attach decoded user information to the request object 
    req.user = decoded; 
        
    next(); // Allow the request to proceed 
}; 

module.exports = verifyJWT; 