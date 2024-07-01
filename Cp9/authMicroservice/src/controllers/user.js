const userService = require('../services/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { createConfig } = require('../config/config');
// Register a new user
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = await userService.createUser({ email, password });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' }); // Use 401 for unauthorized
        }

        // Compare password hashes securely using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const configPath = path.join(__dirname, '../../configs/.env');
        const appConfig = createConfig(configPath);

        const payload = { userId: user._id }; // Include only essential user data
        const jwtSecret = appConfig.jwt.access_token; // Replace with your secret from an environment variable
        const accessToken = await jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Set appropriate expiration time
        // Send successful login response
        res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createUser,
    loginUser
};