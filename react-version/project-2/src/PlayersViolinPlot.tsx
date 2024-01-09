import Gender from './domain/Gender.enum.ts';
import PlayerCircleMarker from './components/PlayerCircleMarker.tsx';
import AsymmetricViolinPlot from './components/AsymmetricViolinPlot.tsx';
import d3Hooks from './hooks/d3';
import TennisPlayer from './domain/TennisPlayer.ts';

const MARKER_RADIUS = 4;
const MARKER_PADDING = 1.5;

const VIOLIN_PLOT_WIDTH = 600;
const VIOLIN_PLOT_HEIGHT = 600;
const VIOLIN_PLOT_MARGINS = {
  top: 45,
  right: 30,
  bottom: 50,
  left: 80,
};

const getEarnings = (player: TennisPlayer) => player.earningsUsd2019;

interface PlayersViolinPlotProps {
  data: TennisPlayer[];
  tooltipContainer?: HTMLElement;
}

const PlayersViolinPlot = ({
  data,
  tooltipContainer,
}: PlayersViolinPlotProps) => {
  const maxValue = d3Hooks.useMax(data, getEarnings);
  //TODO: parametrize rounding with a prop
  const roundedMaxValue = Math.ceil(maxValue / 1_000_000) * 1_000_000;
  const binFactory = d3Hooks.useBinFactory({
    minDomainValue: 0,
    maxDomainValue: roundedMaxValue,
    thresholds: 20,
  });
  const leftBins = binFactory(data.map(getEarnings));
  const yScale = d3Hooks.useScaleLinear({
    domain: [0, (leftBins.at(-1) ?? { x1: 0 }).x1 ?? 0],
    range: [
      VIOLIN_PLOT_HEIGHT - VIOLIN_PLOT_MARGINS.bottom,
      VIOLIN_PLOT_MARGINS.top,
    ],
  });

  const menMarkerData = d3Hooks.useForceSimulation<TennisPlayer>({
    data,
    xStrength: 0.1,
    yStrength: 10,
    ticks: 300,
    collideRadius: MARKER_RADIUS + MARKER_PADDING,
    xForceParameter: VIOLIN_PLOT_WIDTH / 2,
    yForceParameter: item => yScale(item.earningsUsd2019),
    itemForceCallback: item => {
      // If man and the circle's x position is on the left side of the violin
      if (item.isMale() && item.x < VIOLIN_PLOT_WIDTH / 2 + MARKER_RADIUS) {
        // Increase velocity toward the right
        item.vx += 0.004 * item.x;
      }

      // If woman and the circle's x position is on the right side of the violin
      if (!item.isMale() && item.x > VIOLIN_PLOT_WIDTH / 2 - MARKER_RADIUS) {
        // Increase velocity toward the left
        item.vx -= 0.004 * item.x;
      }
    },
  });

  return (
    <AsymmetricViolinPlot
      leftData={data.filter(d => d.gender === Gender.FEMALE)}
      rightData={data.filter(d => d.gender === Gender.MALE)}
      width={VIOLIN_PLOT_WIDTH}
      height={VIOLIN_PLOT_HEIGHT}
      margins={VIOLIN_PLOT_MARGINS}
      leftColor="#A6BF4B"
      rightColor="#F2C53D"
      areasFilter="url(#violin-glow)"
      numberMapper={getEarnings}
    >
      {menMarkerData.map(player => (
        <PlayerCircleMarker
          key={player.name}
          player={player}
          cx={player.x}
          cy={player.y}
          radius={MARKER_RADIUS}
          tooltipContainer={tooltipContainer}
        />
      ))}
      <defs>
        <filter id="violin-glow">
          <feGaussianBlur stdDeviation={3.5} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </AsymmetricViolinPlot>
  );
};

export default PlayersViolinPlot;
