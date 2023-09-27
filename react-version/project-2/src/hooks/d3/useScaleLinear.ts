import * as d3 from 'd3';
import { useMemo } from 'react';

interface UseScaleLinearOptions {
  domain: [number, number];
  range: [number, number];
  nice?: boolean;
}

const useScaleLinear = ({
  domain,
  range,
  nice = false,
}: UseScaleLinearOptions) =>
  useMemo(() => {
    const scale = d3.scaleLinear().domain(domain).range(range);
    if (nice) scale.nice();
    return scale;
  }, [domain, nice, range]);

export default useScaleLinear;
