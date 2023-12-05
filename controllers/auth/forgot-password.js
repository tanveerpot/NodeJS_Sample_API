import { GenerateTokenResponse } from "../../middlewares/auth";

const ForgotPassword = async ({ user, email }) => {
  const { _id: userId } = user;

  const token = GenerateTokenResponse({ userId, email });

  return { message: "Token Sent", token };
};

export default ForgotPassword;
