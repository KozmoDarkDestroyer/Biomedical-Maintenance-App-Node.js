const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const Schema  = mongoose.Schema;
let noticeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    equipment: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    },
    description: {
        type: String,
        required: [true, 'The description is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        default: new Date().toLocaleString()
    },
    status:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Notice',noticeSchema);

