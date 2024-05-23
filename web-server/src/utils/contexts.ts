import {createContext} from "react";
import {User} from "./user.ts";

export const UserContext = createContext<[User | null, (user: User) => void]>(null);
