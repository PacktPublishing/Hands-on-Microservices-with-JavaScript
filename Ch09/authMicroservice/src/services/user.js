const User = require('../models/user');

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

const getUserById = async (userId) => {
    return await User.findById(userId);
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email: email });
};
// ... Add methods for other user operations (e.g., update, delete)
module.exports = { createUser, getUserById, getUserByEmail };