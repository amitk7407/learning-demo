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
            res.send(newContent.getMappedObject());
        }
    })
}

exports.list = (req, res) => {
    Content.find({}).exec((e, results) => {
        if (e) {
            res.status(500).send(e);
        }
        else {
            res.send(results.map(r => r.getMappedObject()));
        }
    })
}

// using a single query to get the details (response is almost similar to graphLookup)
exports.getContentDetails = (req, res) => {
    Content.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
        {
            $lookup: {
                from: Comment.collection.name,
                let: { contentId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$$contentId", "$content_id"] } } },
                    {
                        $lookup: {
                            from: Comment.collection.name,
                            let: { commentId: "$_id" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$parent_comment_id", "$$commentId"] } } },
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
        else {
            res.send(results);
        }
    });
}

// use comment controller to get the comments
exports.getContent = (req, res) => {
    Content.findById(mongoose.Types.ObjectId(req.query.id)).exec((e, result) => {
        if (e) {
            res.status(500).send(e);
        }
        else {
            return comment.listByContent(req.query.id)
                .then(comments => {
                    const content = result.getMappedObject();
                    content.commentList = comments;
                    res.send(content);
                })
                .catch(err => {
                    res.status(500).send(err);
                })
        }
    })
}

// use comment controller to get the comments
exports.getContentsByUserId = (userId) => {
    return Content.find({ user_id: mongoose.Types.ObjectId(userId) })
        .exec()
        .then(results => {
            const promises = results.map(r => {
                return comment.listByContent(r.id)
                    .then(comments => {
                        const content = r.getMappedObject();
                        content.commentList = comments;
                        return content;
                    })
            })

            return Promise.all(promises);
        })
}