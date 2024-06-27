const app = require("./app");
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const port = process.env.PORT;

(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB Connected :))");
})();

app.get("/", (req, res) => {
  console.log("Token =>", req.header("Authorization").split(" ")[1]);
  res.json({ message: "Ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
