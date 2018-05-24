import * as d3 from 'd3';

import symbols from './symbols';


export default function draw(el) {
  const svg = d3.select(el);

  const c = { x: 200, y: 200, r: 200 };
  const r = 180;

  function rad(deg) {
    return (deg * Math.PI) / 180;
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
    .then(srcs => svg.selectAll('image')
      .data(srcs)
      .enter()
      .append('image')
      .attr('xlink:href', src => src)
      .attr('width', 60)
      .attr('height', 30)
      .attr('x', (src, i) => ((c.x - 30) + (r * Math.cos(rad(i * 30)))))
      .attr('y', (src, i) => ((c.y - 15) + (r * Math.sin(rad(i * 30))))));

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
