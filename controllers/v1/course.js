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

exports.getOne = async (req, res) => {
  const course = await courseModel
    .findOne({ href: req.params.href })
    .populate("creator", "-password")
    .populate("categoryID");

  const sessions = await sessionModel.find({ course: course._id }).lean();
  const comments = await commentsModel
    .find({ course: course._id, isAccept: 1 })
    .populate("creator", "-password")
    .populate("course")
    .lean();

  const courseStudentsCount = await courseUserModel
    .find({
      course: course._id,
    })
    .count();

  const isUserRegisteredToThisCourse = !!(await courseUserModel.findOne({
    user: req.user._id,
    course: course._id,
  }));

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

  const session = await sessionModel.findOne({ _id: req.params.sessionID });

  const sessions = await sessionModel.find({ course: course._id });

  return res.json({ session, sessions });
};

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

exports.register = async (req, res) => {
  const isUserAlreadyRegistered = await courseUserModel
    .findOne({
      user: req.user._id,
      course: req.params.id,
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

exports.getCoursesByCategory = async (req, res) => {
  const { href } = req.params;
  const category = await categoryModel.findOne({ href });

  if (category) {
    const categoryCourses = await courseModel.find({
      categoryID: category._id,
    });

    res.json(categoryCourses);
  } else {
    res.josn([]);
  }
};

exports.remove = async (req, res) => {
  const isObjectIDValid = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isObjectIDValid) {
    return res.status(409).json({
      messgae: "Course ID is not valid !!",
    });
  }

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

exports.getRelated = async (req, res) => {
  const { href } = req.params;

  const course = await courseModel.findOne({ href });

  if (!course) {
    return res.status(404).json({
      messgae: "Course not found !!",
    });
  }

  let relatedCourses = await courseModel.find({
    categoryID: course.categoryID,
  });

  relatedCourses = relatedCourses.filter((course) => course.href !== href);

  return res.json(relatedCourses);
};

exports.popular = async (req, res) => {
  // Coding ...✌️
};

exports.presell = async (req, res) => {
  // Coding ...✌️
};
