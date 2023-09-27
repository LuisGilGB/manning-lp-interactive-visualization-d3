import d3Hooks from '../hooks/d3';
import useIdentity from '../hooks/useIdentity.ts';

interface VerticalHistogramProps<T> {
  data: T[];
  width?: number;
  height?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  barsGap?: number;
  numberMapper: (d: T) => number;
}

const VerticalHistogram = <T,>({
  data,
  width = 500,
  height = 500,
  margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  barsGap = 1,
  numberMapper,
}: VerticalHistogramProps<T>) => {
  console.log('data', data);
  const maxValue = d3Hooks.useMax(data, numberMapper);

  const binFactory = d3Hooks.useBinFactory({
    minDomainValue: 0,
    maxDomainValue: maxValue,
    thresholds: 20,
  });
  const bins = binFactory(data.map(numberMapper));

  const xScale = d3Hooks.useScaleLinear({
    domain: [
      0,
      d3Hooks.useMax(
        bins.map(bin => bin.length),
        useIdentity(),
      ),
    ],
    range: [margins.left, width - margins.right],
    nice: true,
  });

  const yScale = d3Hooks.useScaleLinear({
    domain: [0, (bins.at(-1) || { x1: 0 }).x1 || 0],
    range: [height - margins.bottom, margins.top],
    nice: true,
  });

  return (
    <svg
      className="vertical-histogram"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <text
        x={width / 2}
        y={margins?.top / 2}
        textAnchor="middle"
        className="title"
      >
        Earnings of the top tennis players in 2019 (USD)
      </text>
      {bins.map((bin, index) => (
        <g key={index} transform={`translate(0, ${yScale(bin.x0 || 0)})`}>
          <rect
            x={margins.left}
            y={yScale(bin.x1 || 0)}
            width={xScale(bin.length) - margins.left}
            height={yScale(bin.x0 || 0) - yScale(bin.x1 || 0) - barsGap}
            className="bar"
          />
          <text
            x={xScale(bin.length) + 5}
            y={(yScale(bin.x0 || 0) + yScale(bin.x1 || 0)) / 2}
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
