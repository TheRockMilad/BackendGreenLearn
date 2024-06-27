const express = require("express");
const contactsController = require("./../../controllers/v1/contact");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, contactsController.getAll)
  .post(contactsController.create);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, contactsController.remove);

router
  .route("/answer")
  .post(authMiddleware, isAdminMiddleware, contactsController.answer);

module.exports = router;
