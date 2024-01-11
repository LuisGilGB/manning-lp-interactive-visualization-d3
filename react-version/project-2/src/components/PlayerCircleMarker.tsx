import TennisPlayer from '../domain/TennisPlayer.ts';
import { useState } from 'react';
import Tooltip from './tooltip/Tooltip.tsx';
import TennisPlayerCard from './card/TennisPlayerCard.tsx';
import clsx from 'clsx';
import styles from './PlayerCircleMarker.module.css';
import d3Hooks from '../hooks/d3';
import Gender from '../domain/Gender.enum.ts';

interface Position {
  x: number;
  y: number;
}

interface PlayerCircleMarkerProps {
  player: TennisPlayer;
  cx: number;
  cy: number;
  radius?: number;
  tooltipContainer?: HTMLElement;
}

const SCALE_ORDINAL_OPTIONS = {
  domain: [Gender.MALE, Gender.FEMALE],
  range: ['#BF9B30', '#718233'],
};

const PlayerCircleMarker = ({
  player,
  cx,
  cy,
  radius = 4,
  tooltipContainer,
}: PlayerCircleMarkerProps) => {
  const [hoverData, setHoverData] = useState<Position | null>(null);

  const color = d3Hooks.useScaleOrdinal(SCALE_ORDINAL_OPTIONS)(player.gender);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      className={clsx(styles['marker'])}
      stroke={color}
      fill={color}
      fillOpacity={0.6}
      onMouseEnter={() => {
        setHoverData(() => ({ x: cx + 10, y: cy + 10 }));
      }}
      onMouseLeave={() => {
        setHoverData(() => null);
      }}
    >
      {!!hoverData && (
        <Tooltip
          x={hoverData?.x}
          y={hoverData?.y}
          visible
          container={tooltipContainer}
        >
          <TennisPlayerCard player={player} />
        </Tooltip>
      )}
    </circle>
  );
};

export default PlayerCircleMarker;
