const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let Schema = mongoose.Schema;
let equipmentSchema = new Schema({
    name:{
        type: String,
        required: [true,'The name is required']
    },
    code:{
        type: String,
        required: [true,'The code is required'],
        unique: true,
    },
    brand:{
        type: String,
        required: [true,'The brand is required']
    },
    model:{
        type: String,
        required: [true,'The model is required']
    },
    status:{
        type: Boolean,
        default: true
    },
    series:{
        type: String,
        required: [true,'The series is required']
    },
    area:{
        type: String,
        required: [true,'The area is required']
    },
    manual:{
        type: String,
        required: false
    },
    img:{
        type: String,
        required: false
    }
})

equipmentSchema.plugin(beautifyUnique, {
    defaultMessage: "This custom message will be used as the default"
});

module.exports = mongoose.model('Equipment',equipmentSchema);