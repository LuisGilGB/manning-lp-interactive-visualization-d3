import './App.css';
import VerticalHistogram from './components/VerticalHistogram.tsx';
import { useEffect, useRef, useState } from 'react';
import AsymmetricViolinPlot from './components/AsymmetricViolinPlot.tsx';
import tennisRepository from './infrastructure/repositories/tennis/tennis.repository.ts';
import TennisPlayer from './domain/TennisPlayer.ts';
import Gender from './domain/Gender.enum.ts';
import PlayerCircleMarker from './components/PlayerCircleMarker.tsx';
import clsx from 'clsx';

enum DataVizType {
  VERTICAL_HISTOGRAM = 'VERTICAL_HISTOGRAM',
  ASYMMETRIC_VIOLIN_PLOT = 'ASYMMETRIC_VIOLIN_PLOT',
}

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
            width={600}
            height={600}
            margins={{
              top: 45,
              right: 30,
              bottom: 50,
              left: 80,
            }}
            leftColor="#A6BF4B"
            rightColor="#F2C53D"
            numberMapper={d => d.earningsUsd2019}
          >
            {data.map((player, i) => (
              <PlayerCircleMarker
                key={player.name}
                player={player}
                cx={100 + i * 10}
                cy={400}
                tooltipContainer={vizContainer.current}
              />
            ))}
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
