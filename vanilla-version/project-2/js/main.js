const margin = {top: 45, right: 30, bottom: 50, left: 80};
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const barsGap = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';

// Load data here
d3.csv('data/pay_by_gender_tennis.csv').then(data => {
  console.log(data);
  const earnings = data.map(item => parseInt(item.earnings_USD_2019));
  createHistogram(earnings);
})
.catch(error => {
  console.error(error);
});


// Create Histogram
const createHistogram = (earnings) => {
  console.log(earnings);
  const min = 0;
  const max = Math.ceil(d3.max(earnings) / 1_000_000);
  const bin = d3.bin().thresholds(max);
  const bins = bin(earnings);
  console.log(bins);

  d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'histogram')

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(bins.map(bin => bin.length))])
    .range([margin.left, width - margin.right])
    .nice();
  console.log(xScale.domain(), xScale.range());
  const yScale = d3.scaleLinear()
    .domain([0, bins.at(-1).x1])
    .range([height - margin.bottom, margin.top]);

  d3.select('.histogram')
    .append('text')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'title')
    .text('Earnings of the top tennis players in 2019 (USD)');

  d3.select('.histogram')
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3
      .axisLeft(yScale)
      .ticks(bins.length)
      .tickFormat(d3.format('.2s'))
    );

  d3.select('.histogram')
    .append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  d3.select('.histogram')
    .selectAll('rect')
    .data(bins)
    .join('rect')
    .attr('x', margin.left)
    .attr('y', bin => yScale(bin.x1))
    .attr('width', bin => xScale(bin.length) - margin.left)
    .attr('height', bin => yScale(bin.x0) - yScale(bin.x1) - barsGap)
    .attr('fill', barsColor);

};

// Create Split Violin Plot
const createViolin = () => {
  
};
