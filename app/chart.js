import * as d3 from 'd3';

import planets from './planets';
import symbols from './symbols';


export default function draw(el, data) {
  const svg = d3.select(el);

  const c = { x: 200, y: 200, r: 200 };
  const symbolRadius = 180;
  const planetRadius = 120;
  const sw = 60;
  const sh = 30;
  const pw = 30;
  const ph = 30;

  function fDeg({ deg, min, sec }) {
    return Math.sign(deg) * (Math.abs(deg) + (min / 60) + (sec / 3600));
  }

  function rad(deg) {
    return ((deg - 90) * Math.PI) / 180;
  }

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
    });
  }

  svg.append('circle')
    .style('fill', '#ccc')
    .attr('cx', c.x)
    .attr('cy', c.y)
    .attr('r', c.r);

  Promise
    .all(Object.keys(symbols).map(sym => preloadImage(symbols[sym])))
    .then(srcs => svg.selectAll('image.symbol')
      .data(srcs)
      .enter()
      .append('image')
      .attr('xlink:href', src => src)
      .attr('width', sw)
      .attr('height', sh)
      .attr('x', (src, i) => ((c.x - (sw / 2)) + (symbolRadius * Math.cos(rad(i * 30)))))
      .attr('y', (src, i) => ((c.y - (sh / 2)) + (symbolRadius * Math.sin(rad(i * 30))))));

  const planetNames = Object.keys(planets).filter(p => data[p]);

  Promise
    .all(planetNames.map(p => preloadImage(planets[p])))
    .then(srcs => svg.selectAll('image.planet')
      .data(srcs)
      .enter()
      .append('image')
      .attr('xlink:href', src => src)
      .attr('width', pw)
      .attr('height', ph)
      .attr('x', (src, i) => ((c.x - (pw / 2)) + (planetRadius * Math.cos(rad(fDeg(data[planetNames[i]].long))))))
      .attr('y', (src, i) => ((c.y - (ph / 2)) + (planetRadius * Math.sin(rad(fDeg(data[planetNames[i]].long)))))));

  // svg.selectAll('text')
  //   .data('♈♉♊♋♌♍♎♏♐♑♒♓'.split(''))
  //   .enter()
  //   .append('text')
  //   .text(d => d)
  //   .attr('text-anchor', 'middle')
  //   .attr('alignment-baseline', 'middle')
  //   .attr('x', (d, i) => (c.x + r * Math.cos(rad(i * 30))))
  //   .attr('y', (d, i) => (c.y + r * Math.sin(rad(i * 30))));
}
