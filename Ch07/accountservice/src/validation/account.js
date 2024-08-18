const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const getAccountById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
};

const deleteAccountById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
};

const createAccount = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    number: Joi.string().required(),
    status: Joi.string().valid('new', 'active', 'completed', 'cancelled').optional(),
    type: Joi.string().valid('root', 'sub').optional(),
  }),
};

const updateAccountById = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    number: Joi.string().required(),
    status: Joi.string().valid('new', 'active', 'completed', 'cancelled').optional(),
    type: Joi.string().valid('root', 'sub').optional(),
  }),
};

module.exports = {
  getAccountById,
  createAccount,
  deleteAccountById,
  updateAccountById,
};
