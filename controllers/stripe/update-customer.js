import { extend } from 'lodash';
import stripe from '../../services/stripe';

const UpdateCustomer = (customerId, { token, coupon }) => {
  const customerOptions = {};

  if (token) extend(customerOptions, { source: token.id });
  if (coupon) extend(customerOptions, { coupon });

  return stripe.customers.update(customerId, {
    ...customerOptions
  });
};


export default UpdateCustomer;
