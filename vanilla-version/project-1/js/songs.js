(() => {
    const topRockSongs = [
        { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
        { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
        { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
        { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
        { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
    ];

    const TOP_SONGS_ID_SELECTOR = '#top-songs';

    const topSongsSection = d3.select(TOP_SONGS_ID_SELECTOR);

    topSongsSection
        .append('h3')
        .text('Top Rock Songs');

    const CIRCLES_CHART_WIDTH = 550;
    const CIRCLES_CHART_HEIGHT = 130;

    const circlesChart = topSongsSection
        .append('svg')
        .attr('viewbox', [ 0, 0, CIRCLES_CHART_WIDTH, CIRCLES_CHART_HEIGHT ])
        .attr('width', CIRCLES_CHART_WIDTH)
        .attr('height', CIRCLES_CHART_HEIGHT);

    const LINE_Y_POS = CIRCLES_CHART_HEIGHT / 2;
    circlesChart
        .append('line')
        .attr('x1', 0)
        .attr('x2', CIRCLES_CHART_WIDTH)
        .attr('y1', LINE_Y_POS)
        .attr('y2', LINE_Y_POS)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

    const MAX_RADIUS = CIRCLES_CHART_HEIGHT/ 2 - 20;

    const circlesScale = d3.scaleSqrt()
        .domain([0, d3.max(topRockSongs, d => d.sales_and_streams)])
        .range([0, MAX_RADIUS])

    const circlesChartGroups = circlesChart.selectAll('g')
        .data(topRockSongs)
        .join('g')
        .attr('transform', (d, i) => `translate(${(i + 0.5) * (2 * MAX_RADIUS + 20)},${LINE_Y_POS})`)

    circlesChartGroups
        .append('circle')
            .attr('r', ({sales_and_streams}) => circlesScale(sales_and_streams))
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('fill', '#8da0cb');

    circlesChartGroups
        .append('text')
            .attr('class', 'label label-value')
            .attr('x', 0)
            .attr('y', ({sales_and_streams}) => - circlesScale(sales_and_streams) - 5)
            .attr('text-anchor', 'middle')
            .text(({sales_and_streams}) => sales_and_streams / 1000000 + 'M');

    circlesChartGroups
        .append('text')
            .attr('class', 'label label-value')
            .attr('x', 0)
            .attr('y', ({sales_and_streams}) => circlesScale(sales_and_streams) + 20)
            .attr('text-anchor', 'middle')
            .text(({title}) => title);
})()