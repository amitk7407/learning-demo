const mongoose = require('mongoose');
const schema = mongoose.Schema;

const content = new schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    likes: { type: Number, required: true, default: 0 },
    comments: { type: Number, required: true, default: 0 }
})

module.exports = mongoose.model('Content', content);
