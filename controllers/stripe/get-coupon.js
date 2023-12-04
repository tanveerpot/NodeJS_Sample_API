import stripe from '../../services/stripe';

const GetCoupon = coupon => stripe.coupons.retrieve(coupon);

export default GetCoupon;
