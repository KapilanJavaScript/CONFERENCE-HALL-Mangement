const mongoose = require("mongoose");

const conferencehallSchema = mongoose.Schema(
  {
    hallNumber: {
      type: Number,
      required: true,
      default: null,
    },
    hallName: {
      type: String,
      required: true,
      default: null,
    },
    hallCapacity: {
      type: Number,
      required: true,
      default: null,
    },
    hallLocation: {
      type: String,
      required: [true, "Enter the Conference Hall location"],
      trim: true,
      default: null,
    },
    hallEmail: {
      type: String,
      required: [true, "Enter the Conference hall email"],
      unique:true,
      default: null,
    },
    createdBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conferencehall", conferencehallSchema);
