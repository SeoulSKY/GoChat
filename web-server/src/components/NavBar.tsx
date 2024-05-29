import {APP_NAME} from "../constants.ts";
import {paddingX} from "../styles.ts";
import {Link} from "react-router-dom";
import {forwardRef, RefObject, useContext} from "react";
import {UserContext} from "../utils/contexts.ts";
import logo from "../assets/logo.png";
import {motion} from "framer-motion";
import {pressable} from "../utils/motion.ts";

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
          <motion.img
            src={logo}
            alt={APP_NAME}
            className={"h-12 aspect-auto pr-3"}
            {...pressable()}
          />
          <motion.p className={"font-bold text-4xl hover:text-primary"} {...pressable()}>{APP_NAME}</motion.p>
        </Link>
        {user && <Link to={"/chat"}>
          <motion.p className={styles.navElement} {...pressable()}>Chat Room</motion.p>
        </Link>}
        {user && <Link to={"/account"}>
          <motion.p className={styles.navElement} {...pressable()}>Account</motion.p>
        </Link>}
      </div>
      <div className="flex justify-end">
        {user && <Link to={"/account"}>
          <motion.p className={`${styles.navElement} pr-0`} {...pressable()}>{`Hi, ${user.name}`}</motion.p>
        </Link>}
        {!user && <Link to={"/signin"}>
          <motion.p className={`${styles.navElement} pr-0`} {...pressable()}>Sign in</motion.p>
        </Link>}
      </div>
    </nav>
  );
});

export default NavBar;
