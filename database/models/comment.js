const mongoose = require('mongoose');
const schema = mongoose.Schema;

const comment = new schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    dislikes: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    contentId: { type: schema.Types.ObjectId, required: true, ref: "Content" },
    parentCommentId: { type: schema.Types.ObjectId, ref: "Comment" },
})

module.exports = mongoose.model('Comment', comment);
