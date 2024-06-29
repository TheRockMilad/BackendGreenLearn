const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: {
      // ی اسم میخواد
      type: String,
      required: true,
    },
    description: {
      // توضیحات
      type: String,
      required: true,
    },
    body: {
      // بدنه
      type: String,
      required: true,
    },
    cover: {
      // عکس
      type: String,
      required: true,
    },
    href: {
      // example : AI
      type: String,
      required: true,
    },
    categoryID: {
      // دسته ها
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      // نویسنده
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publish: {
      type: Number, // 0 - 1
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Article", schema);

module.exports = model;
