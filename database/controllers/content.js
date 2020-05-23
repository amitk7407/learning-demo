const mongoose = require('mongoose');
const Content = require('../models/content');
const Comment = require('../models/comment');
const comment = require('../controllers/comment');

exports.create = (req, res) => {
    const newContent = new Content(req.body);
    newContent.save((e) => {
        if (e) {
            res.status(400).send('Unable to save to the database');
        }
        else {
            res.send(newContent);
        }
    })
}

exports.list = (req, res) => {
    Content.find({}).exec((e, results) => {
        if (e) {
            res.status(500).send(e);
        }

        res.send(results);
    })
}

// using a single query to get the details
exports.getContentDetails = (req, res) => {
    Content.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
        {
            $lookup: {
                from: Comment.collection.name,
                let: { contentId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$$contentId", "$contentId"] } } },
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
                ],
                as: 'comments'
            }
        }
    ], (e, results) => {
        if (e) {
            res.status(500).send(e);
        }

        res.send(results);
    });
}

// use comment controller to get the comments
exports.getContent = (req, res) => {
    Content.findById(mongoose.Types.ObjectId(req.query.id)).exec((e, result) => {
        if (e) {
            res.status(500).send(e);
        }

        comment.listByContent(req.query.id)
            .then(comments => {
                result._doc.comments = comments;
                res.send(result);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    })
}