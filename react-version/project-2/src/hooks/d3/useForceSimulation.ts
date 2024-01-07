import * as d3 from 'd3';
import { useCallback, useMemo } from 'react';

interface ForceSimulationProps<Data extends Record<string, unknown>> {
  data: Data[];
  xStrength: number;
  yStrength: number;
  ticks: number;
  collideRadius?: number;
  xForceCallback?: <T extends Data>(item: T) => number;
  yForceCallback?: <T extends Data>(item: T) => number;
  itemForceCallback: <T extends Data>(item: T) => void;
}

const useForceSimulation = <
  Data extends Record<string | number | symbol, unknown>,
>({
  data = [],
  xStrength,
  yStrength,
  ticks,
  collideRadius = 5,
  xForceCallback,
  yForceCallback,
  itemForceCallback,
}: ForceSimulationProps<Data>) => {
  return d3
    .forceSimulation(data)
    .force(
      'x',
      useMemo(() => d3.forceX(xForceCallback).strength(xStrength), [xStrength]),
    )
    .force(
      'y',
      useMemo(() => d3.forceY(yForceCallback).strength(yStrength), [yStrength]),
    )
    .force(
      'collide',
      useMemo(() => d3.forceCollide(collideRadius), [collideRadius]),
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
