import stripe from '../../services/stripe';

const UpdateSubscription = ({
  subscriptionId,
  itemId,
  planId
}) => stripe.subscriptions.update(subscriptionId, {
  items: [{
    id: itemId,
    plan: planId
  }],
  prorate: true,
  trial_end: 'now'
});

export default UpdateSubscription;
