import Cookies from "js-cookie";

const key = "user";

interface User {
  name: string,
}

export function hasUser(): boolean {
  return Cookies.get(key) !== undefined;
}

export function getUser(): User | null {
  const author = Cookies.get(key);
  if (author === undefined) {
    return null;
  }

  return JSON.parse(author) as User;
}

export function setUser(author: User) {
  Cookies.set(key, JSON.stringify(author));
}
