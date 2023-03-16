const mongoose = require("mongoose");

const bookHallSchema = mongoose.Schema(
  {
    hallId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    hallName:{
      type: String,
      required: true,
    },
    hostedById: {
      type: String,
      required: true,
      default: null,
    },
    hostedByName:{
      type: String,
      required: true,
      default: null,
    },
    noOfCandidates: {
      type: Number,
      required: true,
    },
    members: [{
      memberId: {
        type: String,
        required: true,
      },
      memberName: {
        type: String,
        required: true,
      },
    }],
    date: [
      {
        type: Date,
        required: true,
      },
    ],
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    requestedHalls: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        default: null,
      },
    ],
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    updatedBy: {
      type: String,
      default: null,
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

module.exports = mongoose.model("Bookhall", bookHallSchema);
