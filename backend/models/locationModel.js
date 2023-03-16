const mongoose = require("mongoose");

const Location = new mongoose.Schema({

    location:{
        type:String,
        required:true,
        trim:true
       
    },
    createdBy:{
        type:String,
        default:null
    },
    updatedBy:{
        type:String,
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedBy:{
        type:String,
        default:null
    },
},{timestamps:true})

module.exports = mongoose.model('location',Location);

