const express = require('express');

const app = express();
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
const mongoose = require('mongoose');
require('dotenv').config();
// import files
// const  mechanicProfile = require('./routes/mechanic/profile/profile');

// mpesa
const mpesa = require('./routes/Kenya/mpesa/mpesa');

app.use(cors({ origin: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
// dbName
const dbName = '';

// mongodb url
const mongoUrl = `mongodb://localhost:27017/${dbName}`;
// mongodb connection
mongoose
  .connect(mongoUrl, { useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB: %s \n ', mongoUrl);
  })
  .catch((err) => {
    console.log('MongoDB connection error: %s \n', err);
  });

// cors origin

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  );

  // eslint-disable-next-line eqeqeq
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

// use it in a route
app.use('/api/v1/payments', mpesa);

// Incase of wrong url
app.use((req, res, next) => {
  const error = new Error('Invalid Url Address. Please Contact Support');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
