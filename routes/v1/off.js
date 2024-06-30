const express = require("express");
const offController = require("./../../controllers/v1/off");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  // دیدن تمام تخفیفات توسط مدیر
  .get(authMiddleware, isAdminMiddleware, offController.getAll)
  // ساخت کد تخفیف برای دوره ها
  .post(authMiddleware, isAdminMiddleware, offController.create);

router
  .route("/all")
  // گذاشتن تخفیف روی همه دوره ها
  .post(authMiddleware, isAdminMiddleware, offController.setOnAll);

// اعمال تخفیف و بررسی کد تخفیف
router.route("/:code").post(authMiddleware, offController.getOne);

// پاک کردن کد تخفیف
router.route("/:id").delete(authMiddleware, offController.remove);

module.exports = router;
