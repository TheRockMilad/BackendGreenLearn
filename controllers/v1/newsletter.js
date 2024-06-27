const newsletterModel = require("./../../models/newsletter");

exports.getAll = async (req, res) => {
  const newsletters = await newsletterModel.find();
  return res.json(newsletters);
};

exports.create = async (req, res) => {
  const { email } = req.body;

  // Validate -> Error

  const newEmail = await newsletterModel.create({ email });
  return res.json(newEmail);
};
