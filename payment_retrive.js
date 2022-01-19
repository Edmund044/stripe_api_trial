const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const charge = stripe.charges
  .retrieve("ch_3KJYdw2eZvKYlo2C1LBDf6Gq")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
