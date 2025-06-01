const BASE_URL = 'https://restapi-dna-testing-fwdnadcqc9hsfmbf.canadacentral-01.azurewebsites.net';

const API = {
  BASE_URL,
  LOGIN: `${BASE_URL}/api/auth`,
  REGISTER: `${BASE_URL}/api/users`,
  LOGIN_WITH_GOOGLE: `${BASE_URL}/api/auth/google`,
};

export default API;
