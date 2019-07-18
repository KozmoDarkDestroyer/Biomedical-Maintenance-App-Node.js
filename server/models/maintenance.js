const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let maintenanceSchema = new Schema({
    description: {
        type: String,
        required: [true,'The description is required']
    },
    date: {
        type: String,
        default: new Date().toLocaleString()
    },
    report: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    equipment: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    },
    notice: {
        type: Schema.Types.ObjectId,
        ref: 'Notice'
    },
    status:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Maintenance',maintenanceSchema);