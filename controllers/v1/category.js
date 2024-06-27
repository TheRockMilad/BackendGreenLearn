const { default: mongoose } = require("mongoose");
const categoryModel = require("./../../models/category");

exports.create = async (req, res) => {
  const { title, href } = req.body;
  const category = await categoryModel.create({ title, href });

  return res.status(201).json(category);
};

exports.getAll = async (req, res) => {
  const categories = await categoryModel.find({});
  return res.json(categories);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const isValidID = mongoose.Types.ObjectId.isValid(id);

  if (!isValidID) {
    return res.status(409).json({
      message: "Category ID is not valid !!",
    });
  }

  const deletedCategory = await categoryModel.findOneAndRemove({
    _id: id,
  });

  return res.json(deletedCategory);
};

exports.update = async (req, res) => {
  const { title, href } = req.body;
  const isValidID = mongoose.Types.ObjectId.isValid(req.params.id);
  // Validate

  if (!isValidID) {
    return res.status(409).json({
      message: "Category ID is not valid !!",
    });
  }

  const updatedCategory = await categoryModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      title,
      href,
    }
  );

  if (!updatedCategory) {
    return res.status(404).json({
      message: "Category not found !!",
    });
  }

  return res.json(updatedCategory);
};
