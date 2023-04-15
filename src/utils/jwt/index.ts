import jwt, { JwtPayload } from "jsonwebtoken";
import { Error, IUser, User } from "@codrjs/models";
import config from "@codrjs/config";

const isPayload = function isPayload(obj: any): obj is JwtPayload {
  return "iss" in obj;
};

export type UserToken = IUser & JwtPayload;

/**
 * @TODO Finish writing the refresh function.
 */
export function refreshToken(token: string) {
  const bearerRegex = /^Bearer\s/;

  if (token) {
    if (bearerRegex.test(token)) {
      token = token.replace(bearerRegex, "");
    }

    try {
      const decoded = jwt.decode(token);

      if (isPayload(decoded)) {
        return decoded;
      }

      throw new Error({ status: 401, message: "Could not decode the JWT." });
    } catch (e) {
      throw new Error({ status: 401, message: "Could not decode the JWT." });
    }
  } else {
    throw new Error({ status: 400, message: "JWT is missing." });
  }
}

export function generateToken(payload: User) {
  try {
    const signOpts: jwt.SignOptions = {
      issuer: config.jwt.issuer,
      algorithm: <jwt.Algorithm>config.jwt.algorithm,
      subject: payload._id as unknown as string,
      expiresIn: "1h",
    };
    const user = payload.toJSON();
    return jwt.sign(user, config.jwt.secret, signOpts);
  } catch (err: any) {
    throw new Error({
      status: 500,
      message: err?.message || "Couldn't generate a JWT token",
      details: err,
    });
  }
}
