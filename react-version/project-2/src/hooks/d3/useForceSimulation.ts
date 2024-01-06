import * as d3 from 'd3';
import { useCallback, useMemo } from 'react';

interface ForceSimulationProps<Data extends d3.SimulationNodeDatum> {
  data: Data[];
  xStrength: number;
  yStrength: number;
  ticks: number;
  itemForceCallback: () => void;
}

const useForceSimulation = <Data extends d3.SimulationNodeDatum>({
  data = [],
  xStrength,
  yStrength,
  ticks,
  itemForceCallback,
}: ForceSimulationProps<Data>) => {
  return d3
    .forceSimulation(data)
    .force(
      'x',
      useMemo(() => d3.forceX().strength(xStrength), [xStrength]),
    )
    .force(
      'y',
      useMemo(() => d3.forceY().strength(yStrength), [yStrength]),
    )
    .force(
      'axis',
      useCallback(() => {
        data.forEach(itemForceCallback);
      }, [data, itemForceCallback]),
    )
    .stop()
    .tick(ticks);
};

export default useForceSimulation;
