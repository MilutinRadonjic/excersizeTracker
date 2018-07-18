// include DB_URL and mongoose connect
var Mongo_DB_URI = require('./env.js');
var mongoose = require('mongoose');
mongoose.connect(Mongo_DB_URI, {useNewUrlParser: true});

module.exports = mongoose.connection.once('open', () => {
    console.log('Connected to database');
});