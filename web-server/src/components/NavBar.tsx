import {APP_NAME} from "../constants.ts";
import {paddingX} from "../styles.ts";
import {Link} from "react-router-dom";
import {forwardRef, RefObject, useContext} from "react";
import {UserContext} from "../utils/contexts.ts";
import logo from "../assets/logo.png";

const styles = {
  navElement: "px-3 font-semibold text-lg hover:text-primary",
};

const NavBar = forwardRef((_props, ref: RefObject<HTMLElement>) =>{
  const [user] = useContext(UserContext);

  return (
    <nav ref={ref} className={"flex flex-row justify-between items-center sticky top-0 w-full bg-white border-b " +
      `border-gray-400 ${paddingX}`}
    >
      <div className={"flex justify-start items-center"}>
        <Link to={"/"} className={"flex flex-row items-center py-2 pr-5"}>
          <img src={logo} alt={APP_NAME} className={"h-16 aspect-auto pr-1"}/>
          <p className={"font-bold text-4xl hover:text-primary"}>{APP_NAME}</p>
        </Link>
        {user && <Link to={"/chat"} className={styles.navElement}>Chat Room</Link>}
        {user && <Link to={"/account"} className={styles.navElement}>Account</Link>}
      </div>
      <div className="flex justify-end">
        {user && <Link to={"/account"} className={`${styles.navElement} pr-0`}>{`Hi, ${user.name}`}</Link>}
        {!user && <Link to={"/signin"} className={`${styles.navElement} pr-0`}>Sign in</Link>}
      </div>
    </nav>
  );
});

export default NavBar;
