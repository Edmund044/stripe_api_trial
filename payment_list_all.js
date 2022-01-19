const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const charges =  stripe.charges.list({
  limit: 3,
})
.then((res)=>
{
console.log(res);
})
.catch((err)=>
{
  console.log(err);    
}
 ) ;