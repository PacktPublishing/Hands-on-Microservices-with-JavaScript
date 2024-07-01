const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .error(errors => {
            if (errors[0].code === 'any.required') {
                return new Error('Email is required');
            }
            if (errors[0].code === 'string.email') {
                return new Error('Invalid email format');
            }
            return errors;
        }),
    password: Joi.string()
        .min(6) // Minimum password length
        .required()
        .error(errors => {
            if (errors[0].code === 'any.required') {
                return new Error('Password is required');
            }
            if (errors[0].code === 'string.min') {
                return new Error('Password must be at least 6 characters long');
            }
            return errors;
        })
});

module.exports = {
    loginSchema
};
