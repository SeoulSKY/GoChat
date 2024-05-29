import {ChangeEvent, useContext, useState} from "react";
import useWindowSize from "../hooks/useWindowSize.ts";
import {useNavigate} from "react-router-dom";
import {NavContext, UserContext} from "../utils/contexts.ts";
import useSize from "../hooks/useSize.ts";
import useNavSize from "../hooks/useNavSize.ts";

interface InputProps {
  error?: string,
  className?: string,
  [prop: string]: unknown,
}

function Input({error = "", className = "", ...props}: InputProps) {
  return (
    <>
      <input {...props} className={`w-full focus:outline-none text-base px-2 py-2 rounded-lg placeholder-gray-600 
      border-2 border-gray-500 focus:border-primary ${className}`} />
      {error && <p className={"text-base font-normal text-red-500 pl-2"}>{error}</p>}
    </>
  );
}

export default function SignIn() {
  const height = useWindowSize().height - useNavSize().height;
  const [name, setName] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  return (
    <div className={"flex justify-center items-center"} style={{height: height}}>
      <div className={"w-100 border-2 rounded-xl p-6"}>
        <h1 className={"font-bold text-4xl"}>Sign in</h1>
        <Input
          placeholder={"Your Name"}
          value={name}
          maxLength={20}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className={"my-10"}
        />
        <button
          className={"w-full font-semibold text-white px-3 py-3 bg-primary rounded-3xl"}
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            setUser({name});
            navigate("/");
          }}
        >Log In</button>
      </div>
    </div>
  );
}
