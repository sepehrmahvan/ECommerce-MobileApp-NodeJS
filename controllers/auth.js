const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed.",
        errors: errors.array(),
      });
    }
    const { phoneNumber, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      phoneNumber,
      password: hashedPassword,
    });
    const result = await user.save();

    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      const error = new Error("Корбаре бо ин рақами телефон ёфт нашуд.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Рақами телефон ёфта ҳамчун ҳифз.");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        phoneNumber: user.phoneNumber,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
