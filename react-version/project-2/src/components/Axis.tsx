import * as d3 from 'd3';
import { useMemo } from 'react';

enum AxisOrientation {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

interface AxisProps {
  domain: [number, number];
  range: [number, number];
  orientation?: `${AxisOrientation}`;
  pixelsPerTick?: number;
}

const Axis = ({
  domain,
  range,
  orientation,
  pixelsPerTick = 30,
}: AxisProps) => {
  const ticks = useMemo(() => {
    const scale = d3.scaleLinear().domain(domain).range(range);

    const rangeWidth = range[1] - range[0];
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(rangeWidth / pixelsPerTick),
    );

    return scale.ticks(numberOfTicksTarget).map(tickValue => ({
      value: tickValue,
      offset: scale(tickValue),
    }));
  }, [domain.join('-'), range.join('-'), pixelsPerTick]);

  return (
    <svg>
      <path
        d={['M', range[0], 6, 'v', -6, 'H', range[1], 'v', 6].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, offset }) => (
        <g key={value} transform={`translate(${offset}, 0)`}>
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
