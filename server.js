const app = require("./app");
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const port = process.env.PORT || 3000;

// (()=>{})()
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    // console.log("MongoDB Connected :))");
    console.log("MongoDB Connected :))");
  } catch (error) {
    console.log(error);
  }
})();

app.get("/", (req, res) => {
  // اینجوری میتونیم توکن رو بگیریم
  // و با نصف کردنش با جای خالی و انتخاب ایندکس دوم
  // فقط خود توکن رو دریافت کنیم
  console.log("Token =>", req.header("Authorization").split(" ")[1]);
  res.json({ message: "Ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
