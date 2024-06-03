export const APP_NAME = "GoChat";

export const SERVER_HOST =
  import.meta.env.VITE_APP_PROD ? "https://gochat.seoulsky.org/api/" : "http://localhost:4000/api/";
