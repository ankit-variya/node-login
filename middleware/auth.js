const jwt = require('jsonwebtoken');
const status = require('../controllers/status');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        req.userData = decoded;
        next();
    } catch (err){
        status.auth_failed(req, res)
    }
}