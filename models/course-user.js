const mongoose = require("mongoose");

// مدل وقتی یکی از دانشجویان ثبت نام میکنه 
// دوره مورد نظر و یوزر موردنظر و مبلغ رو میفرسته توی این مدل
const schema = mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("CourseUser", schema);

module.exports = model;
