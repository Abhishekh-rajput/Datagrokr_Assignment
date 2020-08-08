exports.createPostValidator = (req, res, next) => {
  req.check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({min:4, max:150}).withMessage('Title must be 4-150 characters');
  req.check('body')
    .notEmpty().withMessage('Body is required')
    .isLength({min:4, max:2000}).withMessage('Body must be 4-2000 characters');
  const errors = req.validationErrors();
  if (errors) {
    const errorMsgs = errors.map(err => err.msg);   // show list of error messages
    return res.status(400).json({error: errorMsgs});
  }
  next();
};

exports.userSignupValidator = (req, res, next) => {
  req.check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({min:2, max:30}).withMessage('Name must be 2-30 characters');
  req.check('email')
    .notEmpty().withMessage('Email is required')
    .isLength({min:4, max:50}).withMessage('Email must be 4-50 characters')
    .isEmail().withMessage('Email is not valid');
  req.check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min:6, max:20}).withMessage('Password must be 6-20 characters')
    .matches(/\d/).withMessage('Password must contain at least one number');
  const errors = req.validationErrors();
  if (errors) {
    const errorMsgs = errors.map(err => err.msg);   // show list of error messages
    return res.status(400).json({error: errorMsgs});
  }
  next();
};

exports.userUpdateValidator = (req, res, next) => {
  req.check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({min:2, max:30}).withMessage('Name must be 2-30 characters');
  req.check('email')
    .notEmpty().withMessage('Email is required')
    .isLength({min:4, max:50}).withMessage('Email must be 4-50 characters')
    .isEmail().withMessage('Email is not valid');
  req.check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min:6, max:20}).withMessage('Password must be 6-20 characters')
    .matches(/\d/).withMessage('Password must contain at least one number');
  const errors = req.validationErrors();
  if (errors) {
    const errorMsgs = errors.map(err => err.msg);   // show list of error messages
    return res.status(400).json({error: errorMsgs});
  }
  next();
};

exports.passwordResetValidator = (req, res, next) => {
  req.check('newPassword')
    .notEmpty().withMessage('Password is required')
    .isLength({min:6, max:20}).withMessage('Password must be 6-20 characters')
    .matches(/\d/).withMessage('Password must contain at least one number');
  const errors = req.validationErrors();
  if (errors) {
    const errorMsgs = errors.map(err => err.msg);   // show list of error messages
    return res.status(400).json({error: errorMsgs});
  }
  next();
};
