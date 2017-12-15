const svg = d3.select('svg');

const c = { x: 200, y: 200, r: 200 };
const r = 180;

function rad(deg) {
  return deg * Math.PI / 180;
}

svg.append('circle')
  .style('fill', '#ccc')
  .attr('cx', c.x)
  .attr('cy', c.y)
  .attr('r', c.r);

svg.selectAll('text')
  .data('♈♉♊♋♌♍♎♏♐♑♒♓'.split(''))
  .enter()
  .append('text')
  .text(d => d)
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .attr('x', (d, i) => (c.x + r * Math.cos(rad(i * 30))))
  .attr('y', (d, i) => (c.y + r * Math.sin(rad(i * 30))));
