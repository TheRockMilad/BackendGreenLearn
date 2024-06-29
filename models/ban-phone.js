const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("BanUser", schema);

module.exports = model;

// یک شماره میگیره فقط برای بن کردن کاربر با شماره اش