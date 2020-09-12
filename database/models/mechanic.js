import mongoose from "mongoose";
import bcrypt from "bcrypt";
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

const Mechanic = mongoose.model("Mechanic", mechanicSchema);

export default Mechanic;
