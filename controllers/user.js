const User = require('../models/user');
const bcrypt = require('bcrypt');
const status = require('./status');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.res = res;
exports.login = login;
exports.userlist = userlist;

// const { username, email, password, mobile } = req.body
// const user = new User({ username, email, password, mobile })
// const ret = user.save()
// res.json(ret)

function res(req, res, next){
    const email = req.body.email;
    User.find({ email })
    .exec()
    .then(user => {
        if(user.length >= 1){
            status.mail_exist(req, res)
        } else {
            addData(req, res);
        }
    })
}

async function addData(req, res){
    const { username, email, password, mobile } = req.body
    const user = new User({ username, email, password, mobile, profileImage: req.file.path })
    user_email = user.email
    console.log("user", user_email)
    await user.save()
    .then(result => {
         status.add_data(req, res, result, user_email)
    })
    .catch(({ errors }) => {
        console.log("0000")
        status.errors(req, res, errors)
    })
}

function login(req, res, next){
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            console.log("user", user);
            if(!user){
                status.email_not_found(req, res)
            }
           token(req, res, user);
        })
}

function token(req, res, user){
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log("result", result);
        const token = jwt.sign({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            mobile: user.mobile
        }, process.env.SECRET, 
        {  expiresIn: '1h' });
        status.auth_success(req, res, token);
    })
}

function userlist(req, res){
    User.find()
        .then(result => {
           status.list(req, res, result);
        })
        .catch(err => {
            status.err(req, res, err);
        })
}

