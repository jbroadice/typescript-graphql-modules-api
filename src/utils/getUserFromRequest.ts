import * as fs from "fs";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import getTokenFromHeaders from "./getTokenFromHeaders";
import { User } from "@models";

const jwtVerifyOptions = {
  expiresIn: "15m",
  algorithm: ["RS256"],
};

const getPublicKey = () =>
  fs.readFileSync(path.resolve(__dirname, "../../public.key"), "utf8");

const getUserFromRequest = async ({ headers }) => {
  const token = getTokenFromHeaders(headers);

  if (!token) {
    return null;
  }

  let verify = { id: null };
  try {
    verify = jwt.verify(token, getPublicKey(), jwtVerifyOptions);
  } catch (e) {
    verify.id = null;
  }

  if (!verify || !verify.id) {
    return null;
  }

  return User.query().findOne({ uuid: verify.id });
};

export default getUserFromRequest;
