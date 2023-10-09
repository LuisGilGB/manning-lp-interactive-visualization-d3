import { useCallback } from 'react';

const identity = <T>(d: T) => d;

const useIdentity = () => useCallback(identity, []);

export default useIdentity;
