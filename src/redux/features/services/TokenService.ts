import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

interface Token {
  accessToken: string;
  refreshToken: string;
}


const getLocalAccessToken = (): string | null => {
  try {
    const user = Cookie.get("accessToken");
    return user || null;
  } catch {
    return null;
  }
};

const getUser = (): Record<string, unknown> | null => {
  try {
    const user = Cookie.get("accessToken");
    return user ? jwtDecode<Record<string, unknown>>(user) : null;
  } catch {
    return null;
  }
};

export const getToken = (): Token | null => {
  try {
    const accessToken = Cookie.get("accessToken");
    const refreshToken = Cookie.get("refreshToken");

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }

    return null;
  } catch {
    return null;
  }
};

const updateLocalAccessToken = (token: Token): boolean => {
  try {
    const accessTokenDecoded = jwtDecode<DecodedToken>(token.accessToken);
    const refreshTokenDecoded = jwtDecode<DecodedToken>(token.refreshToken);
    const accessTokenExpiry = new Date(accessTokenDecoded.exp * 1000);
    const refreshTokenExpiry = new Date(refreshTokenDecoded.exp * 1000);

    const accessTokenCookieOptions = {
      httpOnly: false,
      expires: accessTokenExpiry,
      path: "/",
      sameSite: "strict" as const,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    };

    const refreshTokenCookieOptions = {
      httpOnly: false,
      expires: refreshTokenExpiry,
      path: "/",
      sameSite: "strict" as const,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    };

    Cookie.set("accessToken", token.accessToken, accessTokenCookieOptions);
    Cookie.set("refreshToken", token.refreshToken, refreshTokenCookieOptions);
    return true;
  } catch {
    return false;
  }
};

const removeUser = (): void => {
  try {
    const token = Cookie.get("accessToken");
    if (token) {
      Cookie.remove("accessToken", { path: "/" });
    }
  } catch (error) {
    console.error(error);
  }
};

const getExpiryDate = async (token: Token): Promise<Date> => {
  const decodedUser = jwtDecode<DecodedToken>(token.refreshToken);
  return new Date(decodedUser.exp * 1000);
};

const isAccessExpired = (): boolean => {
  try {
    const accessToken = Cookie.get("accessToken");
    if (accessToken) {
      const decodedUser = jwtDecode<DecodedToken>(accessToken);
      return new Date().getTime() > new Date(decodedUser.exp * 1000).getTime();
    }
    return true;
  } catch {
    return true;
  }
};

const TokenService = {
  getLocalAccessToken,
  updateLocalAccessToken,
  removeUser,
  getExpiryDate,
  isAccessExpired,
  getToken,
  getUser,
};

export default TokenService;
