import {RefObject, useEffect, useState} from "react";

export default function useScroll(ref: RefObject<HTMLElement>) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (ref.current) {
        const maxScrollTop = ref.current.scrollHeight - ref.current.clientHeight;
        if (maxScrollTop > 0) { // cvoid division by zero
          const scrollValue = ref.current.scrollTop / maxScrollTop;

          setScroll(Math.min(1, Math.max(0, scrollValue)));
        } else {
          setScroll(0);
        }
      }
    }

    onScroll(); // call onScroll to initialize the scroll value
    ref.current.addEventListener("scroll", onScroll);
    return () => ref.current?.removeEventListener("scroll", onScroll);
  }, [ref]);

  return scroll;
}
