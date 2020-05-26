const mongoose = require('mongoose');
const User = require('../models/user');
const content = require('./content');

exports.create = (req, res) => {
    const newUser = new User(req.body);
    newUser.save(e => {
        if (e) {
            res.status(400).send('Unable to save to the database');
        }
        else {
            res.send(newUser.getMappedObject());
        }
    })
}

exports.list = (req, res) => {
    User.find({}).exec((e, results) => {
        if (e) {
            res.status(500).send(e);
        }
        else {
            res.send(results.map(r => r.getMappedObject()));
        }
    })
}

// use comment controller to get the comments
exports.getUserDetails = (req, res) => {
    User.findOne({ email: req.body.email }).exec((e, user) => {
        if (e) {
            res.status(500).send(e);
        }
        else {
            user.comparePassword(req.body.password, (err, isValid) => {
                if (err || !isValid) {
                    res.status(500).send('Invalid User');
                }
                else {
                    content.getContentsByUserId(user._id)
                        .then(contents => {
                            const mappedUser = user.getMappedObject();
                            mappedUser.contents = contents;
                            res.send(mappedUser);
                        })
                        .catch(err => {
                            res.status(500).send(err);
                        })
                }
            })
        }
    })
}