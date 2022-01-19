const express = require('express');

const router = express.Router();
require('dotenv').config();
const axios = require('axios').default;
require('dotenv').config();
// controllers
const fs = require('fs');
const path = require('path');
//const mpesa = path.join(__dirname, '/controllers/mpesa');
//console.log(__dirname);
const mpesa = require('../../../controllers/mpesa');

// route to get the auth token
router.get('/get-auth-token', mpesa.getOAuthToken);

// lipa na mpesa online
router.post('/mpesa', mpesa.getOAuthToken, async (req, res, next) => {
  const data = req.body;
  console.log(data);
  const { token } = req;
  const auth = `Bearer ${token}`;

  // getting the timestamp
  const { timestamp } = require('../../../timestamp/timestamp');

  const url = process.env.lipa_na_mpesa_url;
  const bs_short_code = process.env.lipa_na_mpesa_shortcode;
  const passkey = process.env.lipa_na_mpesa_passkey;

  const password = new Buffer.from(
    `${bs_short_code}${passkey}${timestamp}`,
  ).toString('base64');
  const transcation_type = 'CustomerPayBillOnline';
  const amount = '1'; // you can enter any amount
  const partyA = '254701376319'; // should follow the format:2547xxxxxxxx
  const partyB = process.env.lipa_na_mpesa_shortcode;
  const phoneNumber = data.phone; // "254725209942"; //should follow the format:2547xxxxxxxx
  const callBackUrl = 'https://quick-garage-api.herokuapp.com/mpesa/lipa-na-mpesa-callback';
  const accountReference = 'INEX TENDER DOTE';
  const transaction_desc = 'Payment for successful match with the closest mechanic.';

  try {
    const { data } = await axios
      .post(
        url,
        {
          BusinessShortCode: bs_short_code,
          Password: password,
          Timestamp: timestamp,
          TransactionType: transcation_type,
          Amount: amount,
          PartyA: partyA,
          PartyB: partyB,
          PhoneNumber: phoneNumber,
          CallBackURL: callBackUrl,
          AccountReference: accountReference,
          TransactionDesc: transaction_desc,
        },
        {
          headers: {
            Authorization: auth,
          },
        },
      )
      .catch(console.log);
    const { data2 } = axios
      .post(
        'https://quick-garage-api.herokuapp.com/mechanicMpesa/mpesa-transactions',
        {
          BusinessShortCode: bs_short_code,
          Password: password,
          Timestamp: timestamp,
          TransactionType: transcation_type,
          Amount: amount,
          PartyA: partyA,
          PartyB: partyB,
          PhoneNumber: phoneNumber,
          CallBackURL: callBackUrl,
          AccountReference: accountReference,
          TransactionDesc: transaction_desc,
        },
      )
      .catch(console.log);
    return res.send({
      success: true,
      message: data,
    });
  } catch (err) {
    return res.send({
      success: false,
      message:err['response']['statusText'],
    });
  }
});

// callback url
router.post('/lipa-na-mpesa-callback', mpesa.lipaNaMpesaOnlineCallback);

module.exports = router;
