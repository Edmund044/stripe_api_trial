const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const charge = stripe.charges.update(
  'ch_3KJYdw2eZvKYlo2C1LBDf6Gq',
  {metadata: {order_id: '6735'}}
)
.then((res)=>
{
console.log(res);
})
.catch((err)=>
{
  console.log(err);    
}    
);