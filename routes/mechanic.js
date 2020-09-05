const router = require("express").Router();
const { authMechanic } = require("./authMechanic");
import Mechanic from "../database/models/mechanic";

router.get("/me", async (req, res) => {
  try {
    const profile = await Mechanic.findOne({
      Mechanic: req.params.id,
    }).populate("Mechanic", [
      "workshopName",
      "workshopAddress",
      "email",
      "phoneNumber",
      "whatsAppNumber",
      "telegramId",
    ]);

    if (!profile) {
      return res.status(400).json({ msg: "Mechanic profile does not exist" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put(
  "/updatemechanicprofile",
  // [
  //   auth,
  //   [
  //     check("workshopName", "workshopName is required").not().isEmpty(),
  //     check("workshopAddress", "workshopAddress is required").not().isEmpty(),
  //     check("email", "email is required").not().isEmpty(),
  //     check("phoneNumber", "phone number is required").not().isEmpty(),
  //     check("whatsAppNumber", "whatsAppNumber is required").not().isEmpty(),
  //     check("telegramId", "telegramId is required").not().isEmpty(),
  //   ],
  // ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post("/mechanic/register", function (req, res) {
  // taking a mechanic
  const newmechanic = new Mechanic(req.body);
  console.log(newmechanic);

  if (newmechanic.password != newmechanic.password2)
    return res.status(400).json({ message: "password not match" });

  Mechanic.findOne({ email: newmechanic.email }, function (err, mechanic) {
    if (mechanic)
      return res
        .status(400)
        .json({ authMechanic: false, message: "email exits" });

    newmechanic.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      res.status(200).json({
        success: true,
        mechanic: doc,
      });
    });
  });
});

// login mechanic
router.post("/mechanic/login", function (req, res) {
  let token = req.cookies.auth;
  Mechanic.findByToken(token, (err, mechanic) => {
    if (err) return res(err);
    if (mechanic)
      return res.status(400).json({
        error: true,
        message: "You are already logged in",
      });
    else {
      mechanic.findOne({ email: req.body.email }, function (err, mechanic) {
        if (!mechanic)
          return res.json({
            isAuth: false,
            message: " Auth failed ,email not found",
          });

        mechanic.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
            return res.json({
              isAuth: false,
              message: "password doesn't match",
            });

          mechanic.generateToken((err, mechanic) => {
            if (err) return res.status(400).send(err);
            res.cookie("auth", mechanic.token).json({
              isAuth: true,
              id: mechanic._id,
              email: mechanic.email,
            });
          });
        });
      });
    }
  });
});

//logout mechanic
router.get("/mechanic/logout", authMechanic, function (req, res) {
  req.mechanic.deleteToken(req.token, (err, mechanic) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
});

export default router;
