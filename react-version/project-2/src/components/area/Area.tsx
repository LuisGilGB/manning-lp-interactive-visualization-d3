import * as d3 from 'd3';

interface AreaProps {
  bins: d3.Bin<number, number>[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  areaColor: string;
  transform?: string;
  filter?: string;
}

const Area = ({
  bins,
  xScale,
  yScale,
  areaColor,
  transform,
  filter,
}: AreaProps) => {
  const areaFactory = d3
    .area()
    .x0(() => xScale(0))
    .x1(bin => xScale(bin.length))
    .y(bin => yScale(bin.x0) - (yScale(bin.x0) - yScale(bin.x1)) / 2)
    .curve(d3.curveCatmullRom);

  return (
    <path
      d={areaFactory(bins)}
      fill={areaColor}
      stroke="none"
      fillOpacity={0.75}
      transform={transform}
      filter={filter}
    />
  );
};

export default Area;
