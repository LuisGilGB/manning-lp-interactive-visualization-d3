import TennisPlayer from '../domain/TennisPlayer.ts';
import { useState } from 'react';
import Tooltip from './tooltip/Tooltip.tsx';
import TennisPlayerCard from './card/TennisPlayerCard.tsx';
import clsx from 'clsx';
import styles from './PlayerCircleMarker.module.css';

interface Position {
  x: number;
  y: number;
}

interface PlayerCircleMarkerProps {
  player: TennisPlayer;
  cx: number;
  cy: number;
  tooltipContainer?: HTMLElement;
}

const PlayerCircleMarker = ({
  player,
  cx,
  cy,
  tooltipContainer,
}: PlayerCircleMarkerProps) => {
  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      className={clsx(styles['marker'])}
      stroke="red"
      fill="orange"
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
