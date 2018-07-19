var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exercizeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
var Excercize = mongoose.model('Excersize', exercizeSchema);

module.exports = Excercize;