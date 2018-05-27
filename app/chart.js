import * as d3 from 'd3';

import symbols from './symbols';


const zodiac = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const houseClasses = ['red', 'green', 'yellow', 'blue'];

function rad(deg) {
  return -((deg - 180) * Math.PI) / 180;
}

function hasAspect(diff, angle, maxOrb) {
  return Math.abs(diff - angle) <= maxOrb;
}

export default function draw(el, data) {
  const svg = d3.select(el);

  const c = { x: 200, y: 200, r: 200, m: 10 };
  const h = { w: 25, h: 25, m: 40 };
  const p = { w: 20, h: 20, m: 40 };

  // Circle radii
  const hcr = c.r - c.m;
  const pcr = hcr - h.m;
  const acr = pcr - p.m;

  // Symbol radii
  const hsr = (hcr + pcr) / 2;
  const psr = (acr + pcr) / 2;

  // function preloadImage(src) {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = src;
  //     img.onload = () => resolve(src);
  //   });
  // }

  const defs = svg.append('defs');

  const disc = defs.append('linearGradient')
    .attr('id', 'disc')
    .attr('gradientTransform', 'rotate(60)');
  disc.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#8462c8');
  disc.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#40a669');

  const discOutline = defs.append('linearGradient')
    .attr('id', 'discOutline')
    .attr('gradientTransform', 'rotate(60)');
  discOutline.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#fb83dc');
  discOutline.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#79f97c');

  const circles = svg.append('g');

  circles.append('circle')
    .attr('fill', 'url(#disc)')
    .attr('stroke', 'url(#discOutline)')
    .attr('cx', c.x)
    .attr('cy', c.y)
    .attr('r', c.r - 0.5);

  circles.append('circle')
    .attr('fill', 'black')
    .attr('fill-opacity', 0.5)
    .attr('cx', c.x)
    .attr('cy', c.y)
    .attr('r', c.r - c.m);

  circles.append('circle')
    .attr('fill', 'black')
    .attr('fill-opacity', 0.5)
    .attr('cx', c.x)
    .attr('cy', c.y)
    .attr('r', c.r - c.m - h.m);

  circles.append('circle')
    .attr('fill', 'black')
    .attr('cx', c.x)
    .attr('cy', c.y)
    .attr('r', c.r - c.m - h.m - p.m);

  const lines = svg.append('g');

  for (let i = 0; i < 360; i += 5) {
    const rads = rad(i);
    const len = (i % 30) ? 3 : (hcr - pcr) - 1;
    lines.append('line')
      .attr('stroke', 'white')
      .attr('stroke-opacity', 0.5)
      .attr('x1', c.x + ((pcr + 0.5) * Math.cos(rads)))
      .attr('y1', c.y + ((pcr + 0.5) * Math.sin(rads)))
      .attr('x2', c.x + ((pcr + len) * Math.cos(rads)))
      .attr('y2', c.y + ((pcr + len) * Math.sin(rads)));
  }

  const houses = zodiac.map((hs, i) => ({
    name: hs,
    src: symbols[hs],
    rad: rad((i * 30) + 15),
  }));

  svg.selectAll('image.house')
    .data(houses)
    .enter()
    .append('use')
    .attr('xlink:href', house => `${house.src}#${house.name}`)
    .attr('class', (house, i) => `house ${houseClasses[i % 4]}`)
    .attr('width', h.w)
    .attr('height', h.h)
    .attr('x', house => ((c.x - (h.w / 2)) + (hsr * Math.cos(house.rad))))
    .attr('y', house => ((c.y - (h.h / 2)) + (hsr * Math.sin(house.rad))));

  const planets = {};
  Object.keys(data).filter(pl => symbols[pl]).forEach((pl) => {
    planets[pl] = Object.assign({}, data[pl], {
      name: pl,
      src: symbols[pl],
      rad: rad(data[pl].long.dec),
      house: Math.floor(data[pl].long.deg / 30),
    });
  });

  svg.selectAll('image.planet')
    .data(Object.keys(planets).map(pl => planets[pl]))
    .enter()
    .append('use')
    .attr('xlink:href', planet => `${planet.src}#${planet.name}`)
    .attr('class', planet => `planet ${planet.speed.dec < 0 ? 'retro' : ''}`)
    .attr('width', p.w)
    .attr('height', p.h)
    .attr('fill', 'blue')
    .attr('x', planet => ((c.x - (p.w / 2)) + (psr * Math.cos(planet.rad))))
    .attr('y', planet => ((c.y - (p.h / 2)) + (psr * Math.sin(planet.rad))));

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
    .attr('class', 'aspect trine')
    .attr('x1', ([pl1]) => c.x + (acr * Math.cos(planets[pl1].rad)))
    .attr('y1', ([pl1]) => c.y + (acr * Math.sin(planets[pl1].rad)))
    .attr('x2', ([, pl2]) => c.x + (acr * Math.cos(planets[pl2].rad)))
    .attr('y2', ([, pl2]) => c.y + (acr * Math.sin(planets[pl2].rad)));

  svg.selectAll('line.square')
    .data(aspects.square)
    .enter()
    .append('line')
    .attr('class', 'aspect square')
    .attr('x1', ([pl1]) => c.x + (acr * Math.cos(planets[pl1].rad)))
    .attr('y1', ([pl1]) => c.y + (acr * Math.sin(planets[pl1].rad)))
    .attr('x2', ([, pl2]) => c.x + (acr * Math.cos(planets[pl2].rad)))
    .attr('y2', ([, pl2]) => c.y + (acr * Math.sin(planets[pl2].rad)));

  svg.selectAll('line.sextile')
    .data(aspects.sextile)
    .enter()
    .append('line')
    .attr('class', 'aspect sextile')
    .attr('x1', ([pl1]) => c.x + (acr * Math.cos(planets[pl1].rad)))
    .attr('y1', ([pl1]) => c.y + (acr * Math.sin(planets[pl1].rad)))
    .attr('x2', ([, pl2]) => c.x + (acr * Math.cos(planets[pl2].rad)))
    .attr('y2', ([, pl2]) => c.y + (acr * Math.sin(planets[pl2].rad)));

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
