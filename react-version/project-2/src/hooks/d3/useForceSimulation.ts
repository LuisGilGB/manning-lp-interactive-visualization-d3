import * as d3 from 'd3';
import { useCallback, useMemo, useRef, useState } from 'react';

type ForceReadyData<Data> = Data & {
  index: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

interface ForceSimulationProps<Data extends Record<string, unknown>> {
  data: Data[];
  xStrength: number;
  yStrength: number;
  ticks: number;
  collideRadius?: number;
  xForceCallback?: (item: ForceReadyData<Data>) => number;
  yForceCallback?: (item: ForceReadyData<Data>) => number;
  itemForceCallback: (item: ForceReadyData<Data>) => void;
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
}: ForceSimulationProps<Data>): ForceReadyData<Data>[] => {
  const clonedData = useMemo<ForceReadyData<Data>[]>(
    () =>
      data.map(item =>
        item.clone && typeof item.clone === 'function'
          ? item.clone()
          : { ...item },
      ),
    [data],
  );

  const simulation = useRef(
    d3
      .forceSimulation(clonedData)
      .force(
        'x',
        useMemo(
          () => d3.forceX(xForceCallback).strength(xStrength),
          [xForceCallback, xStrength],
        ),
      )
      .force(
        'y',
        useMemo(
          () => d3.forceY(yForceCallback).strength(yStrength),
          [yForceCallback, yStrength],
        ),
      )
      .force(
        'collide',
        useMemo(() => d3.forceCollide(collideRadius), [collideRadius]),
      )
      .force(
        'axis',
        useCallback(() => {
          (clonedData as ForceReadyData<Data>[]).forEach(itemForceCallback);
        }, [clonedData, itemForceCallback]),
      )
      .stop()
      .tick(ticks),
  ).current;

  const [simulationState, setSimulationState] =
    useState<d3.Simulation<ForceReadyData<Data>, undefined>>(simulation);

  simulation.on('tick', function () {
    setSimulationState(this);
  });

  return simulationState.nodes();
};

export default useForceSimulation;
