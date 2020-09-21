const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
import Mechanic from "../database/models/mechanic";
import { signToken, authMechanic } from "../middleware/auth";
import { sendBadRequest, sendJSONResponse } from "../utils";
import mongoose from 'mongoose'


router.get("/current", authMechanic, async (req, res) => {
  if (req.user) {
    return sendJSONResponse(res, 200, 'Authenticated', req.user)
  } else {
      return sendBadRequest(res, 401, 'Unauthorized')
  }
});

router.put(
  "/updateProfile",
  [
    authMechanic,
    [
      check("workshopName", "workshopName is required").not().isEmpty(),
      check("workshopAddress", "workshopAddress is required").not().isEmpty(),
      check("email", "email is required").not().isEmpty(),
      check("phoneNumber", "phone number is required").not().isEmpty(),
      check("whatsAppNumber", "whatsAppNumber is required").not().isEmpty(),
      check("telegramId", "telegramId is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendBadRequest(res, 400, errors)
    }

    const {
      workshopName,
      workshopAddress,
      email,
      phoneNumber,
      whatsAppNumber,
      telegramId,
    } = req.body;

    const newProfile = {
      workshopName,
      workshopAddress,
      email,
      phoneNumber,
      whatsAppNumber,
      telegramId,
    };

    try {
      const profile = await Mechanic.findOne({ Mechanic: req.params.id });
      profile.data.unshift(newProfile);

      await profile.save();
      return sendJSONResponse(res, 200, 'ok', profile)
    } catch (err) {
      console.error(err.message);
      return sendBadRequest(res, 500, 'Error in server')
    }
  }
);

// Registration
router.post(
  "/register",
  [
    check("workshopName", "Workshop name is required").not().isEmpty(),
    check("workshopAddress", "Workshop address is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check('phoneNumber', "Phone number is required").isLength({ min: 8}),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendBadRequest(res, 400, errors)
    }

    const { workshopName, workshopAddress, email, password, phoneNumber } = req.body;

    try {
      let user = await Mechanic.findOne({ email });
      if (user) {
        return sendBadRequest(res, 400, "Mechanic already exists")
      }

      user = new Mechanic({
        _id: new mongoose.Types.ObjectId(),
        workshopName,
        workshopAddress,
        email,
        password,
        phoneNumber,
        whatsAppNumber: phoneNumber
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const token = signToken(user);


      return sendJSONResponse(res, 200, 'OK', {
        user,
        token
      })

    } catch (err) {
      console.error(err.message);
      return sendBadRequest(res, 500, 'Error in server')
    }
  }
);

router.post('/login', [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendBadRequest(res, 400, errors)
    }

    const { email, password } = req.body;

    Mechanic.findOne({ email }, function (err, user) {
      if (err) { 
          return sendBadRequest(res, 400, err.message)
      }
      if (!user) {
          return sendBadRequest(res, 400, 'Incorrect email.')
      }
      if (!user.validPassword(password)) {
          return sendBadRequest(res, 400, 'Incorrect password.')
      }

      const token = signToken(user);
      return sendJSONResponse(res, 200, 'Signup and Login successful!', {
          user,
          token
      })
  });

})


export default router;
