import { AxisOrientation } from './types.ts';

interface TickProps {
  value: string;
  transform: string;
  orientation: `${AxisOrientation}`;
}

const LINE_PROPS_BY_ORIENTATION: Record<
  AxisOrientation,
  { x2: number; y2: number }
> = {
  [AxisOrientation.Top]: { x2: 0, y2: -6 },
  [AxisOrientation.Right]: { x2: 6, y2: 0 },
  [AxisOrientation.Bottom]: { x2: 0, y2: 6 },
  [AxisOrientation.Left]: { x2: -6, y2: 0 },
};

const TEXT_PROPS_BY_ORIENTATION: Record<
  AxisOrientation,
  { textAnchor: 'start' | 'middle' | 'end'; transform: string }
> = {
  [AxisOrientation.Top]: {
    textAnchor: 'middle',
    transform: 'translateY(-8px)',
  },
  [AxisOrientation.Right]: {
    textAnchor: 'start',
    transform: 'translateX(8px)',
  },
  [AxisOrientation.Bottom]: {
    textAnchor: 'middle',
    transform: 'translateY(20px)',
  },
  [AxisOrientation.Left]: {
    textAnchor: 'end',
    transform: 'translateX(-8px)',
  },
};

const Tick = ({ value, transform, orientation }: TickProps) => {
  return (
    <g transform={transform}>
      <line {...LINE_PROPS_BY_ORIENTATION[orientation]} stroke="currentColor" />
      <text style={TEXT_PROPS_BY_ORIENTATION[orientation]} fontSize={10}>
        {value}
      </text>
    </g>
  );
};

export default Tick;
