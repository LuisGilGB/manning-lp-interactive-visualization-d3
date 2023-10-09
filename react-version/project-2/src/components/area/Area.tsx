import * as d3 from 'd3';

const Area = ({ bins, xScale, yScale, areaColor, transform }) => {
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
    />
  );
};

export default Area;
