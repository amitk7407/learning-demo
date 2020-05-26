const mongoose = require('mongoose');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.create = (req, res) => {
    const comment = req.body;

    if (!comment.contentId) {
        res.status(400).send('missing contentId');
    }
    comment.contentId = mongoose.Types.ObjectId(comment.contentId);

    if (comment.parentCommentId) {
        comment.parentCommentId = mongoose.Types.ObjectId(comment.parentCommentId);
    }

    const newComment = new Comment(comment);
    newComment.save((e) => {
        if (e) {
            res.status(400).send('Unable to save to the database');
        }
        else {
            res.send(newComment.getMappedObject());
        }
    })
}

exports.list = (req, res) => {
    Comment.find({}).exec((e, results) => {
        if (e) {
            res.status(500).send(e);
        }
        else {
            res.send(results.map(r => r.getMappedObject()));
        }
    })
}

exports.listByContent = (contentId, res) => {
    return Comment.find({
        content_id: mongoose.Types.ObjectId(contentId),
        parent_comment_id: { $exists: false }
    })
        .populate('user_id')
        .exec()                         //exec will either take a callback or return a promise
        .then(results => {
            const promises = results.map(r => {
                return getReplies(r)
                    .then(result => {
                        const comm = r.getMappedObject();
                        comm.replies = result;
                        return comm;
                    })
            })

            return Promise.all(promises)
                .then(commentsWithReplies => {
                    return commentsWithReplies;
                })
        })
        .then(result => {
            return res ? res.send(result) : result;
        })
        .catch(err => {
            if (res) {
                res.status(500).send(err);
            }
            else {
                throw err;
            }
        })
}

const getReplies = comment => {
    return Comment.find({ parent_comment_id: comment._doc._id })
        .populate('user_id')
        .exec()
        .then(results => {
            const promises = results.map(r => {
                return getReplies(r)
                    .then(result => {
                        const comm = r.getMappedObject();
                        comm.replies = result;
                        return comm;
                    })
            })

            return Promise.all(promises)
                .then(commentsWithReplies => {
                    return commentsWithReplies;
                })
        })
}
