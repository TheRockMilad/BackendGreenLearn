const express = require("express");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const articlesController = require("./../../controllers/v1/article");
const multer = require("multer");
const multerStorage = require("./../../utils/uploader");

const router = express.Router();

router
  .route("/")
  // گرفتن تمام مقاله ها
  .get(articlesController.getAll)
  // ساخت مقاله 
  .post(
    authMiddleware,
    isAdminMiddleware,
    multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single(
      "cover"
    ),
    articlesController.create
  );
// گرفتن یک مقاله
router.route("/:href").get(articlesController.getOne);

router
.route("/:id")
// پاک کردن یک مقاله
  .delete(authMiddleware, isAdminMiddleware, articlesController.remove);

router
  .route("/draft")
  // پیش نمایش کردن مقاله
  .post(
    authMiddleware,
    isAdminMiddleware,
    multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single(
      "cover"
    ),
    articlesController.saveDraft
  );

module.exports = router;
