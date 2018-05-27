'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');


// The source SVG files were exported by Adobe Illustrator as Assets using Export for Screens.
// This moves the id to the containing svg element, preserves its viewBox attribute,
// and strips out unnecessary title and group elements.

const dir = './app/static/symbols';
util.promisify(fs.readdir)(dir).then((files) => {
  files.forEach((file) => {
    util.promisify(fs.readFile)(`${dir}/${file}`, { encoding: 'utf-8' }).then((data) => {
      const $ = cheerio.load(data);
      $('title').remove();
      $('svg > g').replaceWith($('path'));
      const id = $('path').attr('id');
      if (id) {
        $('svg').attr('id', $('path').attr('id'));
        $('path').removeAttr('id');
      }

      util.promisify(fs.writeFile)(`${dir}/${file}`, $.html('svg'));
    });
  });
});

