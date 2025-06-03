const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/(?=.*\d)/)
    .withMessage('Password must contain at least one number')
    .matches(/(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one special character'),
  
  body('shopNames')
    .isArray({ min: 3, max: 4 })
    .withMessage('You must provide between 3 and 4 shop names'),
  
  body('shopNames.*')
    .trim()
    .notEmpty()
    .withMessage('Shop name cannot be empty')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Shop name can only contain lowercase letters, numbers, and hyphens')
    .isLength({ min: 3, max: 30 })
    .withMessage('Shop name must be between 3 and 30 characters')
];

const validateSignin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  validateSignin,
  handleValidationErrors
};