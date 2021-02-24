const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    storename: {
        type : String,
        required : true
    },
    fakename: {
        type: String, 
        required: false
    },
    legalowner: {
        type: String, 
        required: true
    },
    adress:{
        type: String,
        required: true
    },
    telnumber: {
        type : Number,
        required : true
    },
    storemail: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('company', CompanySchema)