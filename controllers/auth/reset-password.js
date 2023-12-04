import User from '../../models/user';

export const ResetPassword = async ({ email, password }) => {
  const user = await User.findOne({ email });

  user.password = password;

  await user.save();
  return {
    message: 'Password updated succesfully'
  };
};

export default ResetPassword;
