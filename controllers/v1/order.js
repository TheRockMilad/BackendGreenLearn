const courseUserModel = require("./../../models/course-user");

exports.getAll = async (req, res) => {
  const orders = await courseUserModel
    .find({ user: req.user._id })
    .populate("course", "name href")
    .lean();

  return res.json(orders);
};

exports.getOne = async (req, res) => {
  // Validate
  const order = await courseUserModel
    .findOne({ _id: req.params.id })
    .populate("course")
    .lean();

  return res.json(order);
};
