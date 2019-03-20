import { URL } from "url";
import { NODE_ENV } from "../config/constants";

export function getFaviconUrl(url: string) {
  if (NODE_ENV == 'development') {
    return "https://www.google.com/favicon.ico";
  }
  return `chrome://favicon/size/16@2x/${url}`;
}
