const mongoose = require("mongoose");

const requestedHallSchema = mongoose.Schema(
  {
    bookHallId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    hallId: {
      type: String,
      required: true,
    },
    hallName: {
      type: String,
      required: true,
    },
    hostedById: {
      type: String,
      required: true,
      default: null,
    },
    hostedByName: {
      type: String,
      required: true,
      default: null,
    },
    noOfCandidates: {
      type: Number,
      required: true,
    },
    members: [
      {
        memberId: {
          type: String,
          required: true,
        },
        memberName: {
          type: String,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      required: true,
    },
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
    isAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeclined: {
      type: Boolean,
      required: true,
      default: false,
    },
    acceptedBy: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    declinedBy: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      required: true,
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

module.exports = mongoose.model("requestedHall", requestedHallSchema);
