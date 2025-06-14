const BASE_URL = 'https://restapi-dna-testing-fwdnadcqc9hsfmbf.canadacentral-01.azurewebsites.net';

const API = {
  BASE_URL,
  LOGIN: `${BASE_URL}/api/auth`,
  REGISTER: `${BASE_URL}/api/users`,
  LOGIN_WITH_GOOGLE: `${BASE_URL}/api/auth/google`,
  FETCH_SERVICES: `${BASE_URL}/api/service/search`,
  FETCH_SERVICE_BY_ID: (id) => `${BASE_URL}/api/service/${id}`,
  FETCH_CHILD_SERVICES: (id) => `${BASE_URL}/api/service/${id}/child`,
};

export default API;
