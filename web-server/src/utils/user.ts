import Cookies from "js-cookie";

const key = "user";

export interface User {
  name: string,
}

/**
 * Get the user from the cookie
 * @returns The user object or null if the user is not found
 */
export function getUser(): User {
  const user = Cookies.get(key);
  if (user === undefined) {
    return null;
  }

  return JSON.parse(user) as User;
}

/**
 * Set the user in the cookie
 * @param user The user object
 */
export function setUser(user: User) {
  Cookies.set(key, JSON.stringify(user));
}

/**
 * Remove the user from the cookie
 */
export function removeUser() {
  Cookies.remove(key);
}
