/* eslint-disable no-trailing-spaces */
/* eslint-disable brace-style */
/* eslint-disable no-empty */
/* eslint-disable camelcase */

const HandleStripeWebhook = async ({ data, type }) => {
  if (type === 'payment_method.attached') {}
  else if (type === 'invoice.payment_succeeded') {} 
  else if (type === 'invoice.payment_failed') {} 
  else if (type === 'customer.subscription.deleted') {}

  return {
    message: 'Success'
  };
};

export default HandleStripeWebhook;
