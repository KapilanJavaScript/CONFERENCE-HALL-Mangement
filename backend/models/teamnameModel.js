const mongoose = require("mongoose");

const teamnameSchema = mongoose.Schema(
  {
    team_name:[{
        type: String,
        required: true
    }],
    location:{
        type:String,
        required:[true, 'Enter the Conference Hall locatioon'],
        trim:true
    },     
    created_by:{
        type: String,
        required:true
    },
    updated_by:{
        type: String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Teamname',teamnameSchema);