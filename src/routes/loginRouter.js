const express = require('express');
const emailValidate = require('../middlewares/emailValidate');
const passwordValidate = require('../middlewares/passwordValidate');
const generateToken = require('../utils/generateToken');

const router = express.Router();

router.post('/login', emailValidate, passwordValidate, (req, res) => {
  const { email, password } = req.body;
  const loginArray = [email, password];

  if (loginArray.includes(undefined)) {
    return res.status(401).json({ message: 'Campos ausentes!' });
  }

  const token = generateToken();
  return res.status(200).json({ token });
});

module.exports = router;
