const express = require("express");
const coursesController = require("./../../controllers/v1/course");
const multer = require("multer");
const multerStorage = require("./../../utils/uploader");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  // ساخت دوره
  .post(
    multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single(
      "cover"
    ),
    authMiddleware,
    isAdminMiddleware,
    coursesController.create
  )
  // گرفتن تمام اطلاعات دروه ها
  .get(authMiddleware, isAdminMiddleware, coursesController.getAll);

router.route("/popular").get(coursesController.popular);
router.route("/presell").get(coursesController.presell);

// دریافت اطلاعات یک دوره با اسم دوره ، برای کاربر
router.route("/:href").get(authMiddleware, coursesController.getOne);

router
  .route("/:id")
  // پاک کردن ی دوره
  .delete(authMiddleware, isAdminMiddleware, coursesController.remove);

// برای دریافت دوره های مرتبط به هم
router.route("/related/:href").get(coursesController.getRelated);

// نمایش دوره های داخل دسته بندی ها
router.route("/category/:href").get(coursesController.getCoursesByCategory);

// ثبت نام داخل یک دوره
router.route("/:id/register").post(authMiddleware, coursesController.register);

// دریافت اطلاعات جلسه - جلسات مرتبط هم میاره
router.route("/:href/:sessionID").get(coursesController.getSessionInfo);

router.route("/:id/sessions").post(
  // multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single(
  //   "video"
  // ),
  authMiddleware,
  isAdminMiddleware,
  coursesController.createSession
);

router
  .route("/sessions")
  .get(authMiddleware, isAdminMiddleware, coursesController.getAllSessions);

router
  .route("/sessions/:id") // پاک کردن دوره ها
  .delete(authMiddleware, isAdminMiddleware, coursesController.removeSession);

module.exports = router;
