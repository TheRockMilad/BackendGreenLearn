const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const banUserModel = require("./../../models/ban-phone");

const registerValidator = require("./../../validators/register");

exports.register = async (req, res) => {
  const validationResult = registerValidator(req.body);
  if (validationResult != true) {
    return res.status(422).json(validationResult);
  }

  const { username, name, email, password, phone } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(409).json({
      message: "username or email is duplicated",
    });
  }

  const isUserBan = await banUserModel.find({ phone });

  if (isUserBan.length) {
    return res.status(409).json({
      message: "This phone number ban !",
    });
  }

  const countOfUsers = await userModel.count();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    username,
    name,
    phone,
    password: hashedPassword,
    role: countOfUsers > 0 ? "USER" : "ADMIN",
  });

  const userObject = user.toObject();
  Reflect.deleteProperty(userObject, "password");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });

  return res.status(201).json({ user: userObject, accessToken });

  // Coding
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return res.status(401).json({
      message: "There is no user with this email or username",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Password in not valid !!",
    });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });

  return res.json({ accessToken });
};

exports.getMe = async (req, res) => {};
