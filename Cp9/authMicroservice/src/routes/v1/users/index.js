const { Router } = require('express');
const userController = require('../../../controllers/user');
const userValidation = require('../../../validation/user');
const validate = require('../../../middlewares/validate');

const router = Router();
router.post('/register', validate(userValidation.loginSchema), userController.createUser);
module.exports = router;