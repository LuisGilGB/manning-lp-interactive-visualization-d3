import { scaleLinear } from 'd3-scale';
import { bin, max } from 'd3-array';

interface VerticalHistogramProps<T> {
  data: T[];
  width?: number;
  height?: number;
  numberMapper: (d: T) => number;
}

const VerticalHistogram = <T,>({
  data,
  width = 500,
  height = 500,
  numberMapper,
}: VerticalHistogramProps<T>) => {
  console.log('data', data);
  const maxValue = max(data, numberMapper) || 0;

  const binFactory = bin().domain([0, maxValue]).thresholds(20);
  const bins = binFactory(data.map(numberMapper));

  const xScale = scaleLinear()
    .domain([0, max(bins.map(bin => bin.length)) || 0])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain([0, (bins.at(-1) || { x1: 0 }).x1 || 0])
    .range([0, height]);

  return (
    <svg
      className="vertical-histogram"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <text x={width / 2} y={5} textAnchor="middle" className="title">
        Earnings of the top tennis players in 2019 (USD)
      </text>
      {bins.map((bin, index) => (
        <g key={index} transform={`translate(0, ${yScale(bin.x0 || 0)})`}>
          <rect
            x={0}
            y={0}
            width={xScale(bin.length)}
            height={yScale(bin.x1 || 0) - yScale(bin.x0 || 0)}
            className="bar"
          />
          <text
            x={xScale(bin.length) + 5}
            y={(yScale(bin.x1 || 0) - yScale(bin.x0 || 0)) / 2}
            alignmentBaseline="central"
            className="label"
          >
            {bin.length}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default VerticalHistogram;
