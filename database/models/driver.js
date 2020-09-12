import mongoose from "mongoose";
import bcrypt from "bcrypt";
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

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
