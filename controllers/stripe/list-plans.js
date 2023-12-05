import stripe from "../../services/stripe";

const product = process.env.PRODUCT_ID;
const ListPlans = () => stripe.plans.list({ product });

export default ListPlans;
