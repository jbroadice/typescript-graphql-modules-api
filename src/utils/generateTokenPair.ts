import generateJwtToken from "./generateJwtToken";
import generateRefreshToken from "./generateRefreshToken";

const generateTokenPair = async (userId: string) => ({
  token: generateJwtToken(userId),
  refreshToken: await generateRefreshToken(userId),
});

export default generateTokenPair;
