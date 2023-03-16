const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    employeeId:{
        type:String,
        required:[true, 'Enter your Employee ID']
    },
    employeeName:{
        type:String,
        required:[true, 'Enter your name'],
        trim:true
    },
    email:{
        type:String,
        required:[true, 'Enter your email'],
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true, 'Enter the correct password'],
        minlength:7,
        trim:true
    },
    location:{
        type:String,
        required:[true, 'Please! Enter your Location']
    },    
    mobileNumber:{
        type: String,
        trim:true,
        required:[true, 'Enter your Team Name']
    },
    isDeleted:{
        type:Boolean,
        default: false,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default: false,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User',userSchema);
