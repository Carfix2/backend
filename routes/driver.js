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
