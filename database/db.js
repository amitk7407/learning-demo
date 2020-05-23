const mongoose = new require('mongoose');

const MONGO_USERNAME = 'amit';
const MONGO_PASSWORD = 'test_pass';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'posts';

// in connection url, we need username, password, hostname, port and dbname
// Since we are using username in connection url, we need to specify authSource for our user as the admin database
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
// useNewUrlParser flag specifies that we want to use Mongo's new URL parser. This is kind of mandatory flag
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
