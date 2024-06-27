const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    seen: {
      type: Number, // 0 - 1
      default: 0,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Notification", schema);

module.exports = model;
