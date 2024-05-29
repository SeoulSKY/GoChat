import {useEffect, useState} from "react";
import {Size} from "./index.ts";


/**
 * Get the size of the window without scrolling
 * @returns The size of the window without scrolling
 */
export default function useWindowSize(): Size {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {width, height};
}
