const getTokenFromHeaders = (headers) => {
  if (!headers.authorization) {
    return null;
  }

  const headerMatch = headers.authorization.match(/^Bearer\s+?(.+?)\s*$/);

  if (!headerMatch) {
    return null;
  }

  return headerMatch[1];
};

export default getTokenFromHeaders;
