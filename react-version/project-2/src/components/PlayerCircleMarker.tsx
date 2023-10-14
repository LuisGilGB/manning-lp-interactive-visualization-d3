import TennisPlayer from '../domain/TennisPlayer.ts';
import { useState } from 'react';
import Tooltip from './tooltip/Tooltip.tsx';
import TennisPlayerCard from './card/TennisPlayerCard.tsx';
import clsx from 'clsx';
import styles from './PlayerCircleMarker.module.css';

interface PlayerCircleMarkerProps {
  player: TennisPlayer;
  cx: number;
  cy: number;
}

const PlayerCircleMarker = ({ player, cx, cy }: PlayerCircleMarkerProps) => {
  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={4}
        className={clsx(styles['marker'])}
        stroke="red"
        fill="orange"
        fillOpacity={0.6}
        onMouseEnter={() => {
          setHoverData({ x: 10, y: 10 });
        }}
        onMouseLeave={() => setHoverData(null)}
      >
        {
          <Tooltip x={hoverData?.x} y={hoverData?.y} visible={!!hoverData}>
            <TennisPlayerCard player={player} />
          </Tooltip>
        }
      </circle>
    </>
  );
};

export default PlayerCircleMarker;
