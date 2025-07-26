// const BASE_URL = 'https://restapi-dna-testing-fwdnadcqc9hsfmbf.canadacentral-01.azurewebsites.net';
// const BASE_URL = "https://restapi-dnatesting.vercel.app";
const BASE_URL = "https://restapi-dnatesting.up.railway.app";

const API = {
  BASE_URL,
  LOGIN: `${BASE_URL}/api/auth`,
  REGISTER: `${BASE_URL}/api/users`,
  LOGIN_WITH_GOOGLE: `${BASE_URL}/api/auth/google`,

  //Service endpoint
  FETCH_SERVICES: `${BASE_URL}/api/service/search`,
  FETCH_SERVICE_BY_ID: (id) => `${BASE_URL}/api/service/${id}`,
  FETCH_CHILD_SERVICES: (id) => `${BASE_URL}/api/service/${id}/child`,

  //Apponitment endpoints
  CREATE_APPOINTMENT: `${BASE_URL}/api/appointment/create`,
  FETCH_APPOINTMENT: `${BASE_URL}/api/appointment/search`,
  FETCH_APPOINTMENT_BY_ID: (id) => `${BASE_URL}/api/appointment/${id}`,
  FETCH_AVAILABLE_SLOTS: `${BASE_URL}/api/slot/available`,

  // Sample endpoints
  ADD_SAMPLES_TO_APPOINTMENT: `${BASE_URL}/api/sample/add-to-appointment`,
  FETCH_SAMPLES_BY_APPOINTMENT: (id) =>`${BASE_URL}/api/sample/appointment/${id}`,
  BATCH_SUBMIT_SAMPLES: `${BASE_URL}/api/sample/batch-submit`,
  UPLOAD_SAMPLE_PERSON_IMAGE: `${BASE_URL}/api/sample/upload-person-image`,
  FETCH_SAMPLE_BY_ID: (id) => `${BASE_URL}/api/sample/${id}`,

  // Payment endpoints
  CREATE_PAYMENT_INTENT: `${BASE_URL}/api/payments/appointment`,
  VERIFY_PAYMENT: `${BASE_URL}/api/payments`,
  CANCEL_PAYMENT: `${BASE_URL}/api/payments`,

  //Blog endpoints
  SEARCH_BLOGS: `${BASE_URL}/api/blog/search`,
  GET_BLOG_BY_SLUG: (slug) => `${BASE_URL}/api/blog/slug/${slug}`,
};

export default API;
