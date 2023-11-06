// TokenManager.js
const TOKEN_KEY = 'accessToken';
const EXPIRATION_KEY = 'tokenExpirationTime';

export const TokenManager = {
  setToken: (token, expirationMinutes) => {
    localStorage.setItem(TOKEN_KEY, token);
    const expirationTime = new Date().getTime() + expirationMinutes * 60 * 1000;
    localStorage.setItem(EXPIRATION_KEY, expirationTime);
  },

  getToken: () => {
    const expirationTime = parseInt(localStorage.getItem(EXPIRATION_KEY), 10);
    if (expirationTime && expirationTime > Date.now()) {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      // Token is expired, remove it
      TokenManager.removeToken();
      return null;
    }
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
  },
};
