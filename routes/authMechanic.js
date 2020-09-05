const Mechanic = require("../database/models/mechanic");

let auth = (req, res, next) => {
  let token = req.cookies.auth;
  Mechanic.findByToken(token, (err, mechanic) => {
    if (err) throw err;
    if (!mechanic)
      return res.json({
        error: true,
      });

    req.token = token;
    req.mechanic = mechanic;
    next();
  });
};

module.exports = { auth };
