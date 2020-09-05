import mongoose from "mongoose";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
const confiq = require("../config/config").get(process.env.NODE_ENV);
const salt = 10;
const Schema = mongoose.Schema;

const mechanicSchema = Schema({
  _id: Schema.Types.ObjectId,
  workshopName: {
    type: String,
  },
  workshopAddress: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  whatsAppNumber: {
    type: String,
  },
  telegramId: {
    type: String,
  },
});

mechanicSchema.methods = {
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
};

mechanicSchema.pre("save", function (next) {
  var mechanic = this;

  if (mechanic.isModified("password")) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(mechanic.password, salt, function (err, hash) {
        if (err) return next(err);
        mechanic.password = hash;
        mechanic.password2 = hash;
        next();
      });
    });
  } else {
    next();
  }
});

mechanicSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(next);
    cb(null, isMatch);
  });
};

mechanicSchema.methods.generateToken = function (cb) {
  var mechanic = this;
  var token = jwt.sign(mechanic._id.toHexString(), confiq.SECRET);

  mechanic.token = token;
  mechanic.save(function (err, mechanic) {
    if (err) return cb(err);
    cb(null, mechanic);
  });
};

mechanicSchema.statics.findByToken = function (token, cb) {
  var mechanic = this;

  jwt.verify(token, confiq.SECRET, function (err, decode) {
    mechanic.findOne({ _id: decode, token: token }, function (err, mechanic) {
      if (err) return cb(err);
      cb(null, mechanic);
    });
  });
};

mechanicSchema.methods.deleteToken = function (token, cb) {
  var mechanic = this;

  mechanic.update({ $unset: { token: 1 } }, function (err, mechanic) {
    if (err) return cb(err);
    cb(null, mechanic);
  });
};

const Mechanic = mongoose.model("Mechanic", mechanicSchema);

export { mechanicSchema };
export default Mechanic;
