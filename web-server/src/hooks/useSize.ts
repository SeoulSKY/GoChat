import {RefObject, useEffect, useState} from "react";
import {Size} from "./index.ts";

/**
 * Get the size of the target element
 * @param target - The target element
 * @returns The size of the target element
 */
export default function useSize(target: RefObject<HTMLElement>): Size {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!target.current) {
      return;
    }

    setWidth(target.current.offsetWidth);
    setHeight(target.current.offsetHeight);

    const resizeObserver = new ResizeObserver(() => {
      if (!target.current) {
        return;
      }

      setWidth(target.current.offsetWidth);
      setHeight(target.current.offsetHeight);
    });

    resizeObserver.observe(target.current);

    return () => {
      if (!target.current) {
        return;
      }

      resizeObserver.disconnect();
    };
  }, [target]);

  return {width, height};
}