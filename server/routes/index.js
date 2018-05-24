'use strict';

const express = require('express');
const request = require('request-promise-native');

const app = require('./app');


const router = module.exports = express.Router();

router.get('/planets', (req, res, next) => {
  request.get(
    {
      url: 'http://www.astro.com/cgi/swetest.cgi',
      qs: {
        b: '1.1.2002',
        n: 1,
        s: 1,
        p: 'p',
        e: '-eswe',
        f: 'PLBRS',
        arg: '',
      },
    })
    .then(data => res.send(data))
    .catch(next);
});

router.use(app);
