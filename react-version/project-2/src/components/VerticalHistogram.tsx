import d3Hooks from '../hooks/d3';
import useIdentity from '../hooks/useIdentity.ts';
import Axis from './Axis.tsx';

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
  barsColor?: string;
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
  barsColor = 'black',
  numberMapper,
}: VerticalHistogramProps<T>) => {
  const maxValue = d3Hooks.useMax(data, numberMapper);
  //TODO: parametrize rounding with a prop
  const roundedMaxValue = Math.ceil(maxValue / 1_000_000) * 1_000_000;

  const binFactory = d3Hooks.useBinFactory({
    minDomainValue: 0,
    maxDomainValue: roundedMaxValue,
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
    domain: [0, (bins.at(-1) ?? { x1: 0 }).x1 ?? 0],
    range: [height - margins.bottom, margins.top],
  });

  console.log('bins', bins);

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
      <Axis
        scale={yScale}
        transform={`translate(${margins.left}, 0)`}
        pixelsPerTick={30}
        orientation="left"
      />
      <Axis
        scale={xScale}
        transform={`translate(0, ${height - margins.bottom})`}
        pixelsPerTick={50}
        orientation="bottom"
      />
      {bins.map(bin => (
        <rect
          key={`bar-${bin.x0}-${bin.x1}`}
          x={margins.left}
          y={yScale(bin.x1 || 0)}
          width={xScale(bin.length) - margins.left}
          height={yScale(bin.x0 || 0) - yScale(bin.x1 || 0) - barsGap}
          className="bar"
          fill={barsColor}
        />
      ))}
    </svg>
  );
};

export default VerticalHistogram;
