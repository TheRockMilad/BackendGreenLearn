const express = require("express");

const ticketsController = require("./../../controllers/v1/ticket");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  // ساخت یکی تیکت توسط کاربر
  .post(authMiddleware, ticketsController.create)
  // گرفتن تمام تیکت ها توسط مدیر
  .get(authMiddleware, isAdminMiddleware, ticketsController.getAll);

// دیدن تمام تیکت های کاربر توسط خودش
router.route("/user").get(authMiddleware, ticketsController.userTickets);
// دیدن دپارتمان ها
router.route("/departments").get(ticketsController.departments);
// دیدن زیردپارتمان ها
router.route("/departments/:id/subs").get(ticketsController.departmentsSubs);

router
  .route("/answer")
  // جواب دادن به  تیکت
  .post(authMiddleware, isAdminMiddleware, ticketsController.setAnswer);

// گرفتن جواب تیکت
router.route("/:id/answer").get(authMiddleware, ticketsController.getAnswer);

module.exports = router;
