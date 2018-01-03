const svg = d3.select('svg');

const c = { x: 200, y: 200, r: 200 };
const r = 180;

function rad(deg) {
  return deg * Math.PI / 180;
}

const symbols = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

svg.append('circle')
  .style('fill', '#ccc')
  .attr('cx', c.x)
  .attr('cy', c.y)
  .attr('r', c.r);

Promise
  .all(symbols.map(sym => new Promise((resolve) => {
    const img = new Image();
    img.src = `./symbols/${sym}.svg`;
    img.onload = () => resolve(img.src);
  })))
  .then(srcs => svg.selectAll('image')
    .data(srcs)
    .enter()
    .append('image')
    .attr('xlink:href', src => src)
    .attr('height', 30)
    .attr('x', (src, i) => (c.x + r * Math.cos(rad(i * 30))))
    .attr('y', (src, i) => (c.y + r * Math.sin(rad(i * 30))))
    .style('transform', 'translate(-50%, -50%)'));

// svg.selectAll('text')
//   .data('♈♉♊♋♌♍♎♏♐♑♒♓'.split(''))
//   .enter()
//   .append('text')
//   .text(d => d)
//   .attr('text-anchor', 'middle')
//   .attr('alignment-baseline', 'middle')
//   .attr('x', (d, i) => (c.x + r * Math.cos(rad(i * 30))))
//   .attr('y', (d, i) => (c.y + r * Math.sin(rad(i * 30))));
