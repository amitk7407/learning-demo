const express = require('express');
const router = express.Router();
const content = require('../controllers/content');

router.post('/addContent', (req, res) => {
    content.create(req, res);
});

router.get('/listContent', (req, res) => {
    content.list(req, res);
});

router.get('/getContentDetails', (req, res) => {
    content.getContentDetails(req, res);
})

router.get('/getContent', (req, res) => {
    content.getContent(req, res);
})

module.exports = router;