const express = require('express');
const {registerUser,
    loginUser,
    currentUser
} = require("../controllers/authController");

const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const upload = require("../middleware/upload");

router.route("/register").post(upload.single('profilePicture'),registerUser);

router.route("/login").post(loginUser);

router.route("/current").get(validateToken ,currentUser);

module.exports = router;