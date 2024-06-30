const newsletterModel = require("./../../models/newsletter");

// گرفتن تمام ایمیل ها
exports.getAll = async (req, res) => {
  const newsletters = await newsletterModel.find();
  return res.json(newsletters);
}; 
// ارسال ایمیل به خبرنامه
exports.create = async (req, res) => {
  const { email } = req.body;

  // Validate -> Error

  const newEmail = await newsletterModel.create({ email });
  return res.json(newEmail);
};
