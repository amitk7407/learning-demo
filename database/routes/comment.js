const express = require('express');
const router = express.Router();
const comment = require('../controllers/comment');

router.post('/addComment', (req, res) => {
    comment.create(req, res);
});

router.get('/listComments', (req, res) => {
    comment.listByContent(req.query.id, res);
});

module.exports = router;