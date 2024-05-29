import {MotionProps} from "framer-motion";

type Direction = "left" | "right" | "up" | "down";

/**
 * Pressable animation
 * @param amount - The amount to press
 * @returns The motion props
 */
export function pressable(amount = 0.1): MotionProps {
  return {
    whileHover: { scale: 1 + amount },
    whileTap: { scale: 1 - amount }
  };
}

/**
 * Title animation
 * @param amount - The amount to move
 * @returns The motion props
 */
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

/**
 * Slide in animation
 * @param direction - The direction to slide in
 * @param amount - The amount to slide in
 * @returns The motion props
 */
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
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 150,
        }
      }
    }
  };
}
