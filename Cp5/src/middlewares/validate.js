const Joi = require('joi');

function take(object, keys) {
    return Object.assign({}, ...keys.filter(key => object.hasOwnProperty(key))
        .map(key => ({ [key]: object[key] })));
}

function validate(schema) {
    return (req, res, next) => {

        // Extract relevant parts of the schema based on request type
        const { params, query, body } = schema;
        const selectedSchema = take(schema, [params, query, body].filter(Boolean));

        // Build the object to validate based on request properties
        const objectToValidate = take(req, Object.keys(selectedSchema));

        // Perform Joi validation with improved error handling
        const { error, value } = Joi.compile(selectedSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(objectToValidate);

        //construct 400 error if there is any validation error
        if (error) {
            const errorMsg = error.details.map(d => d.message).join(', ');
            return res.status(400).json({ success: false, message: errorMsg });
        }

        // Attach validated data to the request object
        Object.assign(req, value);
        next();
    };
}

module.exports = validate;
