const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('./user');
const ContentModel = require('./content');

const CommentSchema = new Schema({
    comment: { type: String, trim: true, required: true },
    dislikes: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    content_id: { type: Schema.Types.ObjectId, required: true, ref: "Content", alias: "contentId" },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User", alias: "user", validate: [validateUser, , 'Invalid user'] },
    parent_comment_id: { type: Schema.Types.ObjectId, ref: "Comment", alias: "parentCommentId" }
});

CommentSchema.methods.getMappedObject = function () {
    const obj = this.toObject({ virtuals: true });
    delete obj.content_id;
    delete obj.parent_comment_id;
    delete obj.user_id;
    delete obj._id;
    return obj;
};

// check if the user is valid or not
function validateUser(value) {
    UserModel.findById(value).exec((err, doc) => {
        return (!err && doc);
    });
};

// check if the content is valid or not
CommentSchema.path('content_id').validate(value => {
    ContentModel.findById(value).exec((err, doc) => {
        return (!err && doc);
    });
}, 'Invalid contentId');

module.exports = mongoose.model('Comment', CommentSchema);