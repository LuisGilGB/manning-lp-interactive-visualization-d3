import d3Hooks from '../hooks/d3';
import useIdentity from '../hooks/useIdentity.ts';
import Area from './area/Area.tsx';
import Axis from './axis/Axis.tsx';
import { ReactNode } from 'react';

interface AsymmetricViolinPlotProps<T> {
  children?: ReactNode | ((item) => ReactNode);
  leftData: T[];
  rightData: T[];
  width?: number;
  height?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  leftColor?: string;
  rightColor?: string;
  numberMapper: (d: T) => number;
}

const AsymmetricViolinPlot = <T,>({
  children,
  leftData,
  rightData,
  width = 500,
  height = 500,
  margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  leftColor = 'black',
  rightColor = 'black',
  numberMapper,
}: AsymmetricViolinPlotProps<T>) => {
  const leftMaxValue = d3Hooks.useMax(leftData, numberMapper);
  const rightMaxValue = d3Hooks.useMax(rightData, numberMapper);
  const maxValue = Math.max(leftMaxValue, rightMaxValue);
  //TODO: parametrize rounding with a prop
  const roundedMaxValue = Math.ceil(maxValue / 1_000_000) * 1_000_000;

  const binFactory = d3Hooks.useBinFactory({
    minDomainValue: 0,
    maxDomainValue: roundedMaxValue,
    thresholds: 20,
  });
  const leftBins = binFactory(leftData.map(numberMapper));
  const rightBins = binFactory(rightData.map(numberMapper));

  const leftMaxBinLength = d3Hooks.useMax(
    leftBins.map(bin => bin.length),
    useIdentity(),
  );
  const rightMaxBinLength = d3Hooks.useMax(
    rightBins.map(bin => bin.length),
    useIdentity(),
  );
  const maxBinLength = Math.max(leftMaxBinLength, rightMaxBinLength);

  const xScale = d3Hooks.useScaleLinear({
    domain: [0, maxBinLength],
    range: [margins.left, width / 2],
    nice: true,
  });

  const yScale = d3Hooks.useScaleLinear({
    domain: [0, (leftBins.at(-1) ?? { x1: 0 }).x1 ?? 0],
    range: [height - margins.bottom, margins.top],
  });

  const zeroPoint = { length: 0, x0: 0, x1: 0 };
  const maxPoint = {
    length: 0,
    x0: leftBins.at(-1).x1,
    x1: leftBins.at(-1).x1,
  };

  const leftCurvePoints = [zeroPoint, ...leftBins, maxPoint];
  const rightCurvePoints = [zeroPoint, ...rightBins, maxPoint];

  return (
    <svg width={width} height={height}>
      <g>
        <Area
          bins={leftCurvePoints}
          xScale={xScale}
          yScale={yScale}
          areaColor={leftColor}
          transform={`scale(-1, 1) translate(${-width / 2 - margins.left}, 0)`}
        />
        <Area
          bins={rightCurvePoints}
          xScale={xScale}
          yScale={yScale}
          areaColor={rightColor}
          transform={`translate(${width / 2 - margins.left}, 0)`}
        />
        <Axis
          scale={yScale}
          orientation="left"
          pixelsPerTick={30}
          transform={`translate(${margins.left}, 0)`}
        />
        <line
          x1={margins?.left}
          y1={height - margins?.bottom}
          x2={width - margins?.right}
          y2={height - margins?.bottom}
          stroke="black"
          strokeWidth={1}
        />
        {typeof children === 'function'
          ? [...leftBins, ...rightBins].map(children)
          : children}
      </g>
    </svg>
  );
};

export default AsymmetricViolinPlot;
