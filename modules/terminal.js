const mongoose = require('mongoose')
// terminal file in here it was the terminal schema
const terminalFile = new mongoose.Schema({
    TID : {
        type : String,
        required : true
    },
    MID : {
        type : String
    },
    ADRESSE : {
        type : String
    },
    terminal : {
        TMK : {
            type : String
        },
        TPK : {
            type : String
        },
        SystemePassword : {
            type : String
        },
        password : {
            type : String
        },
        marchantPassword : {
            type : String
        }
    },
    acquirer : {
        nom : {
            type : String
        },
        port : {
            type : String
        },
        nll : {
            type : String
        },
        spdh : {
            type : Boolean
        },
        marchantId : {
            type : String
        },
        qr : {
            type : Boolean
        },
        ip : {
            type : String
        },
        batchNo : {
            type : String
        },
        terminalId : {
            type : String
        },
        ssl : {
            type : String
        }

    },
    issuers : [
        {
            name : String,
            EnableAdjust : Boolean,
            EnableOffline : Boolean,
            EnableExpiry : Boolean,
            PinRequired : Boolean,
            FloorLimit : Boolean,
            AdjustPercent : Boolean,
            EnableManualpAN : Boolean,
            CheckExpiry : Boolean,
            EnablePrint : Boolean
        }
    ],
    merchant : {
        name : String,
        port : Boolean,
        EnableCompletion : Boolean , 
        EnableSettlement : Boolean ,
        EnableRefund : Boolean ,
        EnableReversal : Boolean ,
        EnablePreAuth : Boolean ,
        EnableCashAdvance : Boolean,
        EnableManual : Boolean,
        Currency : String
    },
})


const Terminal = mongoose.model('Terminal', terminalFile);

module.exports = Terminal;