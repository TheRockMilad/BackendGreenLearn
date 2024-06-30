const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    max: {
      // بیشترین امکان استفاده
      type: Number, // => 2
      required: true,
    },
    uses: {
      //  چند بار استفاده شده
      
      type: Number, // => 0
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Off", schema);

module.exports = model;
