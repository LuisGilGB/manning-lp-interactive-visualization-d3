import * as d3 from 'd3';

interface CurveProps {
  bins: d3.Bin<number, number>[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  color: string;
  strokeWidth: number;
}

const Curve = ({ bins, xScale, yScale, color, strokeWidth }: CurveProps) => {
  const curveFactory = d3
    .line()
    .x(bin => xScale(bin.length))
    .y(bin => yScale(bin.x0) - (yScale(bin.x0) - yScale(bin.x1)) / 2)
    .curve(d3.curveCatmullRom);

  return (
    <path
      d={curveFactory(bins)}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default Curve;
