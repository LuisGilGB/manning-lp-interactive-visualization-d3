import { useCallback } from 'react';

const useIdentity = () => useCallback((d: number) => d, []);

export default useIdentity;
