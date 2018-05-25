import * as d3 from 'd3';

import symbols from './symbols';


const zodiac = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

function rad(deg) {
  return -((deg - 180) * Math.PI) / 180;
}

function hasAspect(diff, angle, maxOrb) {
  return Math.abs(diff - angle) <= maxOrb;
}

export default function draw(el, data) {
  const svg = d3.select(el);

  const c = { x: 200, y: 200, r: 200 };
  const h = { w: 25, h: 25, r: 180 };
  const p = { w: 20, h: 20, r: 140 };
  const ar = 120;

  // function preloadImage(src) {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = src;
  //     img.onload = () => resolve(src);
  //   });
  // }

  svg.append('circle')
    .style('fill', '#ccc')
    .attr('cx', c.x)
    .attr('cy', c.y)
    .attr('r', c.r);

  const houses = zodiac.map((hs, i) => ({
    src: symbols[hs],
    rad: rad((i * 30) + 15),
  }));

  svg.selectAll('image.house')
    .data(houses)
    .enter()
    .append('image')
    .attr('xlink:href', house => house.src)
    .attr('width', h.w)
    .attr('height', h.h)
    .attr('x', house => ((c.x - (h.w / 2)) + (h.r * Math.cos(house.rad))))
    .attr('y', house => ((c.y - (h.h / 2)) + (h.r * Math.sin(house.rad))));

  const planets = {};
  Object.keys(data).filter(pl => symbols[pl]).forEach((pl) => {
    planets[pl] = Object.assign({}, data[pl], {
      src: symbols[pl],
      rad: rad(data[pl].long.dec),
      house: Math.floor(data[pl].long.deg / 30),
    });
  });

  svg.selectAll('image.planet')
    .data(Object.keys(planets).map(pl => planets[pl]))
    .enter()
    .append('image')
    .attr('xlink:href', planet => planet.src)
    .attr('width', p.w)
    .attr('height', p.h)
    .attr('x', planet => ((c.x - (p.w / 2)) + (p.r * Math.cos(planet.rad))))
    .attr('y', planet => ((c.y - (p.h / 2)) + (p.r * Math.sin(planet.rad))));

  const aspects = {
    trine: [],
    square: [],
    sextile: [],
  };

  Object.keys(planets).forEach((pl, i) => {
    Object.keys(planets).slice(i + 1).forEach((pl2) => {
      let diff = Math.abs(planets[pl].long.dec - planets[pl2].long.dec);
      if (diff > 180) {
        diff = 360 - diff;
      }

      if (hasAspect(diff, 120, 10)) {
        aspects.trine.push([pl, pl2]);
      }
      if (hasAspect(diff, 90, 10) || hasAspect(diff, 180, 10)) {
        aspects.square.push([pl, pl2]);
      }
      if (hasAspect(diff, 60, 5)) {
        aspects.sextile.push([pl, pl2]);
      }
    });
  });

  svg.selectAll('line.trine')
    .data(aspects.trine)
    .enter()
    .append('line')
    .attr('stroke', 'blue')
    .attr('x1', ([pl1]) => c.x + (ar * Math.cos(planets[pl1].rad)))
    .attr('y1', ([pl1]) => c.y + (ar * Math.sin(planets[pl1].rad)))
    .attr('x2', ([, pl2]) => c.x + (ar * Math.cos(planets[pl2].rad)))
    .attr('y2', ([, pl2]) => c.y + (ar * Math.sin(planets[pl2].rad)));

  svg.selectAll('line.square')
    .data(aspects.square)
    .enter()
    .append('line')
    .attr('stroke', 'red')
    .attr('x1', ([pl1]) => c.x + (ar * Math.cos(planets[pl1].rad)))
    .attr('y1', ([pl1]) => c.y + (ar * Math.sin(planets[pl1].rad)))
    .attr('x2', ([, pl2]) => c.x + (ar * Math.cos(planets[pl2].rad)))
    .attr('y2', ([, pl2]) => c.y + (ar * Math.sin(planets[pl2].rad)));

  svg.selectAll('line.sextile')
    .data(aspects.sextile)
    .enter()
    .append('line')
    .attr('stroke', 'green')
    .attr('x1', ([pl1]) => c.x + (ar * Math.cos(planets[pl1].rad)))
    .attr('y1', ([pl1]) => c.y + (ar * Math.sin(planets[pl1].rad)))
    .attr('x2', ([, pl2]) => c.x + (ar * Math.cos(planets[pl2].rad)))
    .attr('y2', ([, pl2]) => c.y + (ar * Math.sin(planets[pl2].rad)));

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
