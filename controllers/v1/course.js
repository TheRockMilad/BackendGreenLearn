const courseModel = require("./../../models/course");
const sessionModel = require("./../../models/session");
const categoryModel = require("./../../models/category");
const commentsModel = require("./../../models/comment");
const courseUserModel = require("./../../models/course-user");
const { default: mongoose } = require("mongoose");

//ساخت دوره
exports.create = async (req, res) => {
  const {
    name,
    description,
    support,
    href,
    price,
    status,
    discount,
    categoryID,
  } = req.body;

  const course = await courseModel.create({
    name,
    description,
    creator: req.user._id,
    categoryID,
    support,
    price,
    href,
    status,
    discount,
    cover: req.file.filename,
  });

  const mainCourse = await courseModel
    .findById(course._id)
    .populate("creator", "-password");

  return res.status(201).json(mainCourse);
};
// دریافت اطلاعات دوره با اچ رف
exports.getOne = async (req, res) => {
  // بگرد دنبال دوره ای که اچ اون برابر اچ پارمز هستش
  const course = await courseModel
    .findOne({ href: req.params.href })
    // میگیم اون اکانتی که اینو ساخته رو هم میخوایم ، مدرس دوره
    // پسوردش رو نشون نده
    .populate("creator", "-password")
    // اطلاعات دسته بندی این دوره
    .populate("categoryID");

  // دنبال جلسه هایی بگرد که مقدار فیلد دوره اون با ایدی دوره ای که
  // آوردیم یکی باشه - توی هر جلسه ما آیدی دوره رو گذاشتیم
  const sessions = await sessionModel.find({ course: course._id }).lean();
  // اینم مثل بالایی و تایید هم شده باشه
  // isAccept = 1
  const comments = await commentsModel
    .find({ course: course._id, isAccept: 1 })
    .populate("creator", "-password")
    .populate("course")
    .lean();

  // اینجا تعداد دانشجویان ثبت نام کرده رو هم برمیگردونم
  const courseStudentsCount = await courseUserModel
    .find({
      course: course._id,
    })
    .count();

  // اینجا باید بررسی کنیم با توکن دریافتی که کاربر
  // توی این دوره ثبت نام کرده یا نه
  // null => !!null => false
  // {}   => !!true => true
  // اگه نال برگرده با !! میشه فالس و اگر آرایه برگردونه میشه ترو
  const isUserRegisteredToThisCourse = !!(await courseUserModel.findOne({
    user: req.user._id,
    course: course._id,
  }));

  // هنوز نمیدونم
  let allComments = [];

  comments.forEach((comment) => {
    comments.forEach((answerComment) => {
      if (String(comment._id) == String(answerComment.mainCommentID)) {
        allComments.push({
          ...comment,
          course: comment.course.name,
          creator: comment.creator.name,
          answerComment,
        });
      }
    });
  });

  res.json({
    course,
    sessions,
    comments: allComments,
    courseStudentsCount,
    isUserRegisteredToThisCourse,
  });
};

// ایجاد جلسه
exports.createSession = async (req, res) => {
  const { title, free, time } = req.body;
  const { id } = req.params;

  const session = await sessionModel.create({
    title,
    time,
    free,
    video: "Video.mp4", // req.file.filename
    course: id,
  });

  return res.status(201).json(session);
};

exports.getAll = async (req, res) => {
  const courses = await courseModel
    .find({})
    .populate("categoryID")
    .populate("creator")
    .lean()
    .sort({ _id: -1 });

  const registers = await courseUserModel.find({}).lean();
  const comments = await commentsModel.find({}).lean();

  const allCourses = [];

  courses.forEach((course) => {
    let courseTotalScore = 5;
    const courseRegisters = registers.filter(
      (register) => register.course.toString() === course._id.toString()
    );

    const courseComments = comments.filter((comment) => {
      return comment.course.toString() === course._id.toString();
    });

    courseComments.forEach(
      (comment) => (courseTotalScore += Number(comment.score))
    );

    allCourses.push({
      ...course,
      categoryID: course.categoryID.title,
      creator: course.creator.name,
      registers: courseRegisters.length,
      courseAverageScore: Math.floor(
        courseTotalScore / (courseComments.length + 1)
      ),
    });
  });

  return res.json(allCourses);
};

// دیدن کل جلسات
exports.getAllSessions = async (req, res) => {
  const sessions = await sessionModel
    .find({})
    .populate("course", "name")
    .lean();

  return res.json(sessions);
};

