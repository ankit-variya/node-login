const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 500* 500* 5},
    fileFilter: fileFilter
})

router.post('/res',  upload.single('profileImage'), user_controller.res);
router.post('/login', user_controller.login);
router.get('/list', auth, user_controller.userlist);

module.exports = router;