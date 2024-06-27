const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const banUserModel = require("./../../models/ban-phone");

const registerValidator = require("./../../validators/register");

exports.register = async (req, res) => {
  // بررسی اینکه آیا اطلاعات اومد درست هست یا نه
  const validationResult = registerValidator(req.body);
  // این یا آرایه میاره یا ترو
  if (validationResult != true) {
    return res.status(422).json(validationResult);
  }

  const { username, name, email, password, phone } = req.body;

  // چک کردن در دیتابیس که ایمیل یا یوزرنیم در سایت هست یا نه
  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // بررسی این که هست یا نه
  if (isUserExists) {
    return res.status(409).json({
      message: "username or email is duplicated",
    });
  }
  
  const isUserBan = await banUserModel.find({ phone });

  // اینجا بررسی میکنه که متغیر بالا خالیه یا مقدار داره
  // اگه مقدار داشته باشه ترو حساب میشه 
  if (isUserBan.length) {
    return res.status(409).json({
      message: "This phone number ban !",
    });
  }

  // تعداد یوزر های داخل دیتابیس برای اینکه اولی رو به ادمین تغییر بدیم
  const countOfUsers = await userModel.count();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    username,
    name,
    phone,
    password: hashedPassword,
    // اولین نفر ثبت نام کنه میشه ادمین بقیه میشن یوزر
    role: countOfUsers > 0 ? "USER" : "ADMIN",
  });
  // یوزر رو به فرمت آبجکت تغییر میدیم
  const userObject = user.toObject();
  // بهش میگیم مقدار پسورد رو حذف کن 1
  Reflect.deleteProperty(userObject, "password");

  // بهش توکن میدیم
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });
  // اینجا بهش میگیم بجای یوزر ، ابجکت یوزر رو نشون بده
  // چون پسورد نداره
  return res.status(201).json({ user: userObject, accessToken });
};

exports.login = async (req, res) => {
  // اینجا میگه پسورد با یه (یوزر یا ایمیل ) بفرست
  const { identifier, password } = req.body;

  const user = await userModel.findOne({
    // یا یوزر برابر باشه یا ایمیل برابر باشه
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return res.status(401).json({
      message: "There is no user with this email or username",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  // اگر معتبر نباشه 
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Password in not valid !!",
    });
  }
  //  توکن میدیم بهش
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });

  return res.json({ accessToken });
};

exports.getMe = async (req, res) => {};
