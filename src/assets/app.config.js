const BASE_URL = "https://apis-uat.mytelpay.com.mm:8000/fbb-onu";

export const SERVICE_URLS = {
  LOGIN: `${BASE_URL}/login/request`,
  CONFIRM_LOGIN: `${BASE_URL}/login/confirm`,
  STATISTIC: `${BASE_URL}/data/statistic`,
  GET_ALL_IMPORT_FILE: `${BASE_URL}/file`,
  IMPORT_FILE: `${BASE_URL}/file/import`,
  GET_CUSTOMERS: `${BASE_URL}/data/all`,
  GET_CUSTOMER_DETAIL: `${BASE_URL}/data`,
  GET_CUSTOMER_STATUS: `${BASE_URL}/data`,
};
