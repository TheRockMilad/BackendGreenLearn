const notificationModel = require("./../../models/notification");

//ساخت نوتیفیکشن از مدیر به ادمین ها
exports.create = async (req, res) => {
  const { message, admin } = req.body;
  // Validate
  const notification = await notificationModel.create({ message, admin });

  return res.status(201).json(notification);
};
//دیدن نوتیفیکشن مورد نظر
exports.get = async (req, res) => {
  const { _id } = req.user;

  const adminNotifications = await notificationModel.find({ admin: _id });
  return res.json(adminNotifications);
};
// لینک دیدن پیام ها
exports.seen = async (req, res) => {
  const { id } = req.params;
  // Validate

  const notification = await notificationModel.findOneAndUpdate(
    { _id: id },
    {
      seen: 1,
    }
  );

  return res.json(notification);
};
// گرفتن تمام نوتیفیکشن ها
exports.getAll = async (req, res) => {
  const notifications = await notificationModel.find({});
  return res.json(notifications);
};
//پاک کردن نوتیفیکشن 
exports.remove = async (req, res) => {
  // Remove ...
};
