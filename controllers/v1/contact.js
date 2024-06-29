const contactModel = require("./../../models/contact");
const nodemailer = require("nodemailer");

// گرفتن تمام پیام های تماس با ماتوسط مدیر
exports.getAll = async (req, res) => {
  const contacts = await contactModel.find({});
  return res.json(contacts);
};
// ارسال پیام در تماس با ما
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
// پاک کردن پیام های تماس با ما
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
// nodemailer
// جواب به پیام های تماس با ما
exports.answer = async (req, res) => {
  let transporter = nodemailer.createTransport({
    // نوع سرویس
    service: "gmail",
    // احراز هویت
    auth: {
      user: "miladhosseini4d@gmail.com",
      //پسورد دریافتی از گوگل
      // setting/manage your google account/security/2-step verification/
      //get started/sms / turn on /
      //search app password : select app = main | generate password
      pass: "opbv ehfp numh rzto",
    },
  });
  // گزینه های ارسال رو تنظیم میکنیم
  const mailOptions = {
    from: "sabzlearnirr@gmail.com",
    to: req.body.email,
    subject: "پاسخ پیغام شما از سمت آکادمی سبزلرن",
    //اینم از بادی میگیریم
    text: req.body.answer,
  };

  // اینجا هم ارسال روانجام میدیم
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.json({ message: error });
    } else {
      // اگر مشکلی نداشت
      // میام و گزینه جواب دادن رو برابر با یک میکنیم
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
