const express = require('express');
const {
    getAllUser,  
    getUserById, 
    deleteUser, 
    updateUser
} = require('../controllers/userController');

const upload = require('../middleware/upload');
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
router.use(validateToken);

router.route("/").get(getAllUser);

router.route("/:id").get(getUserById).delete(deleteUser).patch(updateUser).patch(upload.single('profilePicture'), updateUser);;


module.exports = router;

// app.get();
// app.get();
// app.post();
// app.patch();
// app.delete();
