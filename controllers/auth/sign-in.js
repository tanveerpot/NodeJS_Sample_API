import { GenerateTokenResponse } from '../../middlewares/auth';

const SignIn = async ({
  userId,
  email
}) => {
  const response = GenerateTokenResponse({
    userId,
    email
  });
  return ({
    token: response.token,
    user: { userId, email }
  });
};

export default SignIn;
