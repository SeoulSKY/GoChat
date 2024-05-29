import {MotionProps} from "framer-motion";

type Direction = "left" | "right" | "up" | "down";

export function pressable(amount = 0.1): MotionProps {
  return {
    whileHover: { scale: 1 + amount },
    whileTap: { scale: 1 - amount }
  };
}

export function title(amount = 50): MotionProps {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true },
    variants: {
      hidden: {
        y: -amount,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 1.25,
        },
      },
    }
  };
}

export function slideIn(direction: Direction, amount = 50): MotionProps {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true },
    variants: {
      hidden: {
        x: direction === "left" ? -amount : direction === "right" ? amount : 0,
        y: direction === "up" ? -amount : direction === "down" ? amount : 0,
        opacity: 0
      },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 150,
        }
      }
    }
  };
}
