const userModel = require("./../../models/user");
const banUserModel = require("./../../models/ban-phone");

const bcrypt = require("bcrypt");
const { isValidObjectId } = require("mongoose");

// برای بن کردن یوزر باید شماره اونی که بن شده رو بفرستیم توی
// دیتابیس بن شده ها
exports.banUser = async (req, res) => {
  const mainUser = await userModel.findOne({ _id: req.params.id }).lean();
  const banUserResult = banUserModel.create({ phone: mainUser.phone });

  if (banUserModel) {
    return res.status(200).json({ message: "User ban successfully :))" });
  }

  return res.status(500).json({ message: "Server Error !!" });
};

exports.getAll = async (req, res) => {
  const users = await userModel.find({});

  return res.json(users);
};

exports.removeUser = async (req, res) => {
  const isValidUserID = isValidObjectId(req.params.id);
  // چک بشه که ولید هست یا نه
  if (!isValidUserID) {
    return res.status(409).json({
      message: "User ID is not valid !!",
    });
  }
  // کاربر رو پاک کن با مقدار آیدی دریافتی
  const removedUser = await userModel.findByIdAndRemove({ _id: req.params.id });

  // اگر پاک نشد این خطا رو بده
  if (!removedUser) {
    return res.status(404).json({
      message: "There is no user !!",
    });
  }

  return res.status(200).json({
    message: "User Removed Successfully :))",
  });
};

exports.changeRole = async (req, res) => {
  const { id } = req.body;
  const isValidUserID = isValidObjectId(id);

  // بررسی ایدی معتبر
  if (!isValidUserID) {
    return res.status(409).json({
      message: "User ID is not valid !!",
    });
  }
  // اون کاربر رو میگیریم
  const user = await userModel.findOne({ _id: id });

  // if    ADMIN => USER
  // If    USER => ADMIN
  let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  // اینجا دوباره با اون ایدی کاربر رو پیدا کن و نقشش رو عوض کن
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      role: newRole,
    }
  );

  if (updatedUser) {
    return res.json({
      message: `${user.name} role changed to ${newRole}  :))`,
    });
  }
};

exports.updateUser = async (req, res) => {
  // اعتبارسنجی انجام بشه ، اینجا انجام نداده
  const { name, username, email, password, phone } = req.body;

  // پسورد در هر صورت باید هش بشه
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userModel
    .findByIdAndUpdate(
      { _id: req.user._id },
      {
        name,
        username,
        email,
        password: hashedPassword,
        phone,
      }
    )
    // دوباره پسورد رو برمیداریم
    .select("-password")
    .lean();

  return res.json(user);
};
