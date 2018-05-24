'use strict';

const cheerio = require('cheerio');
const express = require('express');
const request = require('request-promise-native');

const app = require('./app');


const router = module.exports = express.Router();

const degrees = "(-?\\d+°\\s?\\d+'\\s?[\\d.]+)";
const lineRegex = new RegExp(['^(\\w+)', degrees, degrees, degrees, '([\\d.]+)'].join('\\s+'));

const degRegex = /^(-?\d+)°\s?(\d+)'\s?([\d.]+)$/;

function parseDegrees(str) {
  const m = str.match(degRegex);
  if (m) {
    return {
      deg: parseInt(m[1]),
      min: parseInt(m[2]),
      sec: parseFloat(m[3]),
    };
  }
  return null;
}

router.get('/planets', (req, res, next) => {
  // P - planet name
  // B - latitude in degrees
  // L - longitude in degrees ddd mm'ss"
  // S - speed in longitude in degrees ddd:mm:ss per day
  // R - distance decimal in AU

  request.get(
    {
      url: 'http://www.astro.com/cgi/swetest.cgi',
      qs: {
        b: '24.5.2018', // begin date d.m.yyyy
        n: 1, // number of consecutive days
        s: 1, // timestep in days
        p: 'p', // planets/asteroids 0123456789mtABCcg DEFGHI
        e: '-eswe', // swiss ephemeris
        f: 'PBLSR', // format sequences
        arg: '', // command line flags
      },
    })
    .then((html) => {
      const $ = cheerio.load(html);
      const result = $('pre font').text();

      console.log(result);

      const data = {};
      result.split('\n').forEach((line) => {
        const m = line.match(lineRegex);
        if (m) {
          data[m[1]] = {
            lat: parseDegrees(m[2]),
            long: parseDegrees(m[3]),
            speed: parseDegrees(m[4]),
            dist: parseFloat(m[5]),
          };
        }
      });

      res.json(data);
    })
    .catch(next);
});

router.use(app);
