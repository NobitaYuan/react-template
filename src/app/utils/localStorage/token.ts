export const userTokenKey = 'userToken';

export const refreshTokenKey = 'refreshToken';

export const userInfoKey = 'userInfo';

const setToken = (value: string) => {
  localStorage.setItem(userTokenKey, value);
};

const getToken = () => {
  return localStorage.getItem(userTokenKey);
};

const setRefreshToken = (value: string) => {
  localStorage.setItem(refreshTokenKey, value);
};

const getRefreshToken = () => {
  return localStorage.getItem(refreshTokenKey);
};

const clearUserToken = () => {
  localStorage.removeItem(userTokenKey);
};

const clearRefreshToken = () => {
  localStorage.removeItem(refreshTokenKey);
};

const clearAllLocalStorage = () => {
  localStorage.clear();
};

/** 获取 Authorization header 对象，未登录时返回空对象 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export {
  setToken,
  getToken,
  setRefreshToken,
  getRefreshToken,
  clearUserToken,
  clearRefreshToken,
  clearAllLocalStorage,
};
