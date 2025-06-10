const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("phoneNumber")
      .isLength({ min: 12, max: 12 })
      .matches(/^992\d{9}$/)
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const user = await User.findOne({ phoneNumber: value });
        if (user) {
          return Promise.reject("Рақами телефон аллакай вуҷуд дорад");
        }
      }),
    body("password").trim().isLength({ min: 8, max: 20 }).notEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
