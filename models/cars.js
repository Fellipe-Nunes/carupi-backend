const mongoose = require('mongoose')

const CarsSchema = new mongoose.Schema({
    photo: {
        type : String,
        required : true
    },
    brand: {
        type : String,
        required : true
    },
    carmodel: {
        type: String, 
        required: true,
    },
    year: {
        type: Number, 
        required: true,
    },
    chassis:{
        type: Number,
        required: true,
    },
    carstatus: {
        type : String,
        required : false
    },
    carplate: {
        type: String,
        required : true
    },
    color: {
        type: String,
        required : true
    },
    fueltype: {
        type: String,
        required : true
    },
    last_modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('cars', CarsSchema)