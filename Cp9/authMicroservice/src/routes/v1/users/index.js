const { Router } = require('express');
const userController = require('../../../controllers/user');
const { loginSchema } = require('../../../validation/user');
const validate = require('../../../middlewares/validate');

const router = Router();

router.post('/register', validate(loginSchema), userController.createUser);
router.post('/login', validate(loginSchema), userController.loginUser);
module.exports = router;