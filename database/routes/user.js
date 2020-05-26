const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.post('/addUser', (req, res) => {
    user.create(req, res);
});

router.get('/listUser', (req, res) => {
    user.list(req, res);
});

router.post('/verifyUser', (req, res) => {
    user.getUserDetails(req, res);
})

module.exports = router;