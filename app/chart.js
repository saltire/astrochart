import * as d3 from 'd3';

import symbols from './symbols';


export default function draw(el, data) {
  const svg = d3.select(el);

  const c = { x: 200, y: 200, r: 200 };
  const h = { w: 25, h: 25, r: 180 };
  const p = { w: 20, h: 20, r: 140 };

  function rad(deg) {
    return -((deg - 165) * Math.PI) / 180;
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

  const houses = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  Promise
    .all(houses.map(hs => preloadImage(symbols[hs])))
    .then(srcs => svg.selectAll('image.house')
      .data(srcs)
      .enter()
      .append('image')
      .attr('xlink:href', src => src)
      .attr('width', h.w)
      .attr('height', h.h)
      .attr('x', (src, i) => ((c.x - (h.w / 2)) + (h.r * Math.cos(rad(i * 30)))))
      .attr('y', (src, i) => ((c.y - (h.h / 2)) + (h.r * Math.sin(rad(i * 30))))));

  const planetNames = Object.keys(data).filter(pl => symbols[pl]);

  Promise
    .all(planetNames.map(pl => preloadImage(symbols[pl])))
    .then(srcs => svg.selectAll('image.planet')
      .data(srcs)
      .enter()
      .append('image')
      .attr('xlink:href', src => src)
      .attr('width', p.w)
      .attr('height', p.h)
      .attr('x', (src, i) => ((c.x - (p.w / 2)) + (p.r * Math.cos(rad(data[planetNames[i]].long)))))
      .attr('y', (src, i) => ((c.y - (p.h / 2)) + (p.r * Math.sin(rad(data[planetNames[i]].long))))));

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
