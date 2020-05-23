const mongoose = require('mongoose');
const Comment = require('../models/comment');

exports.create = (req, res) => {
    const comment = req.body;
    comment.contentId = mongoose.Types.ObjectId(req.body.contentId);

    if (req.body.parentCommentId) {
        comment.parentCommentId = mongoose.Types.ObjectId(req.body.parentCommentId);
    }

    const newComment = new Comment(comment);
    newComment.save((e) => {
        if (e) {
            res.status(400).send('Unable to save to the database');
        }
        else {
            res.send(newComment);
        }
    })
}

exports.listByContent = (contentId, res) => {
    return Comment.aggregate([
        {
            $match: {
                // parentCommentId: { $exists: false },
                contentId: mongoose.Types.ObjectId(contentId)
            }
        },
        {
            $lookup: {
                from: Comment.collection.name,
                let: { commentId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$parentCommentId", "$$commentId"] } } },
                    //   {
                    //     $lookup: {
                    //       from: "users",
                    //       foreignField: "_id",
                    //       localField: "userID",
                    //       as: "user"
                    //     }
                    //   },
                    //   {$addFields: {user: {$arrayElemAt: ["$user", 0]}}}
                ],
                as: 'replies'
            }
        },
        // { $lookup: {
        //   from: 'users',
        //   localField: 'userID',
        //   foreignField: '_id',
        //   as: 'user'
        // }},
        // {$addFields: {user: {$arrayElemAt: ["$user", 0]}}}
    ], (e, results) => {
        if (e) {
            throw e;
        }

        return res ? res.send(results) : results;
    });
}