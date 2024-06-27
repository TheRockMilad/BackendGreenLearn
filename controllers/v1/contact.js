const contactModel = require("./../../models/contact");
const nodemailer = require("nodemailer");

exports.getAll = async (req, res) => {
  const contacts = await contactModel.find({});
  return res.json(contacts);
};

exports.create = async (req, res) => {
  const { name, email, phone, body } = req.body;

  const contact = await contactModel.create({
    name,
    email,
    phone,
    body,
    answer: 0, // => 1
  });

  return res.status(201).json(contact);
};

exports.remove = async (req, res) => {
  // Validate ...
  const deletedContact = await contactModel.findOneAndRemove({
    _id: req.params.id,
  });

  if (!deletedContact) {
    return res.status(404).json({ message: "Contact not found !!" });
  }

  return res.json(deletedContact);
};

exports.answer = async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sabzlearnirr@gmail.com",
      pass: "qemoucsnnprkwoya",
    },
  });

  const mailOptions = {
    from: "sabzlearnirr@gmail.com",
    to: req.body.email,
    subject: "پاسخ پیغام شما از سمت آکادمی سبزلرن",
    text: req.body.answer,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.json({ message: error });
    } else {
      const contact = await contactModel.findOneAndUpdate(
        {
          email: req.body.email,
        },
        { answer: 1 }
      );
      return res.json({ message: "Email sent successfully :))" });
    }
  });
};
