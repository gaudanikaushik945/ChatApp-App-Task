const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().optional(), 
  phone_number: Joi.number()
    .integer()
    .positive()
    .optional(), 
  email: Joi.string()
    .email()
    .optional(), 
  password: Joi.string()
    .min(8)
    .optional()
});




const loginValidationSchema = Joi.object({
    phone_number: Joi.number()
      .integer()
      .positive()
      .required(),
    password: Joi.string()
      .min(8)
      .required() 
  });
  

const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };


module.exports = {
    validateRequest,
    userValidationSchema,
    loginValidationSchema
}