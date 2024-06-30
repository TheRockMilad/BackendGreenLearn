const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: { // اسم زیر مجموعه دپارتمان
      type: String,
      required: true,
    },
    parent: { // والد (دپارتمان اصلی)
      type: mongoose.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("DepartmentSub", schema);

module.exports = model;