exports.getSessionInfo = async (req, res) => {
  const course = await courseModel.findOne({ href: req.params.href }).lean();

  // اینجا اون یدونه جلسه انتخاب شده رو میاره
  // با آیدی که براش ارسال شده
  const session = await sessionModel.findOne({ _id: req.params.sessionID });

  // اینجا اون دوره ای که دوره هاش برابر این دوره باشه رو همه رو میاره
  const sessions = await sessionModel.find({ course: course._id });

  return res.json({ session, sessions });
};
// حذف دوره ها
exports.removeSession = async (req, res) => {
  const deletedCourses = await sessionModel.findOneAndDelete({
    _id: req.params.id,
  });

  if (!deletedCourses) {
    return res.status(404).json({
      message: "Course not found !!",
    });
  }

  return res.json(deletedCourses);
};
// ثبت نام در دوره
exports.register = async (req, res) => {
  const isUserAlreadyRegistered = await courseUserModel
    .findOne({
      user: req.user._id, // یورز برابر اون یوزری که وارد شده
      course: req.params.id, //  دوره همون دروه ای باشه که ایدی برابر پارامز
    })
    .lean();

  if (isUserAlreadyRegistered) {
    return res.status(409).json({
      message: "User already registered in this course",
    });
  }

  const register = await courseUserModel.create({
    user: req.user._id,
    course: req.params.id,
    price: req.body.price,
  });

  return res
    .status(201)
    .json({ message: "You are registered successfully :))" });
};
// پیدا کردن دوره ها با استفاده از دسته بندی هاش
exports.getCoursesByCategory = async (req, res) => {
  const { href } = req.params;
  // دنبال دسته بندی ای که توی پارامز اومده بگرد
  const category = await categoryModel.findOne({ href });

  if (category) {
    // دوره های دسته بندی رو برامون برگردون
    const categoryCourses = await courseModel.find({
      //  توی دوره ها یک فیلد بنام 1 وجود داره باید
      // برابر باشه با فیلد 2
      // اینجوری هر دسته بندی ، دوره هاش رو برمیگردونه
      // 1 = categoryID
      // 2 = category.id
      categoryID: category._id,
    });

    res.json(categoryCourses);
  } else {
    res.josn([]);
  }
};
// پاک کردن یک دوره
exports.remove = async (req, res) => {
  const isObjectIDValid = mongoose.Types.ObjectId.isValid(req.params.id);

  // بررسی شماره آبجکت آیدی
  if (!isObjectIDValid) {
    return res.status(409).json({
      messgae: "Course ID is not valid !!",
    });
  }
  // دنبال اون دوره بگرد با آیدی توی پارامز و انو پاک کن
  const deletedCourse = await courseModel.findOneAndRemove({
    _id: req.params.id,
  });

  if (!deletedCourse) {
    return res.status(404).json({
      messgae: "Course not found !!",
    });
  }

  return res.json(deletedCourse);
};
// دریافت دوره های مرتبط به هم
exports.getRelated = async (req, res) => {
  const { href } = req.params;
  // دوره این اچ رو میگیریم
  const course = await courseModel.findOne({ href });

  if (!course) {
    return res.status(404).json({
      messgae: "Course not found !!",
    });
  }
  // اگر وجود داشت بگرد توی دوره ها هر دوره ای که
  // آیدی دسته بندیش با آیدی دسته بندی این دوره یکیه رو بیار
  // این ی آرایه ای از درس هاست
  let relatedCourses = await courseModel.find({
    categoryID: course.categoryID,
  });

  // توی آرایه بگرد و فیلتر کن اونی که اچ اون با اچ که
  // دریافت کردیم از پارامز یکی نباشه
  // در واقع میاد اون دوره ای که ما صدا کردیم رو از این دوره ها
  // حذف میکنه تا توی پیشنهاد ها دوره نیاد
  relatedCourses = relatedCourses.filter((course) => course.href !== href);

  return res.json(relatedCourses);
};
// محبوبیت بر اساس امتیاز هر دوره
exports.popular = async (req, res) => {
  // Coding ...✌️
  try {
    const popularCourses = await commentsModel.aggregate([
      {
        $match: { mainCommentID: { $exists: false } },
      },
      {
        $group: {
          _id: "$course",
          totalScore: { $sum: "$score" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          course: "$_id",
          totalScore: 1,
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { totalScore: -1 }, // مرتب‌سازی به ترتیب نزولی بر اساس مجموع امتیازها
      },
      {
        $limit: 5, // محدود کردن نتایج به 5 دوره
      },
    ]);

    res.status(200).json(popularCourses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular courses", error });
  }
};

exports.presell = async (req, res) => {
  // Coding ...✌️
};
