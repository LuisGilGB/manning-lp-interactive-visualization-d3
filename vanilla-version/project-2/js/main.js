const margin = { top: 45, right: 30, bottom: 50, left: 80 };
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const barsGap = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';

// Load data here
d3.csv('data/pay_by_gender_tennis.csv').then(rawData => {
  console.log(rawData);
  const data = rawData.map(item => ({
    ...item,
    earnings_USD_2019: parseInt(item.earnings_USD_2019),
  }));
  //const earnings = data.map(item => item.earnings_USD_2019);
  //createHistogram(earnings);
  createViolin(data);
})
  .catch(error => {
    console.error(error);
  });


// Create Histogram
const createHistogram = (earnings) => {
  const min = 0;
  const max = Math.ceil(d3.max(earnings) / 1_000_000);
  const bin = d3.bin().thresholds(max);
  const bins = bin(earnings);

  d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'histogram');

  const xScale = d3.scaleLinear()
    .domain([ 0, d3.max(bins.map(bin => bin.length)) ])
    .range([ margin.left, width - margin.right ])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([ 0, bins.at(-1).x1 ])
    .range([ height - margin.bottom, margin.top ]);

  const histogram = d3.select('.histogram');

  histogram
    .append('text')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'title')
    .text('Earnings of the top tennis players in 2019 (USD)');

  histogram
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3
      .axisLeft(yScale)
      .ticks(bins.length)
      .tickFormat(d3.format('.2s')),
    );

  histogram
    .append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  histogram
    .selectAll('rect')
    .data(bins)
    .join('rect')
    .attr('x', margin.left)
    .attr('y', bin => yScale(bin.x1))
    .attr('width', bin => xScale(bin.length) - margin.left)
    .attr('height', bin => yScale(bin.x0) - yScale(bin.x1) - barsGap)
    .attr('fill', barsColor);

  const curveFactory = d3.line()
    .x(bin => xScale(bin.length))
    .y(bin => yScale(bin.x0) - (yScale(bin.x0) - yScale(bin.x1)) / 2)
    .curve(d3.curveCatmullRom);

  const zeroPoint = { length: 0, x0: 0, x1: 0 };
  const maxPoint = { length: 0, x0: bins.at(-1).x1, x1: bins.at(-1).x1 };
  const expandedBins = [zeroPoint, ...bins, maxPoint];

  histogram
    .append('path')
    .attr('d', curveFactory(expandedBins))
    .attr('fill', 'none')
    .attr('stroke', 'magenta')
    .attr('stroke-width', 2);

  const areaFactory = d3.area()
    .x0(() => xScale(0))
    .x1(bin => xScale(bin.length))
    .y(bin => yScale(bin.x0) - (yScale(bin.x0) - yScale(bin.x1)) / 2)
    .curve(d3.curveCatmullRom);

  histogram
    .append('path')
    .attr('d', areaFactory(expandedBins))
    .attr('fill', 'yellow')
    .attr('fill-opacity', 0.5);
};

// Create Split Violin Plot
const createViolin = (data) => {
  console.log(data)
  const menData = [];
  const womenData = [];

  data.forEach(item => {
    if (item.gender === 'men') {
      menData.push(item);
    } else {
      womenData.push(item);
    }
  });

  const menEarnings = menData.map(item => item.earnings_USD_2019);
  const womenEarnings = womenData.map(item => item.earnings_USD_2019);

  const menMax = Math.ceil(d3.max(menEarnings) / 1_000_000);
  const womenMax = Math.ceil(d3.max(womenEarnings) / 1_000_000);

  const menBins = d3.bin().thresholds(menMax)(menData.map(item => item.earnings_USD_2019));
  const womenBins = d3.bin().thresholds(womenMax)(womenData.map(item => item.earnings_USD_2019));
  console.log(menBins);
  console.log(womenBins);

  const maxX = d3.max([ d3.max(menBins.map(bin => bin.length)), d3.max(womenBins.map(bin => bin.length)) ]);

  const xScale = d3.scaleLinear()
    .domain([ 0, maxX ])
    .range([ margin.left, width/2 ])
    .nice();

  const maxY = d3.max([ menBins.at(-1).x1, womenBins.at(-1).x1 ]);
  const yScale = d3.scaleLinear()
    .domain([ 0, maxY ])
    .range([ height - margin.bottom, margin.top ]);

  const violin = d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'violin');

  violin
    .append('text')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'title')
    .text('Earnings of the top tennis players in 2019 (USD)');

  violin
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3
      .axisLeft(yScale)
      .ticks(menBins.length)
      .tickFormat(d3.format('.2s')),
    );

  violin
    .append('line')
    .attr('x1', margin.left)
    .attr('y1', height - margin.bottom)
    .attr('x2', width - margin.right)
    .attr('y2', height - margin.bottom)
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  const areaFactory = d3.area()
    .x0(() => xScale(0))
    .x1(bin => xScale(bin.length))
    .y(bin => yScale(bin.x0) - (yScale(bin.x0) - yScale(bin.x1)) / 2)
    .curve(d3.curveCatmullRom);

  const expandBins = (bins) => {
    const zeroPoint = { length: 0, x0: 0, x1: 0 };
    const maxPoint = { length: 0, x0: bins.at(-1).x1, x1: bins.at(-1).x1 };
    return [zeroPoint, ...bins, maxPoint];
  }

  violin
    .append('path')
    .attr('d', areaFactory(expandBins(menBins)))
    .attr('fill', '#F2C53D')
    .attr('fill-opacity', 0.8)
    .attr('stroke', 'none')
    .attr('transform', `translate(${width/2 - margin.left}, 0)`);

  violin
    .append('path')
    .attr('d', areaFactory(expandBins(womenBins)))
    .attr('fill', '#A6BF4B')
    .attr('fill-opacity', 0.8)
    .attr('transform', `scale(-1, 1) translate(${-width/2 - margin.left}, 0)`);
};
