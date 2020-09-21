const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const nconf = require("nconf");
const jwtSecretToken = nconf.get('jwtSecret')
const jwt = require("jsonwebtoken");
import Driver from "../database/models/driver";
import { authDriver } from "../middleware/auth";

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
    authDriver,
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

//Registration
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
        jwtSecretToken,
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


export default router;
