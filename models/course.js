const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      //  اسم دوره = مثلا : آموزش حرفه ای نود بدون پیش نیاز
      type: String,
      required: true,
    },
    description: {
      // توضیحات دوره
      type: String,
      required: true,
    },
    cover: {
      // عکس دوره
      type: String,
      required: true,
    },
    support: {
      // مثلا تلگرام
      type: String,
      required: true,
    },
    href: {
      // ی اسم بعد توی لینک برای معرفی ex : node-js
      type: String,
      required: true,
    },
    price: {
      // قیمت
      type: Number,
      required: true,
    },
    status: {
      // وضعیت
      type: String, // complete - presell - ...
      required: true,
    },
    discount: {
      //تخفیف
      type: Number,
      required: true,
    },
    categoryID: {
      // برای کدوم دسته هستش
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      // نویسسنده
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

schema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "course",
});

schema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "course",
});

const model = mongoose.model("Course", schema);

module.exports = model;
