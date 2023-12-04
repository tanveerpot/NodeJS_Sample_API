import stripe from '../../services/stripe';

const CreateSubscription = ({
  priceId,
  customerId,
  coupon
}) => {
  const setObj = {
    customer: customerId,
    items: [{
      price: priceId
    }],
    // trial_period_days: 7,
    trial_from_plan: true,
    coupon
  };

  // if (trialExpiredAt) {
  //   extend(setObj, { trial_end: 'now' });
  // }

  return stripe.subscriptions.create(setObj);
};

export default CreateSubscription;
