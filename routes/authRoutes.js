const express = require('express');
const {userSignupValidator, passwordResetValidator} = require('../validators');
const {signup, signin, signout, forgotPassword, resetPassword, socialLogin} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);
router.post('/social-login', socialLogin); 

module.exports = router;
