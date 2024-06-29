const express = require("express");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const commentsController = require("./../../controllers/v1/comment");

const router = express.Router();

router
  .route("/")
  // گذاشتن کامنت 
  .post(authMiddleware, commentsController.create)
  //آوردن همه کامنت ها
  .get(authMiddleware, isAdminMiddleware, commentsController.getAll);

router
  .route("/:id")
  // پاک کردن یک کامنت از سایت
  .delete(authMiddleware, isAdminMiddleware, commentsController.remove);

router
  // تایید کردن کامنت ها
  .route("/:id/accept")
  .put(authMiddleware, isAdminMiddleware, commentsController.accept);

router
  // رد کردن کامنت ها 
  .route("/:id/reject")
  .put(authMiddleware, isAdminMiddleware, commentsController.reject);

router
  // جواب به کامنت ها و نمایش آنها
  .route("/:id/answer")
  .post(authMiddleware, isAdminMiddleware, commentsController.answer);

module.exports = router;
