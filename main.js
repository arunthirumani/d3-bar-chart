let data = [
  { revenue: 18450, expense: 16500, label: 'Q1' },
  { revenue: 3430, expense: 3420, label: 'Q2' },
  { revenue: 3225, expense: 3100, label: 'Q3' },
  { revenue: 3500, expense: 3700, label: 'Q4' }
];

let svgHeight = 700, svgWidth = 1050,
  xAxisX1 = 10, xAxisY1 = 400, // (10, 400)
  xAxisX2 = 1000, xAxisY2 = 400, // (1000, 400)
  yAxisX1 = 10, yAxisY1 = 10,
  yAxisX2 = 10, yAxisY2 = 400,
  xAxisLabels = ['Q1', 'Q2', 'Q3', 'Q4'],
  barWidth = 50,
  firstBarMarigin = 50,
  firstBarXOrigin = barWidth + xAxisX1 + firstBarMarigin,
  firstBarYOrigin = xAxisY1 - 1,
  graphHeight = 400,
  graphLeftOffset = 10,
  graphWidth = 1000;

// svg which contains the bar chart
const svg = d3.select('#chart')
  .append('svg')
  .attr('id', 'chartSVG')
  .attr('height', svgHeight)
  .attr('width', svgWidth)
  .attr('class', 'chart');

// y axis
svg.append('line')
  .attr('id', 'yAxis')
  .attr('x1', yAxisX1)
  .attr('y1', yAxisY1)
  .attr('x2', yAxisX2)
  .attr('y2', yAxisY2)
  .attr('stroke', 'red')
  .attr('stroke-width', 1)

// x-axis
svg.append('line')
  .attr('id', 'xAxis')
  .attr('x1', xAxisX1)
  .attr('y1', xAxisY1)
  .attr('x2', xAxisX2)
  .attr('y2', xAxisY2)
  .attr('stroke', 'red')
  .attr('stroke-width', 2);


// spoke to represent a quarter
svg.selectAll('.spokes')
  .data(xAxisLabels)
  .enter()
  .append('line')
  .attr('x1', function (d, i) {
    return graphWidth - Math.floor(graphWidth / 4) * i;
  })
  .attr('y1', graphHeight)
  .attr('x2', function (d, i) {
    return graphWidth - Math.floor(graphWidth / 4) * i;
  })
  .attr('y2', graphHeight - 10)
  .attr('stroke', 'red')
  .attr('stroke-width', 2);

// quarter labels
svg.selectAll('.x-label')
  .data(xAxisLabels)
  .enter()
  .append('text')
  .attr('class', '.x-label')
  .attr('dx', function (d, i) {
    return Math.floor(graphWidth / 8) + Math.floor(graphWidth / 4) * i;
  })
  .attr('dy', graphHeight + 20)
  .text(function (d, i) {
    return d;
  });


// setting scale to map dollars to pixels available
const domainMax = data.reduce((prevValue, currentValue) => {
  const currentMin = Math.max(currentValue.expense, currentValue.revenue);
  return Math.max(currentMin, prevValue);
}, Number.MIN_SAFE_INTEGER);

const scale = d3.scaleLinear().domain([0, domainMax]).range([0, 300]);


// painting revenue bar for all quarters
const revenueBar = svg.selectAll('#revenue-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('id', 'revenue-bar')
  .attr('transform', (d, i) => `translate(${firstBarXOrigin + 250 * i}, ${firstBarYOrigin}) rotate(180)`)
  .attr('width', barWidth)
  .attr('height', (d, i) => Math.floor(scale(d.revenue)))
  .attr('stroke', 'yellow')
  .attr('fill', 'yellow');

// painting revenue labels
const revenueLabels = svg.selectAll('#revenue-info-label')
  .data(data)
  .enter()
  .append('text')
  .attr('id', '.revenue-info-label')
  .attr('dx', (d, i) => graphLeftOffset + 250 * i + firstBarMarigin)
  .attr('dy', (d, i) => graphHeight - (Math.floor(scale(d.revenue)) + 10))
  .text((d, i) => `$${d.revenue}`);

// painting expense bars
const expenseBar = svg.selectAll('#expense-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('id', 'expense-bar')
  .attr('transform', (d, i) => `translate(${firstBarXOrigin + barWidth + 250 * i}, ${firstBarYOrigin}) rotate(180)`)
  .attr('width', barWidth)
  .attr('height', (d, i) => Math.floor(scale(d.expense)))
  .attr('stroke', 'purple')
  .attr('fill', 'purple');

// painting expense labels
const expenseLabels = svg.selectAll('#expense-info-label')
  .data(data)
  .enter()
  .append('text')
  .attr('id', 'expense-info-label')
  .attr('dx', (d, i) => graphLeftOffset + barWidth + 250 * i + firstBarMarigin)
  .attr('dy', (d, i) => graphHeight - (Math.floor(scale(d.expense)) + 10))
  .text((d, i) => `$${d.expense}`);

// painting profit bar
  const profitBar = svg.selectAll('#profit-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('id', 'profit-bar')
  .attr('transform', (d, i) => {
    const barOffset = d.expense > d.revenue ? barWidth : barWidth * 2;
    let translation = `translate(${firstBarXOrigin + barOffset + (250 * i)}, ${firstBarYOrigin})`;
    return d.expense > d.revenue ? translation : `${translation} rotate(180)`;
  })
  .attr('width', barWidth)
  .attr('height', (d, i) => Math.floor(scale(Math.abs(d.expense - d.revenue))))
  .attr('stroke', (d, i) => d.expense > d.revenue ? 'red' : 'green')
  .attr('fill', (d, i) => d.expense > d.revenue ? 'red' : 'green');

 // painting profit label 
const profitLabels = svg.selectAll('#profit-info-label')
  .data(data)
  .enter()
  .append('text')
  .attr('transform', (d, i) => {
    return d.expense > d.revenue ? `translate(0, 10)` : `translate(0, 0)`;
  })
  .attr('id', 'profit-info-label')
  .attr('dx', (d, i) => graphLeftOffset + barWidth * 2 + 250 * i + firstBarMarigin)
  .attr('dy', (d, i) => graphHeight - (Math.floor(scale(Math.abs(d.expense - d.revenue))) + 10))
  .text((d, i) => `${d.expense > d.revenue ? `-$` : '$'}${Math.abs(d.revenue - d.expense)}`);