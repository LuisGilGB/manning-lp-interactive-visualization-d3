const topRockAlbums = [
    { artist: "Queen", title: "Greatest Hits", eq_albums: 929000 },
    { artist: "Elton John", title: "Diamonds", eq_albums: 743000 },
    { artist: "Fleetwood Mac", title: "Rumours", eq_albums: 721000 },
    { artist: "CCR", title: "The 20 Greatest Hits", eq_albums: 630000 },
    { artist: "Journey", title: "Journey's Greatest Hits", eq_albums: 561000 }
];

const topAlbumsSection = d3.select('#top-albums');

topAlbumsSection.append('h3')
    .text('Top Rock Albums');

const BARS_CHART_WIDTH = 500;
const BARS_CHART_HEIGHT = 130;

const barsChart = topAlbumsSection.append('svg')
    .attr('viewbox', [ 0, 0, BARS_CHART_WIDTH, BARS_CHART_HEIGHT])
    .attr('width', BARS_CHART_WIDTH)
    .attr('height', BARS_CHART_HEIGHT);

const BARS_CHART_MARGIN_LEFT = 200;
const BARS_CHART_MARGIN_RIGHT = 50;

barsChart.append('line')
    .attr('x1', BARS_CHART_MARGIN_LEFT)
    .attr('y1', 0)
    .attr('x2', BARS_CHART_MARGIN_LEFT)
    .attr('y2', BARS_CHART_HEIGHT)
    .attr('stroke', '#333')
    .attr('stroke-width', 2);

const barLengthScale = d3.scaleLinear()
    .domain([ 0, Math.max(...topRockAlbums.map(({ eq_albums }) => eq_albums)) * 1.1 ])
    .range([0, BARS_CHART_WIDTH - BARS_CHART_MARGIN_LEFT - BARS_CHART_MARGIN_RIGHT]);

const BAR_HEIGHT = 22;
const BAR_SPACING = 4;
const BAR_COLOR = '#a6d854';

barsChart.selectAll('rect')
    .data(topRockAlbums)
    .join('rect')
        .attr('width', ({ eq_albums }) => barLengthScale(eq_albums))
        .attr('height', BAR_HEIGHT)
        .attr('x', BARS_CHART_MARGIN_LEFT + 1)
        .attr('y', (item, i) => (BAR_HEIGHT + BAR_SPACING) * i)
        .attr('fill', BAR_COLOR);

barsChart.selectAll('.label-value')
    .data(topRockAlbums)
    .join('text')
    .attr('class', 'label label-value')
    .attr('x', ({ eq_albums }) => BARS_CHART_MARGIN_LEFT + barLengthScale(eq_albums) + 10)
    .attr('y', (d, i) => (BAR_SPACING + (BAR_HEIGHT + BAR_SPACING) * i) + 14)
    .text(({ eq_albums }) => eq_albums / 1000000 + 'M');
