const margin = {top: 45, right: 30, bottom: 50, left: 80};
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
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
    .selectAll('rect')
    .data(bins)

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(bins.map(bin => bin.length))])
    .range([margin.left, width - margin.right])
    .nice();
  console.log(xScale.domain(), xScale.range());
};

// Create Split Violin Plot
const createViolin = () => {
  
};
