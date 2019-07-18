const mongoose = require('mongoose'); 
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let Schema = mongoose.Schema;

let validRoles = {
    values: ['ADMIN','INGEMED','TECMED','PRACMED','USER'],
    message: '{VALUE} is not a valid role'
}


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is required']
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'ADMIN_ROLE',
        enum: validRoles
    },
    status: {
        default: true,
        type: Boolean
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(beautifyUnique, {
    defaultMessage: "This custom message will be used as the default"
})

module.exports = mongoose.model('User', userSchema);
