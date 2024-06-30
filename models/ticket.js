const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    departmentID: { // آیدی دپارتمان
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    departmentSubID: { // آیدی زیردپارتما
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSub",
      required: true,
    },
    priority: {//الویت 
      type: Number, // 1, 2, 3
      required: true,
    },
    title: {//  موضوع تیکت
      type: String,
      required: true,
    },
    body: { // متن تیکت
      type: String,
      required: true,
    },
    user: { // یوزر ارسال کننده
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    answer: { // جواب داده شده یا نه
      type: Number, // 0 - 1
      required: true,
    },
    course: { // آیدی اون دوره 
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Course",
    },
    parent: {  // مشخص کردن این که تیکت اصلی هست یا پاسخ 
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
      required: false,
    },
    isAnswer: { // تیکت به عنوان پاسخ ثبت شده یا کاربر فرستاده 
      type: Number, // 0 - 1
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Ticket", schema);

module.exports = model;
