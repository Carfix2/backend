const router = require("express").Router();
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

export default router;
