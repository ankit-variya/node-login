const constant = require('./constant.json');
const nodemailer = require('nodemailer');

exports.mail_exist = mail_exist;
exports.add_data = add_data;
exports.errors = errors;
exports.auth_failed = auth_failed;
exports.auth_success = auth_success;
exports.list = list;
exports.err = err;
exports.email_not_found = email_not_found;

function mail_exist(req, res){
    return res.status(409).json({
        message: constant.mail_exist
    })
}

function add_data(req, res, result, user_email){
    // res.status(201).json({
    //     message: constant.add_data,
    //     result: result
    // })
    sendMail(req, res, user_email)
}

async function sendMail(req, res, user_email){
    console.log("user_email", user_email)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.EMAIL,
        to: user_email,
        cc: '',
        bcc: '',
        subject: 'Sending Email using Node.js',
        text: 'this is done?'
    };
    console.log("=====")
   await transporter.sendMail(mailOptions, function(err, info){
    console.log("=====+++++")
        if(err){
            return res.status(500).json({
                error: err
            })
        } else {
            res.status(201).json({
                message: 'please check your email and verified your account',
                result: info
            });
        }
    })
}



function errors(req, res, errors){
    return res.status(500).json({
        errors: Object.values(errors).map(e => e.message)
    })
}

function email_not_found(req, res){
    return res.status(401).json({
        message: constant.email_not_found
    })
}

function auth_failed(req, res){
    return res.status(401).json({
        message: constant.auth_failed
    })
}

function auth_success(req, res, token){
    return res.status(200).json({
        message: constant.auth_successful,
        token: token
    })
}

function list(req, res, result){
   return res.status(200).json({
        count: result.length,
        data: result,
        request: {
            type: 'GET',
            url: 'http://localhost:3333/user/' + result._id
        }
    })
}

function err(req, res, err){
    return res.status(500).json({
        error: err
    })
}