const express = require("express");
const offController = require("./../../controllers/v1/off");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, offController.getAll)
  .post(authMiddleware, isAdminMiddleware, offController.create);

router
  .route("/all")
  .post(authMiddleware, isAdminMiddleware, offController.setOnAll);

router.route("/:code").post(authMiddleware, offController.getOne);

router.route("/:id").delete(authMiddleware, offController.remove);

module.exports = router;
