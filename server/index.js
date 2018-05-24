'use strict';

const express = require('express');
const morgan = require('morgan');

const routes = require('./routes');


const app = express();
app.use(morgan('dev'));

app.use(routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3999;
app.listen(port, () => console.log(`Listening on port ${port}.`));
