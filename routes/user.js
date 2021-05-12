const router = require('express').Router();
const { signUp } = require('../controllers/user');
//REGISTER
router.post('/register', signUp);
