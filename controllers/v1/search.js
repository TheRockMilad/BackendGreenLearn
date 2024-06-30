const courseModel = require("./../../models/course");

exports.get = async (req, res) => {
  const { keyword } = req.params;
  const courses = await courseModel.find({
    // میگیم اولش هر چی بود وسطش کلمه سرچ شده باشه ، اخرش هم 
    // بازم هرچی بود مهم نیست
    name: { $regex: ".*" + keyword + ".*" },
  });

  // articles ...

  return res.json(courses);
};
