import './App.css';
import VerticalHistogram from './components/VerticalHistogram.tsx';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import AsymmetricViolinPlot from './components/AsymmetricViolinPlot.tsx';

const App = () => {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    d3.csv('data/tennis-players-2019.csv').then((data: unknown[]) => {
      setData(data);
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
      <div id="viz">
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
          numberMapper={d => parseInt(d.earnings_USD_2019)}
        />
      </div>
      <div id="viz-2">
        <AsymmetricViolinPlot
          leftData={data.filter(d => d.gender === 'women')}
          rightData={data.filter(d => d.gender === 'men')}
          width={600}
          height={600}
          margins={{
            top: 45,
            right: 30,
            bottom: 50,
            left: 80,
          }}
          numberMapper={d => parseInt(d.earnings_USD_2019)}
        />
      </div>
      <div className="tooltip">
        <div className="name"></div>
        <div className="home"></div>
        <div className="total-earnings-section">
          Total prize money: <span className="total-earnings"></span>
        </div>
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
