const { default: mongoose } = require("mongoose");
const coursesModel = require("./../../models/course");
const offsModel = require("./../../models/Off");

exports.getAll = async (req, res) => {
  const offs = await offsModel
    .find({}, "-__v")
    .populate("course", "name href")
    .populate("creator", "name");

  return res.json(offs);
};

exports.create = async (req, res) => {
  const { code, course, percent, max } = req.body;

  const newOff = await offsModel.create({
    code,
    course,
    percent,
    max,
    uses: 0,
    creator: req.user._id,
  });

  return res.status(201).json(newOff);
};

exports.setOnAll = async (req, res) => {
  const { discount } = req.body;

  const coursesDiscounts = await coursesModel.updateMany({ discount });

  return res.json({ message: "Discounts set successfully :))" });
};

exports.getOne = async (req, res) => {
  const { code } = req.params;
  const { course } = req.body;

  if (!mongoose.Types.ObjectId.isValid(course)) {
    return res.json({ message: "Course ID is not valid !!" });
  }

  const off = await offsModel.findOne({ code, course });

  if (!off) {
    return res.status(404).json({ message: "Code is not valid" });
  } else if (off.max === off.uses) {
    return res.status(409).json({ message: "This code already used !!" });
  } else {
    await offsModel.findOneAndUpdate(
      {
        code,
        course,
      },
      {
        uses: off.uses + 1,
      }
    );
    return res.json(off);
  }
};

exports.remove = async (req, res) => {
  // Codes
  // objectID => Validate => Remove Off Code => 404
};
