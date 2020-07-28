const express = require('express');
const router = express.Router();

const { send_otp,verify_otp } = require('../controllers/auth');

const { userValidator } = require('../validators/user');

router.get('/send/otp', send_otp);
router.get('/verify/otp', verify_otp);

module.exports = router;
