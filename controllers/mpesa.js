const axios = require('axios').default;
require('dotenv').config();

class MpesaController {
  async getOAuthToken(req, res, next) {
    const { consumer_key } = process.env;
    const { consumer_secret } = process.env;

    const url = process.env.oauth_token_url;

    // form a buffer of the consumer key and secret
    const buffer = new Buffer.from(`${consumer_key}:${consumer_secret}`);

    const auth = `Basic ${buffer.toString('base64')}`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });

      req.token = data.access_token;

      return next();
    } catch (err) {
      return res.send({
        success: false,
        message: err.response.statusText,
      });
    }
  }

  async lipaNaMpesaOnline(req, res) {
    const { token } = req;
    const auth = `Bearer ${token}`;

    // getting the timestamp
    const { timestamp } = require('../timestamp/timestamp');

    const url = process.env.lipa_na_mpesa_url;
    const bs_short_code = process.env.lipa_na_mpesa_shortcode;
    const passkey = process.env.lipa_na_mpesa_passkey;

    const password = new Buffer.from(
      `${bs_short_code}${passkey}${timestamp}`,
    ).toString('base64');
    const transcation_type = 'CustomerPayBillOnline';
    const amount = '1'; // you can enter any amount
    const partyA = ''; // should follow the format:2547xxxxxxxx
    const partyB = process.env.lipa_na_mpesa_shortcode;
    const phoneNumber = process.env.phone; // "254725209942"; //should follow the format:2547xxxxxxxx
    const callBackUrl = '';
    const accountReference = 'PAYLEND LTD';
    const transaction_desc = 'Loan Repayment';

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
      require('../axios');
      return res.send({
        success: true,
        message: data,
      });
    } catch (err) {
      return res.send({
        success: false,
        message: err.response.statusText,
      });
    }
  }

  lipaNaMpesaOnlineCallback(req, res) {
    // Get the transaction description
    const message = req.body.Body.stkCallback.ResultDesc;
    return res.send({
      success: true,
      message,
    });
  }
}

module.exports = new MpesaController();
