import { Router } from "express";
import * as jwt from "jsonwebtoken";
import getTokensFromLogin from "@utils/getTokensFromLogin";
import generateTokenPair from "@utils/generateTokenPair";
import getTokenFromHeaders from "@utils/getTokenFromHeaders";
import { RefreshToken } from "@models";
import { trim } from "lodash";

const router = Router();

router.post("/signin", async (req, res) => {
  const tokens = await getTokensFromLogin(req.body);

  if (!tokens) {
    res.status(401);
  }

  res.send({ tokens });
});

router.post("/refresh", async (req, res) => {
  const authFail = () => res.status(401).send({ tokens: null });

  const token = getTokenFromHeaders(req.headers);
  const { refreshToken } = req.body;

  if (!trim(token) || !trim(refreshToken)) {
    return authFail();
  }

  const jwtDecode = jwt.decode(token);

  if (!jwtDecode) {
    return authFail();
  }

  const { id: userId } = jwtDecode;

  if (!trim(userId)) {
    return authFail();
  }

  const refreshTokenOld = await RefreshToken.query()
    .eager("user")
    .whereRaw("`tokens`.`created_at` > DATE_SUB(NOW(), INTERVAL 12 HOUR)")
    .findOne({
      token: refreshToken,
      blacklisted: false,
    });

  if (
    !refreshTokenOld ||
    !refreshTokenOld.user ||
    refreshTokenOld.user.uuid !== userId
  ) {
    return authFail();
  }

  await refreshTokenOld.$query().patch({ blacklisted: true });

  return res.send(await generateTokenPair(userId));
});

export default router;
