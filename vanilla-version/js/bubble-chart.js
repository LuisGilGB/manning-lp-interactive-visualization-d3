(async () => {
    const MARGINS = {
        TOP: 40,
        RIGHT: 40,
        BOTTOM: 60,
        LEFT: 40
    }
    const WIDTH = 1160;
    const HEIGHT = 380;
    const MAX_PADIUS = 30;

    const CHART_CONTAINER_SELECTOR = '#bubble-chart';
    const LEGEND_COLOR_CONTAINER_SELECTOR = '.legend-color';
    const LEGEND_AREA_CONTAINER_SELECTOR = '.legend-area';

    const createBubbleChart = rawData => {
        const metrics = [
            'total_album_consumption_millions',
            'album_sales_millions',
            'song_sales',
            'on_demand_audio_streams_millions',
            'on_demand_video_streams_millions'
        ];
        const artists = [];
        const data = rawData.map(d => {
            artists.push(d.artist);
            return metrics.reduce((acc, metricKey) => {
                acc[metricKey] = parseFloat(d[metricKey]);
                return acc;
            }, {
                artist: d.artist,
                title: d.title
            });
        });

        const bubbleChart = d3
            .select(CHART_CONTAINER_SELECTOR)
            .append('svg')
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

        const audioStreamsScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.on_demand_audio_streams_millions) * 1.2])
            .range([0, WIDTH - MARGINS.LEFT - MARGINS.RIGHT]);

        bubbleChart
            .append('g')
            .attr('transform', `translate(${MARGINS.LEFT},${HEIGHT - MARGINS.BOTTOM})`)
            .call(d3.axisBottom(audioStreamsScale));

        bubbleChart
            .append('text')
            .attr('class', 'label axis-label xaxis-label')
            .attr('x', WIDTH - 10)
            .attr('y', HEIGHT - MARGINS.BOTTOM + 32)
            .attr('text-anchor', 'end')
            .text('On-demand Audio Streams (millions)')

        const videoStreamsScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.on_demand_video_streams_millions) * 1.2])
            .range([HEIGHT - MARGINS.TOP - MARGINS.BOTTOM, 0]);

        bubbleChart
            .append('g')
            .attr('transform', `translate(${MARGINS.LEFT},${MARGINS.TOP})`)
            .call(d3.axisLeft(videoStreamsScale));

        bubbleChart
            .append('text')
            .attr('class', 'label axis-label yaxis-label')
            .attr('x', 10)
            .attr('y', MARGINS.TOP - 16)
            .text('On-demand Audio Streams (millions)')

        const bubblesAreaScale = d3
            .scaleSqrt()
            .domain([0, d3.max(data, d => d.album_sales_millions)])
            .range([0, MAX_PADIUS]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(artists)
            .range(d3.schemeTableau10);

        const bubblesGroup = bubbleChart
            .append('g')
            .attr('transform', `translate(${MARGINS.LEFT},${MARGINS.TOP})`)
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', d => bubblesAreaScale(d.album_sales_millions))
            .attr('cx', d => audioStreamsScale(d.on_demand_audio_streams_millions))
            .attr('cy', d => videoStreamsScale(d.on_demand_video_streams_millions))
            .attr('fill', d => colorScale(d.artist));

        const legendList = d3
            .select(LEGEND_COLOR_CONTAINER_SELECTOR)
            .append('ul');

        legendList
            .selectAll('li')
            .data(data)
            .join('li')
            .attr('class', 'legend-list-item');

        d3.selectAll('li.legend-list-item')
            .append('span')
            .attr('class', 'legend-circle')
            .attr('style', d => `background-color: ${colorScale(d.artist)}`)

        d3.selectAll('li.legend-list-item')
            .append('span')
            .text(d => `${d.title}, ${d.artist}`);

        const LEGEND_BIG_CIRCLE_VALUE = 1.5;
        const LEGEND_MEDIUM_CIRCLE_VALUE = 0.5;
        const LEGEND_SMALL_CIRCLE_VALUE = 0.1;

        const AREA_LEGEND_VALUES = [LEGEND_BIG_CIRCLE_VALUE, LEGEND_MEDIUM_CIRCLE_VALUE, LEGEND_SMALL_CIRCLE_VALUE];
        const LEGEND_AREA_HEIGHT = 2 * bubblesAreaScale(LEGEND_BIG_CIRCLE_VALUE) + 10;

        const legendArea = d3
            .select(LEGEND_AREA_CONTAINER_SELECTOR)
            .append('svg')
            .attr('width', 300)
            .attr('height', LEGEND_AREA_HEIGHT);

        legendArea
            .selectAll('g')
            .data(AREA_LEGEND_VALUES)
            .join('g')
            .attr('class', 'legend-area-group')
            .attr('transform', `translate(${bubblesAreaScale(LEGEND_BIG_CIRCLE_VALUE)},${LEGEND_AREA_HEIGHT})`)

        d3.selectAll('g.legend-area-group')
            .append('circle')
            .attr('r', d => bubblesAreaScale(d))
            .attr('cx', 0)
            .attr('cy', d => -bubblesAreaScale(d))
            .attr('fill', '#727a87')
            .attr('opacity', 0.4);

        const DASHED_LEGEND_LINE_LENGTH = 60;

        d3.selectAll('g.legend-area-group')
            .append('line')
            .attr('x1', 0)
            .attr('y1', d => -2 * bubblesAreaScale(d))
            .attr('x2', DASHED_LEGEND_LINE_LENGTH)
            .attr('y2', d => -2 * bubblesAreaScale(d))
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 5);

        d3.selectAll('g.legend-area-group')
            .append('text')
            .attr('x', DASHED_LEGEND_LINE_LENGTH + 5)
            .attr('y', d => -2 * bubblesAreaScale(d) + 5)
            .text(d => `${d}M`);
    }

    const data = await d3.csv('./data.csv');
    createBubbleChart(data);
})()