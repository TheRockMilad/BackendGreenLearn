const commentModel = require("./../../models/comment");
const courseModel = require("./../../models/course");

exports.create = async (req, res) => {
  const { body, courseHref, score } = req.body;

  const course = await courseModel.findOne({ href: courseHref }).lean();

  const comment = await commentModel.create({
    body,
    course: course._id,
    creator: req.user._id,
    score,
    isAnswer: 0,
    isAccept: 0, // 1 => show as public
  });

  return res.status(201).json(comment);
};

exports.remove = async (req, res) => {
  const deletedComment = await commentModel.findOneAndRemove({
    _id: req.params.id,
  });

  if (!deletedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  return res.json(deletedComment);
};

exports.accept = async (req, res) => {
  const acceptedComment = await commentModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { isAccept: 1 }
  );

  if (!acceptedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  return res.json({ message: "Comment accepted successfully" });
};

exports.reject = async (req, res) => {
  const rejectedComment = await commentModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { isAccept: 0 }
  );

  if (!rejectedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  return res.json({ message: "Comment rejected successfully" });
};

exports.answer = async (req, res) => {
  const { body } = req.body;

  const acceptedComment = await commentModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      isAccept: 1,
    }
  );

  if (!acceptedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  const answerComment = await commentModel.create({
    body,
    course: acceptedComment.course,
    creator: req.user._id,
    isAnswer: 1,
    isAccept: 1, // 1 => show as public
    mainCommentID: req.params.id,
  });

  return res.status(201).json(answerComment);
};

exports.getAll = async (req, res) => {
  const comments = await commentModel
    .find()
    .populate("course")
    .populate("creator", "-password")
    .lean();

  // Codes ...

  return res.json(comments);
};
