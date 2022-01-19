const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

// `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
const charge =  stripe.charges.create({ 
  amount: 2000,
  currency: 'usd',
  source: 'tok_mastercard',
  description: 'My First Test Charge (created for API docs)'
  
})
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
   console.log(err);
});