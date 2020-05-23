const express = require('express');
const router = express.Router();

const contentRoutes = require('./content');
const commentRoutes = require('./comment');

router
    .use((req, res, next) => {
        console.log('/' + req.method);
        next();
    })
    .use('/content', contentRoutes)
    .use('/comment', commentRoutes);

module.exports = router;