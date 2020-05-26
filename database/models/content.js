const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('./user');

const ContentSchema = new Schema({
    title: { type: String, trim: true, required: true },
    url: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    likes: { type: Number, required: true, default: 0 },
    comments: { type: Number, required: true, default: 0 },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User", alias: "userId", validate: [validateUser, , 'Invalid user'] },
});

ContentSchema.methods.getMappedObject = function () {
    const obj = this.toObject({ virtuals: true });
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

module.exports = mongoose.model('Content', ContentSchema);
