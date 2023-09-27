import * as d3 from 'd3';
import * as Option from 'fp-ts/Option';
import { useMemo } from 'react';

const useMax = <Data>(data: Data[], accessor: (d: Data) => number): number =>
  useMemo(() => {
    const max = d3.max(data, accessor);
    const mapOption = Option.fromNullable(max);
    return Option.isSome(mapOption) ? mapOption.value : 0;
  }, [accessor, data]);

export default useMax;
