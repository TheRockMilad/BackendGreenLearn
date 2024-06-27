const express = require("express");
const userController = require("./../../controllers/v1/user");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, userController.getAll)
  .put(authMiddleware, userController.updateUser);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, userController.removeUser);

router
  .route("/role") // req.body.id
  .put(authMiddleware, isAdminMiddleware, userController.changeRole);

router
  .route("/ban/:id")
  //بررسی میکنه
  // میدلور اول که آیا توکن داره 
  // میدلور دوم آیا ادمین هستش
  // بعد میره عملیات بن شدن
  .post(authMiddleware, isAdminMiddleware, userController.banUser);

module.exports = router;
