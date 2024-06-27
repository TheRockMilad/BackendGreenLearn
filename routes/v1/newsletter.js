const express = require("express");
const newsletterController = require("../../controllers/v1/newsletter");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, newsletterController.getAll)
  .post(newsletterController.create);

module.exports = router;
