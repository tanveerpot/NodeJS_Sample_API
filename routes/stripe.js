// Route
import express from "express";

import User from "../models/user";

import {
  CreateCustomer,
  CreateSubscription,
  CancelSubscription,
  HandleStripeWebhook,
  UpdateCustomer,
} from "../controllers/stripe";

import catchResponse from "../utils/catch-response";

import { authenticateAuthToken } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhook = req.body;
      const { type, data } = webhook;
      console.log("\n\n", "webhook", {
        type,
        data,
      });
      const { message } = await HandleStripeWebhook({
        data,
        type,
      });

      return res.send(message);
    } catch (err) {
      await catchResponse({
        res,
        err,
      });
    }
  }
);

// Create Stripe Subscription Controller
const CreateStripeSubscription = async ({
  userId,
  token,
  userData,
  selectedPlan,
  planId,
  coupon,
}) => {
  try {
    const user = await User.findOne({ _id: userId });
    const { cardName, addressTitle, address } = userData;

    let stripeUserId = user?.payment?.stripeUserId;
    if (!stripeUserId) {
      const customer = await CreateCustomer({
        email: user.email,
        name: cardName,
        source: token.id,
        metaData: {
          app: "Tweast",
        },
      });

      stripeUserId = customer.id;

      await User.updateOne(
        { _id: userId },
        {
          $set: {
            "payment.stripeUserId": stripeUserId,
          },
        }
      );
    } else {
      await UpdateCustomer(stripeUserId, { token, coupon });
    }

    const subscriptionResponse = await CreateSubscription({
      priceId: planId,
      customerId: stripeUserId,
      coupon,
    });

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          "payment.subscriptionId": subscriptionResponse.id,
          "payment.failedCount": 0,
          cardName,
          selectedPlan,
          addressTitle,
          address,
        },
      }
    );

    return subscriptionResponse;
  } catch (err) {
    return err;
  }
};

// Cancel Stripe Subscription Controller
const CancelStripeSubscription = async ({
  userId,
  feedbackMessage,
  feedbackPoint,
}) => {
  await User.findOneAndUpdate(
    { _id: userId },
    { $set: { feedbackMessage, feedbackPoint } }
  );
  const user = await User.findOne({
    _id: userId,
  });

  await CancelSubscription({
    subscriptionId: user.payment.subscriptionId,
  });
};

// Stripe Card update Controller
const UpdateCustomerCard = async ({ userId, token, coupon }) => {
  const user = await User.findOne({
    _id: userId,
  });

  const stripeUserId = user && user.payment && user.payment.stripeUserId;
  if (stripeUserId) {
    await UpdateCustomer(stripeUserId, { token, coupon });
  }
};

const verifyUserStatus = (userId) =>
  new Promise((res) => {
    let retry = 0;
    const userStatusInterval = setInterval(async () => {
      const userData = await User.findOne({ _id: userId });
      const { status } = userData || {};
      retry += 1;
      if (status === "Subscribed") res(clearInterval(userStatusInterval));
      else if (retry >= 10) res(clearInterval(userStatusInterval));
    }, 1000);
  });

router.post(
  "/create-user-subscription",
  authenticateAuthToken,
  async (req, res) => {
    try {
      const {
        user: { _id: userId },
        body: { token, coupon, planId, userData, selectedPlan },
      } = req;

      const subscriptionData = await CreateStripeSubscription({
        userId,
        token,
        coupon,
        selectedPlan,
        planId,
        userData,
      });

      await verifyUserStatus(userId);
      const user = await User.findOne({ _id: userId });
      const { status } = user;
      if (subscriptionData?.id && status === "Subscribed") {
        res.status(200).json({ status: true, user, subscriptionData });
      } else
        res
          .status(400)
          .json({ error: "Subscription Not Created, Please Try Again" });
    } catch (err) {
      await catchResponse({
        res,
        err,
      });
    }
  }
);

router.post("/cancel-subscription", authenticateAuthToken, async (req, res) => {
  try {
    const {
      user: { _id: userId },
      body: { feedbackMessage, feedbackPoint },
    } = req;

    await CancelStripeSubscription({
      userId,
      feedbackMessage,
      feedbackPoint,
    });

    const user = await User.findOne({ _id: userId });
    return res.json({ status: true, user });
  } catch (err) {
    await catchResponse({
      res,
      err,
    });
  }
});

router.post(
  "/update-customer-card",
  authenticateAuthToken,
  async (req, res) => {
    try {
      const {
        user: { _id: userId },
        body: { token, coupon },
      } = req;

      UpdateCustomerCard({
        userId,
        token,
        coupon,
      });
      return res.json({ status: true });
    } catch (err) {
      await catchResponse({
        res,
        err,
      });
    }
  }
);

export default router;
