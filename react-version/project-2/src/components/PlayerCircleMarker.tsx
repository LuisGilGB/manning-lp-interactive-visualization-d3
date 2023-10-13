import TennisPlayer from '../domain/TennisPlayer.ts';
import { useState } from 'react';
import Tooltip from './tooltip/Tooltip.tsx';
import TennisPlayerCard from './card/TennisPlayerCard.tsx';

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
        stroke="red"
        fill="orange"
        fillOpacity={0.6}
        onMouseEnter={event => {
          const [x, y] = [event.pageX, event.pageY];
          setHoverData({ x, y });
        }}
        onMouseLeave={() => setHoverData(null)}
      />
      {
        <Tooltip x={hoverData?.x} y={hoverData?.y} visible={!!hoverData}>
          <TennisPlayerCard player={player} />
        </Tooltip>
      }
    </>
  );
};

export default PlayerCircleMarker;
