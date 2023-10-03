import * as d3 from 'd3';
import { useMemo } from 'react';
import useScaleLinear from '../hooks/d3/useScaleLinear.ts';

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
  transform?: string;
}

const Axis = ({
  domain,
  range,
  orientation,
  pixelsPerTick = 30,
  transform,
}: AxisProps) => {
  const scale = useScaleLinear({ domain, range });

  const ticks = useMemo(() => {
    console.log('range', range);
    const rangeWidth = Math.abs(range[1] - range[0]);
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(rangeWidth / pixelsPerTick),
    );

    return scale.ticks(numberOfTicksTarget).map(tickValue => ({
      value: d3.format('.2s')(tickValue),
      offset: scale(tickValue),
    }));
  }, [pixelsPerTick, range, scale]);

  const isVertical =
    orientation === AxisOrientation.Left ||
    orientation === AxisOrientation.Right;

  console.log('ticks', ticks);
  if (isVertical) {
    return (
      <g transform={transform}>
        <path
          d={['M', 6, range[0], 'h', -6, 'V', range[1], 'h', 6].join(' ')}
          fill="none"
          stroke="currentColor"
        />
        {ticks.map(({ value, offset }) => (
          <g key={value} transform={`translate(0, ${offset})`}>
            <line x2="-6" stroke="currentColor" />
            <text
              key={value}
              style={{
                fontSize: '10px',
                textAnchor: 'end',
                transform: 'translateX(-8px)',
              }}
            >
              {value}
            </text>
          </g>
        ))}
      </g>
    );
  }

  return (
    <g transform={transform}>
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
    </g>
  );
};

export default Axis;
