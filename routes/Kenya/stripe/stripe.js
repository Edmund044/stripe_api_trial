const express = require('express');
const app = express.Router();
require('dotenv').config();
const axios = require('axios').default;
require('dotenv').config();
/* eslint-disable no-console */
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
app.post("/stripeCreate",(req,res)=>{
// `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
// eslint-disable-next-line no-unused-vars
const charge = stripe.charges
  .create({
    amount: req.body.amount,
    currency: req.body.currency,
    source: req.body.source,
    description: req.body.description,
  })
  .then((response) => {
    console.log(response);
    res.json(response);
  })
  .catch((err) => {
    console.log(err);
  });



});
app.get("/stripeRetrieve",(req,res)=>{
    const charge = stripe.charges
    .retrieve(req.body.key)
    .then((response) => {
      console.log(res);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
  

});
app.get("/stripeList",(req,res)=>{
    const charges = stripe.charges
    .list({
      limit: req.body.limit,
    })
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
  
});
app.put("/stripeUpdate",(req,res)=>{
    console.log(req.body.metadata);
    const charge = stripe.charges    
    .update(req.body.key, {metadata: { order_id: '6735' }})
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
  

});
app.post("/stripeCapture",(req,res)=>{
   
const charge = stripe.charges
.capture(req.body.key)
.then((response) => {
  console.log(response);
  res.json(response);
})
.catch((err) => {
  console.log(err);
});
});

module.exports = app;