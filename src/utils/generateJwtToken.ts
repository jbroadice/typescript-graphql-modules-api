import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

const jwtSignOptions = {
  expiresIn: "15m",
  algorithm: "RS256",
};

const getPrivateKey = () =>
  fs.readFileSync(path.resolve(__dirname, "../../private.key"), "utf8");

const generateJwtToken = (userId) =>
  jwt.sign({ id: userId }, getPrivateKey(), jwtSignOptions);

export default generateJwtToken;
