const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId, // دوره ای که براش کامنت گذاشتن
      ref: "Course",
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId, //آیدی یوزری که کامنت گذاشته
      ref: "User",
      required: true,
    },
    isAccept: {
      type: Number, // 0 = not accept    1 = accept
      default: 0,
    },
    score: {
      type: Number,
      default: 5,
    },
    isAnswer: {
      type: Number, // 0 = first comment    1 = anwser comment
      required: true,
    },
    mainCommentID: {
      type: mongoose.Types.ObjectId, // آیدی همین کامنت رو میگیره
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Comment", schema);

module.exports = model;
