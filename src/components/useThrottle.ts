import { useRef } from 'react';

function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);

  const throttledFunction = (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  };

  return throttledFunction;
}

export default useThrottle;
