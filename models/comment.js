const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAccept: {
      type: Number, // 0 - 1
      default: 0,
    },
    score: {
      type: Number,
      default: 5,
    },
    isAnswer: {
      type: Number, // 0 - 1
      required: true,
    },
    mainCommentID: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Comment", schema);

module.exports = model;
