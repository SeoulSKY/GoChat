import {paddingX} from "../styles.ts";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {UserContext} from "../utils/contexts.ts";


export default function Account() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const [user, setUser] = useContext(UserContext);
  if (!user) {
    navigate("/signin");
  }

  useEffect(() => {
    setName(user.name);
  }, []);

  return (
    <div className={`w-full ${paddingX}`}>
      <h1 className={"font-bold text-3xl my-10"}>Account Settings</h1>

      <div className={"border-gray-400 border-2 rounded-2xl"}>
        <h2 className={"font-normal text-xl m-5"}>About</h2>

        <div className={"flex flex-row items-center m-5"}>
          <p className={"text-base pr-5"}>Name</p>
          <input
            className={"w-full border-2 border-gray-400 rounded-lg p-2 focus:outline-none focus:border-primary"}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
        </div>

        <div className={"flex justify-end p-5"}>
          <button
            className={"text-base font-normal text-white rounded-3xl px-6 py-3 bg-primary"}
            onClick={() => {
              if (!name.trim()) {
                toast.error("Name cannot be empty");
                return;
              }

              setUser({name});
              toast.success(`Your name has been updated to ${name}`);
            }}
          >Update
          </button>
        </div>
      </div>

      <button
        className={"text-base font-normal text-white rounded-3xl px-6 py-3 bg-red-500 mt-5"}
        onClick={() => setUser(null)}
      >Sign Out</button>
    </div>
  );
}
