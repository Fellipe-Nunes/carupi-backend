const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password :{
        type: String,
        required: true,
        select: false
    },
    company :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    birthdate : {
        type : String,
        required : true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    date: {
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model('user', UserSchema)