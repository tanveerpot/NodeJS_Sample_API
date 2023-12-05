import mongoose from "mongoose";

import User from "../../models/user";
import { GenerateTokenResponse } from "../../middlewares/auth";

const SignUp = async ({ name, email, password }) => {
  const user = new User({
    _id: mongoose.Types.ObjectId().toHexString(),
    name,
    email,
    password,
  });
  const result = await user.save();
  const { token } = GenerateTokenResponse({ ...result }) || {};
  return {
    token,
    user: result,
  };
};

export default SignUp;
