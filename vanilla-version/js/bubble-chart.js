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
    const LEGEND_CONTAINER_SELECTOR = '.legend-color'

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
                artist: d.artist
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
            .select(LEGEND_CONTAINER_SELECTOR)
            .append('li');

        legendList
            .selectAll('ul')
            .data(data)
            .join('ul');
    }

    const data = await d3.csv('./data.csv');
    createBubbleChart(data);
})()