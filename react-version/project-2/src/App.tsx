import './App.css';
import VerticalHistogram from './components/VerticalHistogram.tsx';
import { useEffect, useRef, useState } from 'react';
import AsymmetricViolinPlot from './components/AsymmetricViolinPlot.tsx';
import tennisRepository from './infrastructure/repositories/tennis/tennis.repository.ts';
import TennisPlayer from './domain/TennisPlayer.ts';
import Gender from './domain/Gender.enum.ts';
import PlayerCircleMarker from './components/PlayerCircleMarker.tsx';
import clsx from 'clsx';
import d3Hooks from './hooks/d3';

enum DataVizType {
  VERTICAL_HISTOGRAM = 'VERTICAL_HISTOGRAM',
  ASYMMETRIC_VIOLIN_PLOT = 'ASYMMETRIC_VIOLIN_PLOT',
}

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

const App = () => {
  const [data, setData] = useState<TennisPlayer[]>([]);
  const [dataVizType, setDataVizType] = useState<DataVizType>(
    DataVizType.ASYMMETRIC_VIOLIN_PLOT,
  );
  const vizContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tennisRepository.getTennisPlayers().then(tennisPlayers => {
      setData(tennisPlayers);
    });
  }, []);

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

  const clonedData = data.map(d => ({ ...d }));

  d3Hooks.useForceSimulation<TennisPlayer>({
    data: clonedData,
    xStrength: 0.1,
    yStrength: 0.1,
    ticks: 100,
    collideRadius: MARKER_RADIUS + MARKER_PADDING,
    xForceCallback: () => VIOLIN_PLOT_WIDTH / 2,
    yForceCallback: item => yScale(item.earningsUsd2019),
    itemForceCallback: item => {
      // If man and the circle's x position is on the left side of the violin
      if (
        item.gender === 'men' &&
        item.x < VIOLIN_PLOT_WIDTH / 2 + MARKER_RADIUS
      ) {
        // Increase velocity toward the right
        item.vx += 0.004 * item.x;
      }

      // If woman and the circle's x position is on the right side of the violin
      if (
        item.gender === 'women' &&
        item.x > VIOLIN_PLOT_WIDTH / 2 - MARKER_RADIUS
      ) {
        // Increase velocity toward the left
        item.vx -= 0.004 * item.x;
      }
    },
  });

  return (
    <div className="container">
      <h1>Exploring the Tennis pays in 2019</h1>
      <div className="row">
        <div className="col-8">
          <p className="intro">
            Vamos Rafa. Vamos Rafa, vamos Rafa, vamos Rafa. Don Rafael Nadal
            Parera. Don Carlos Alcaraz Garfia. Ya sabemos qué es lo que tiene
            Rafa que no cabe ni en la Giralda #VamosRafa
          </p>
        </div>
      </div>
      <div className="data-viz-selector">
        <button
          className={clsx('btn', 'btn-primary', 'data-viz-sel-btn', {
            active: dataVizType === DataVizType.VERTICAL_HISTOGRAM,
          })}
          onClick={() => setDataVizType(DataVizType.VERTICAL_HISTOGRAM)}
        >
          Vertical Histogram
        </button>
        <button
          className={clsx('btn', 'btn-primary', 'data-viz-sel-btn', {
            active: dataVizType === DataVizType.ASYMMETRIC_VIOLIN_PLOT,
          })}
          onClick={() => setDataVizType(DataVizType.ASYMMETRIC_VIOLIN_PLOT)}
        >
          Asymmetric Violin Plot
        </button>
      </div>
      <div id="viz" style={{ position: 'relative' }} ref={vizContainer}>
        {dataVizType === DataVizType.VERTICAL_HISTOGRAM && (
          <VerticalHistogram
            data={data}
            width={600}
            height={600}
            margins={{
              top: 45,
              right: 30,
              bottom: 50,
              left: 80,
            }}
            barsGap={1}
            barsColor="steelblue"
            numberMapper={d => d.earningsUsd2019}
          />
        )}
        {dataVizType === DataVizType.ASYMMETRIC_VIOLIN_PLOT && (
          <AsymmetricViolinPlot
            leftData={data.filter(d => d.gender === Gender.FEMALE)}
            rightData={data.filter(d => d.gender === Gender.MALE)}
            width={VIOLIN_PLOT_WIDTH}
            height={VIOLIN_PLOT_HEIGHT}
            margins={VIOLIN_PLOT_MARGINS}
            leftColor="#A6BF4B"
            rightColor="#F2C53D"
            numberMapper={getEarnings}
          >
            {clonedData.map((player, i) => {
              console.log('player', player);
              return (
                <PlayerCircleMarker
                  key={player.name}
                  player={player}
                  cx={player.x}
                  cy={player.y}
                  radius={MARKER_RADIUS}
                  tooltipContainer={vizContainer.current}
                />
              );
            })}
          </AsymmetricViolinPlot>
        )}
      </div>

      <div className="source">
        <div className="label">Sources:</div>
        <ul>
          <li>
            <a href="https://www.wtatennis.com/rankings/singles">
              WTA Tour - Singles Rankings
            </a>{' '}
            Top Women tennis players on 2019-12-28
          </li>
          <li>
            <a href="https://www.atptour.com/en/rankings/singles?rankDate=2019-12-30&rankRange=0-100">
              ATP Tour - Singles Rankings
            </a>{' '}
            Top Men tennis players on 2019-12-30
          </li>
          <li>
            <a href="https://www.espn.com/">ESPN</a> Prize money of each tennis
            player for the year 2019
          </li>
        </ul>
      </div>

      <div className="note">
        Note: The layout of this visualization is inspired by the Observable
        notebook{' '}
        <a href="https://observablehq.com/@juliobguedes/hollywood-age-gaps">
          Hollywood Age Gaps
        </a>
        , by <a href="https://juliobguedes.dev/">Júlio Guedes</a>
      </div>
    </div>
  );
};

export default App;
