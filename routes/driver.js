const router = require("express").Router();
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
  // [
  //   auth,
  //   [
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

export default router;
