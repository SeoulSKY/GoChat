import useSize from "./useSize.ts";
import {NavContext} from "../utils/contexts.ts";
import {useContext} from "react";

export default function useNavSize() {
  const navRef = useContext(NavContext);
  return useSize(navRef);
}
