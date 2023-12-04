import stripe from '../../services/stripe';

const RetrieveSubscription = ({ subscriptionId }) => stripe.subscriptions.retrieve(subscriptionId);

export default RetrieveSubscription;
