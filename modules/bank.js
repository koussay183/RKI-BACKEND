const mongoose = require('mongoose')

const bank = new mongoose.Schema({
    BID : {type : String,} ,
    COMP1 : {type : String},
    COMP2 :{type : String},
    COMP3 : {type : String},
    ZMK :{type : String}
})

const Bank = mongoose.model('bank', bank);

module.exports = Bank;