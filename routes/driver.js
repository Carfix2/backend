const router = require("express").Router();
const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
import Driver from "../database/models/driver";

router.get("/me", async (req, res) => {
  try {
    const profile = await Driver.findOne({
      Driver: req.params.id,
    }).populate("Driver", [
      "firstName",
      "email",
      "phoneNumber",
      "whatsAppNumber",
    ]);

    if (!profile) {
      return res.status(400).json({ msg: "Driver profile does not exist" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put(
  "/updateprofile",
  [
    auth,
    [
      check("email", "email is required").not().isEmpty(),
      check("phoneNumber", "phone number is required").not().isEmpty(),
      check("whatsAppNumber", "whatsAppNumber is required").not().isEmpty(),
      check("telegramId", "telegramId is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phoneNumber, whatsAppNumber, telegramId } = req.body;

    const newProfile = {
      email,
      phoneNumber,
      whatsAppNumber,
      telegramId,
    };

    try {
      const profile = await Driver.findOne({ Driver: req.params.id });
      profile.data.unshift(newProfile);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

////////////////////////////////////////////////////////////////////////////////
//REGISTRATION/////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.post(
  "/",
  [
    check("firstName", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, email, password } = req.body;

    try {
      let user = await Driver.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Driver already exists!" }] });
      }

      user = new Driver({
        firstName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/*
router.post("/driver/register", function (req, res) {
  const newdriver = new Driver(req.body);
  console.log(newdriver);

  if (newdriver.password != newdriver.password2)
    return res.status(400).json({ message: "password not match" });

  Driver.findOne({ email: newdriver.email }, function (err, driver) {
    if (driver)
      return res
        .status(400)
        .json({ authDriver: false, message: "email exits" });

    newdriver.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      res.status(200).json({
        success: true,
        driver: doc,
      });
    });
  });
});

router.post("/driver/login", function (req, res) {
  let token = req.cookies.auth;
  Driver.findByToken(token, (err, driver) => {
    if (err) return res(err);
    if (driver)
      return res.status(400).json({
        error: true,
        message: "You are already logged in",
      });
    else {
      Driver.findOne({ email: req.body.email }, function (err, driver) {
        if (!driver)
          return res.json({
            isAuth: false,
            message: " Auth failed ,email not found",
          });

        driver.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
            return res.json({
              isAuth: false,
              message: "password doesn't match",
            });

          driver.generateToken((err, driver) => {
            if (err) return res.status(400).send(err);
            res.cookie("auth", driver.token).json({
              isAuth: true,
              id: driver._id,
              email: driver.email,
            });
          });
        });
      });
    }
  });
});

router.get("/driver/logout", authDriver, function (req, res) {
  req.driver.deleteToken(req.token, (err, driver) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
});

*/

export default router;
