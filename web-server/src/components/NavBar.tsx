import {APP_NAME} from "../constants.ts";
import {paddingX} from "../styles.ts";
import {Link} from "react-router-dom";
import {forwardRef, RefObject, useContext} from "react";
import {UserContext} from "../utils/contexts.ts";

const styles = {
  navElement: "px-3 font-semibold hover:text-primary",
};

const NavBar = forwardRef((_props, ref: RefObject<HTMLElement>) =>{
  const [user] = useContext(UserContext);
  const name = user?.name;

  return (
    <nav ref={ref} className={"flex flex-row justify-between items-center sticky top-0 w-full bg-white border-b " +
      `border-gray-400 ${paddingX}`}
    >
      <div className={"flex justify-start items-center"}>
        <Link to={"/"} className={"font-bold text-3xl py-5 pr-5 hob"}>{APP_NAME}</Link>
        <Link to={"/chat"} className={styles.navElement}>Chat Room</Link>
        <Link to={"/profile"} className={styles.navElement}>Profile</Link>
      </div>
      <div className="flex justify-end">
        {name && <Link to={"/profile"} className={"font-semibold"}>Hi, SeoulSKY</Link>}
      </div>
    </nav>
  );
});

export default NavBar;