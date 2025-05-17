const BASE_URL = 'https://wdp392-restapi-with-nodejs-express.onrender.com';

const API = {
  BASE_URL,
  LOGIN: `${BASE_URL}/api/auth`,
  REGISTER: `${BASE_URL}/api/users`,
  LOGIN_WITH_GOOGLE: `${BASE_URL}/api/auth/google`,
};

export default API;
