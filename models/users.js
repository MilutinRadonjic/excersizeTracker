var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

const User = mongoose.model('User', usersSchema);

module.exports = User;