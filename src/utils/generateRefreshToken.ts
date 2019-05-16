import * as randtoken from "rand-token";
import { RefreshToken } from "@models";

const generateRefreshToken = async (userId) => {
  const token = randtoken.uid(255);

  await RefreshToken.query().insertGraph({
    userId,
    token,
  });

  return token;
};

export default generateRefreshToken;
