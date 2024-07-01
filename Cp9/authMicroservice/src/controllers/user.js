const userService = require('../services/user');
const express = require('express');

// Register a new user
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = await userService.createUser({ email, password });
        res.status(201).json({ message: 'User created successfully', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createUser
};