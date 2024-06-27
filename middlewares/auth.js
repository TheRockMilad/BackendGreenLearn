const jwt = require("jsonwebtoken");
const userModel = require("./../models/user");

module.exports = async (req, res, next) => {
  // اینجا از هدر قسمت آتوریشن  توکن رو برمیدارم با دو مقدار
  // avali = bearer
  // dovomi = token
  //؟ یعنی اگر بود انجام بده نبود رد بشو
  const authHeader = req.header("Authorization")?.split(" ");

  //اگر مقدار دریافت برابر با دو نبود
  //؟ یعنی اگر بود انجام بده نبود رد بشو
  if (authHeader?.length !== 2) {
    return res.status(403).json({
      message: "This route is protected and you can't have access to it !!",
    });
  }

  // برابر با دو بود ایندکس یکم که میشه توکن رو میکشیم بیرون
  const token = authHeader[1];

  try {
    // چک کنیم که هنوز توکن معتبر هست یا نه
    // اگر بود ایدی رو از توکن دریافت میکنیم
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    // اون یوزر رو با آیدی بیرون میکشیم
    const user = await userModel.findById(jwtPayload.id).lean();

    // مقدار پسوردش رو برمیداریم
    Reflect.deleteProperty(user, "password");

    // این یوزر که توکن داره رو میفرستیم توی ری کوئست
    req.user = user;

    next();
  } catch (error) {
    return res.json(error);
  }
};
