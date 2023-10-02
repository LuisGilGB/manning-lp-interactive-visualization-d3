import * as d3 from 'd3';
import { useMemo } from 'react';

interface AxisProps {
  domain: [number, number];
  range: [number, number];
  pixelsPerTick?: number;
}

const Axis = ({ domain, range, pixelsPerTick = 30 }: AxisProps) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(domain).range(range);

    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));

    return xScale.ticks(numberOfTicksTarget).map(tickValue => ({
      value: tickValue,
      xOffset: xScale(tickValue),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain.join('-'), range.join('-')]);

  return (
    <svg>
      <path
        d={['M', range[0], 6, 'v', -6, 'H', range[1], 'v', 6].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default Axis;
