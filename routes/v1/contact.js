const express = require("express");
const contactsController = require("./../../controllers/v1/contact");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  //دیدن تمام تماس با ما ، توسط مدیر
  .get(authMiddleware, isAdminMiddleware, contactsController.getAll)
  // ارسال نظرت و تماس با ما
  .post(contactsController.create);

router
  // پاک کردن پیام تماس با ما
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, contactsController.remove);

router
  // جواب دادن به تماس با ما
  .route("/answer")
  .post(authMiddleware, isAdminMiddleware, contactsController.answer);

module.exports = router;
