import mongoose from "mongoose";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
const confiq = require("../config/config").get(process.env.NODE_ENV);
const salt = 10;
const Schema = mongoose.Schema;

const driverSchema = Schema({
  _id: Schema.Types.ObjectId,
  firstName: {
    type: String,
  },
  lastName: {
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

driverSchema.methods = {
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
};

driverSchema.pre("save", function (next) {
  var driver = this;

  if (driver.isModified("password")) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(driver.password, salt, function (err, hash) {
        if (err) return next(err);
        driver.password = hash;
        driver.password2 = hash;
        next();
      });
    });
  } else {
    next();
  }
});

driverSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(next);
    cb(null, isMatch);
  });
};

driverSchema.methods.generateToken = function (cb) {
  var driver = this;
  var token = jwt.sign(driver._id.toHexString(), confiq.SECRET);

  driver.token = token;
  driver.save(function (err, driver) {
    if (err) return cb(err);
    cb(null, driver);
  });
};

driverSchema.statics.findByToken = function (token, cb) {
  var driver = this;

  jwt.verify(token, confiq.SECRET, function (err, decode) {
    driver.findOne({ _id: decode, token: token }, function (err, driver) {
      if (err) return cb(err);
      cb(null, driver);
    });
  });
};

driverSchema.methods.deleteToken = function (token, cb) {
  var driver = this;

  driver.update({ $unset: { token: 1 } }, function (err, driver) {
    if (err) return cb(err);
    cb(null, driver);
  });
};

const Driver = mongoose.model("Driver", driverSchema);

export { driverSchema };
export default Driver;
