const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const contentRoutes = require('./content');
const commentRoutes = require('./comment');

router
    .use((req, res, next) => {
        console.log('/' + req.method);
        next();
    })
    .use('/user', userRoutes)
    .use('/content', contentRoutes)
    .use('/comment', commentRoutes);

module.exports = router;