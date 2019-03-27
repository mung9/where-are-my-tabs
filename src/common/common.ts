import { NODE_ENV } from "../config/constants";

let n = 0;

function getHost(url: string){
  return new URL(url).origin;
}

export function getFaviconUrl(url: string) {
  const testUrl = "https://www.naver.com/abc/def.ico";
  if (NODE_ENV == 'development') {
    const flag = (++n) % 6;
    switch (flag) {
      case 0:
        return "https://www.kakao.com/favicon.ico"
      case 1:
        return "https://www.naver.com/favicon.ico";
      case 2:
        return "https://www.google.com/favicon.ico";
      case 3:
        return "https://www.daum.net/favicon.ico";
      case 4:
        return "https://www.github.com/favicon.ico";
      case 5:
        return "https://www.youtube.com/favicon.ico";
    }
  }
  return `chrome://favicon/size/16@2x/${getHost(url)}`;
}
