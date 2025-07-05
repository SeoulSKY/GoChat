export const APP_NAME = "GoChat";

export const isProd: boolean = import.meta.env.PROD;

export const SERVER_HOST = isProd ? "https://gochat.seoulsky.dev/api/" : "http://localhost:4000/api/";
