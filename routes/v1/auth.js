const express = require("express");

const contoller = require("../../controllers/v1/auth");

const router = express.Router();

router.post("/register", contoller.register);
router.post("/login", contoller.login);
router.get("/me", contoller.getMe);

// register - login - getMe
// localhost:4000/api/v1/register
// localhost:4000/api/v2/register

module.exports = router;
