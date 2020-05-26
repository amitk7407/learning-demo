const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    first_name: { type: String, trim: true, required: true, alias: "firstName" },
    last_name: { type: String, trim: true, required: true, alias: "lastName" },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        // validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true },
})

// var validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };

UserSchema.methods.getMappedObject = function () {
    const obj = this.toObject({ virtuals: true });
    delete obj.first_name;
    delete obj.last_name;
    delete obj.password;
    delete obj._id;
    return obj;
};

UserSchema.methods.appendContents = function (contents) {
    const user = this;
    user.contents = contents;
    return user;
};

UserSchema.pre('save', function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
})

module.exports = mongoose.model('User', UserSchema);

