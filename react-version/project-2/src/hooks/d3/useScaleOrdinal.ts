import { useMemo } from 'react';
import * as d3 from 'd3';

interface UseScaleOrdinalOptions<T extends string | number> {
  domain: string[];
  range: T[];
}

const useScaleOrdinal = <T extends string | number>({
  domain,
  range,
}: UseScaleOrdinalOptions<T>): ((input: string) => T) =>
  useMemo<(input: string) => T>(
    () => d3.scaleOrdinal(domain, range),
    [domain, range],
  );

export default useScaleOrdinal;
