import useSize from "./useSize.ts";
import {NavContext} from "../utils/contexts.ts";
import {useContext} from "react";

/**
 * Get the size of the navigation bar
 * @returns The size of the navigation bar
 */
export default function useNavSize() {
  const navRef = useContext(NavContext);
  return useSize(navRef);
}
