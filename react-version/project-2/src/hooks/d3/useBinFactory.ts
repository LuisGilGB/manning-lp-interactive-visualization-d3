import * as d3 from 'd3';
import { useCallback } from 'react';

interface UseBinFactoryOptions {
  minDomainValue?: number;
  maxDomainValue?: number;
  thresholds?: number;
}

const useBinFactory = ({
  minDomainValue = 0,
  maxDomainValue = 100,
  thresholds = 10,
}: UseBinFactoryOptions = {}) => {
  return useCallback(
    d3
      .bin<number, number>()
      .domain([minDomainValue, maxDomainValue])
      .thresholds(thresholds),
    [minDomainValue, maxDomainValue, thresholds],
  );
};

export default useBinFactory;
