const { default: mongoose } = require("mongoose");
const coursesModel = require("./../../models/course");
const offsModel = require("./../../models/Off");

// دیدین تمامی تخفیف ها
exports.getAll = async (req, res) => {
  const offs = await offsModel
  //چون وردی نداریم ی {} خالی میزاریم و توی بعدی میگیم اون کم بشه 
    .find({}, "-__v")
    // از دوره ها فقط اسمش و اچ رف رو میفرستیم 
    .populate("course", "name href")
    //از سازنده اون تخفیف هم اسمش رو 
    .populate("creator", "name");

  return res.json(offs);
};
// ساخت کد تخفیف برای دوره ی خواص
exports.create = async (req, res) => {
  const { code, course, percent, max } = req.body;
  // این اطلاعات ست میشه توی تخفیف
  const newOff = await offsModel.create({
    code,
    course,
    percent,
    max,
    uses: 0, // چون کسی هنوز استفاده نکرده 0 میشه 
    creator: req.user._id,  // اینم که با توکن میگیرم 
  });

  return res.status(201).json(newOff);
};
// تخفیف روی همه دوره ها
exports.setOnAll = async (req, res) => {
  // اینجا مقدار تخفیف رو از بادی میگیره
  const { discount } = req.body;
  //مقدار دریافتی رو داخل مدل دوره ها توی مقدار تخفیف اعمال میکنه
  const coursesDiscounts = await coursesModel.updateMany({ discount });
  // پیام اخر
  // ما اون مقدار رواپدیت میکنیم فرانت اند کار میاد 
  // اون مقدار رو از مبلغ دوره کم میکنه  
  return res.json({ message: "Discounts set successfully :))" });
};
// اعمال تخفیف و بررسی کد تخفیف
exports.getOne = async (req, res) => {
  //کد تخفیف توی پارامز میاد
  const { code } = req.params;
  // آیدی دوره از بدنه میاد
  const { course } = req.body;
// آیدی دوره ارسالی چک میشه 
  if (!mongoose.Types.ObjectId.isValid(course)) {
    //این آیدی دوره معتبر نیست 
    return res.json({ message: "Course ID is not valid !!" });
  }
// اینجا میره این تخفیف رو پیدا میکنه
  const off = await offsModel.findOne({ code, course });

  // اگر وجود نداشت 
  if (!off) {
    // میزنیم این کد معتبر نیست
    return res.status(404).json({ message: "Code is not valid" });
    // در غیر اینطورت اگر تعداد تخفیف با تعداد تخفیف برابر بود
  } else if (off.max === off.uses) {
    // میزنیم این کد استفاده شده
    return res.status(409).json({ message: "This code already used !!" });
  } else {
    // در غیراینصورت
    // میایم اون تخفیف رو دوباره پیدا میکنیم و آپدیت میکنیم
    // میزان استفاده رو یکی بهش اضافه میکنیم
    await offsModel.findOneAndUpdate(
      {
        code,
        course,
      },
      {
        uses: off.uses + 1,
      }
    );
    // اینجا هم اگر اوکی بود همه چیز کل اون تخفیف رو برای 
    // فرانت ارسال میکنیم که بتونه اعمال کنه
    return res.json(off);
  }
};
// پاک کردن تخفیف ها
exports.remove = async (req, res) => {
  // Codes
  // objectID => Validate => Remove Off Code => 404
};
