const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: { // بک اند
    type: String,
    required: true,
  },
  href: { // back-end => for url 
    type: String,
    required: true,
  },
});

const model = mongoose.model("Category", schema);

module.exports = model;
