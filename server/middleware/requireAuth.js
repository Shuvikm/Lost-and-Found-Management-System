const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const requireAuth = async (req, res, next) => {
    try {
        // read token from cookies or Authorization header
        let token = req.cookies.Authorization;
        
        // If no cookie, check Authorization header (Bearer token)
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }

        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        // decode the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.SECRETKEY);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please login again.' });
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token. Please login again.' });
            }
            throw jwtError;
        }

        // check expiration of token
        if (Date.now() > decodedToken.expirationTime) {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }

        // find user using decoded sub
        const user = await User.findById(decodedToken.sub);

        if (!user) {
            return res.status(401).json({ message: 'User not found. Please login again.' });
        }

        // Verify token matches the one stored in database (optional but adds security)
        if (user.jwtToken && user.jwtToken !== token) {
            return res.status(401).json({ message: 'Session invalidated. Please login again.' });
        }

        // Check if token expiry in database has passed
        if (user.tokenExpiry && new Date() > user.tokenExpiry) {
            // Clear expired token from database
            user.jwtToken = null;
            user.tokenExpiry = null;
            await user.save();
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }

        // attach user to req
        req.user = user;
        req.token = token;

        // continue on
        next();
    } catch (error) {
        // handle JWT verification or other errors
        console.error('Error in requireAuth middleware:', error);

        // Provide a more general error message for security reasons
        return res.status(401).json({ message: 'Authentication failed. Please login again.' });
    }
};

module.exports = requireAuth;
