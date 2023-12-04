import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = new Schema(
  {
    _id: { type: String },
    name: { type: String },
    email: { type: String },
    facebookId: { type: String },
    password: { type: String },
    status: { type: String }
  }, {
    timestamps: true
  }
);

schema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  user.password = bcrypt.hashSync(this.password, 12);
  return next();
});

schema.methods.validatePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};
const User = mongoose.model('user', schema);

export default User;
