const router = require('express').Router();
const Register = require('../model/Register');
const { registerValidation, loginValidation } = require('./validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    //Validat the data before be a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already exist
    const emailExist = await Register.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists!');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create a new User
    const register = new Register({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedRegister = await register.save();
        res.send({ register: register._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if the user is already exist
    const user = await Register.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is wrong');
    //Password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or password1 is wrong');
    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    /* res.send("logged in") */
});



module.exports = router;