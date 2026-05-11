const express = require('express');
const router = express.Router();
const { 
    searchUsers, 
    searchBySkill, 
    searchByCourse 
} = require('../controllers/searchController');
const validateToken = require('../middleware/validateTokenHandler');

// All search routes are protected
router.use(validateToken);

// Search users by name
router.route("/users").get(searchUsers);

// Search users by skill
router.route("/skills").get(searchBySkill);

// Search users by course
router.route("/course").get(searchByCourse);

module.exports = router;