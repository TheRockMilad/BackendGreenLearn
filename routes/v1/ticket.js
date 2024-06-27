const express = require("express");

const ticketsController = require("./../../controllers/v1/ticket");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, ticketsController.create)
  .get(authMiddleware, isAdminMiddleware, ticketsController.getAll);

router.route("/user").get(authMiddleware, ticketsController.userTickets);

router.route("/departments").get(ticketsController.departments);
router.route("/departments/:id/subs").get(ticketsController.departmentsSubs);

router
  .route("/answer")
  .post(authMiddleware, isAdminMiddleware, ticketsController.setAnswer);

router.route("/:id/answer").get(authMiddleware, ticketsController.getAnswer);

module.exports = router;
