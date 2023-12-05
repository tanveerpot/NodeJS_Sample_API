import stripe from "../../services/stripe";

const CancelSubscription = ({ subscriptionId }) => {
  stripe.subscriptions.del(subscriptionId);
};

export default CancelSubscription;
