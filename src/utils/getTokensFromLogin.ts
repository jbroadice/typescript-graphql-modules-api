import * as bcrypt from "bcryptjs";
import generateTokenPair from "./generateTokenPair";
import { trim } from "lodash";
import { EmailAddress } from "@models";

const getTokensFromLogin = async ({ email, password }) => {
  if (!trim(email) || !trim(password)) {
    return null;
  }

  const userEmail = await EmailAddress.query()
    .eager("user")
    .findOne({ email, verified: "1" });

  if (userEmail) {
    const { user } = userEmail;

    if (user && (await bcrypt.compare(password, user.password))) {
      return generateTokenPair(user.uuid);
    }
  }

  return null;
};

export default getTokensFromLogin;
