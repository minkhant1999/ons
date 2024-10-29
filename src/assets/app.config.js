const BASE_URL = "http://45.76.158.94:8000/gift-life";
// const BASE_URL = "https://apis.giftlifecorp.com/gift-life";

export const SERVICE_URLS = {
  UPLOAD_IMAGE: `${BASE_URL}/content/api/v1/cms/image/upload`,
  LOGIN: `${BASE_URL}/account/cms/login`,
  SEARCH_BANNER: `${BASE_URL}/content/api/v1/cms/banner/search`,
  NEWS_SEARCH: `${BASE_URL}/content/api/v1/cms/news/search`,
  NEWS_CREATE: `${BASE_URL}/content/api/v1/cms/news/create`,
  NEWS_DETAIL: `${BASE_URL}/content/api/v1/cms/news/view`,
  NEWS_UPDATE: `${BASE_URL}/content/api/v1/cms/news/update`,
  NEWS_STATUS: `${BASE_URL}/content/api/v1/cms/news/change-status`,
  CUSTOMER_SEARCH: `${BASE_URL}/account/cms/customer/search`,
  CUSTOMER_CREATE: `${BASE_URL}/account/cms/customer`,
  CUSTOMER_DETAIL: `${BASE_URL}/account/cms/customer`,
  CREATE_BANNER: `${BASE_URL}/content/api/v1/cms/banner/create`,
  UPDATE_BANNER: `${BASE_URL}/content/api/v1/cms/banner/update`,
  BANNER_CHANGE_STATUS: `${BASE_URL}/content/api/v1/cms/banner/change-status`,
  LIST_PERMISSION: `${BASE_URL}/account/cms/role/permission`,
  LIST_ROLE: `${BASE_URL}/account/cms/role/list`,
  CREATE_ROLE: `${BASE_URL}/account/cms/role`,
  DELETE_ROLE: `${BASE_URL}/account/cms/role/`,
  GET_NOTI_ICON: `${BASE_URL}/notification/v1/cms/icons/active`,
  ICON_MESSAGE_TYPE: `${BASE_URL}/notification/v1/cms/messages/types`,
  UPDATE_ICON: `${BASE_URL}/notification/v1/cms/icons`,
  HISTORY_NOTI: `${BASE_URL}/notification/v1/cms/messages`,
  ACCOUNT_SEARCH: `${BASE_URL}/account/cms/admin-account/search`,
  ACCOUNT_CREATE: `${BASE_URL}/account/cms/admin-account`,
  ACCOUNT_DELETE: `${BASE_URL}/account/cms/admin-account/`,
  SEARCH_PACKAGE: `${BASE_URL}/content/api/v1/cms/package/search`,
  PACKAGE_CHANGE_STATUS: `${BASE_URL}/content/api/v1/cms/package/change-status`,
  GET_DETAIL_PACKAGE: `${BASE_URL}/content/api/v1/cms/package/view`,
  GET_ADMIN_ACCOUNT_DROPDOWN: `${BASE_URL}/account/cms/admin-account/status`,
  ADMIN_ACCOUNT_STATUS: `${BASE_URL}/account/cms/admin-account/`,
  CONTACT_LIST: `${BASE_URL}/account/cms/feedback/contact`,
  CONTACT_LIST_DELETE: `${BASE_URL}/account/cms/feedback/`,
  FEEDBACK_SEARCH_LIST: `${BASE_URL}/account/cms/feedback/search`,
  LIST_CONTRACT_SEARCH: `${BASE_URL}/content/api/v1/cms/contract/request/search`,
  LIST_CONTRACT_DETAIL: `${BASE_URL}/content/api/v1/cms/contract/request/view`,
  LIST_CONTRACT_EDIT: `${BASE_URL}/content/api/v1/cms/contract/request/edit`,
  LIST_CONTRACT_STATUS_CHANGE: `${BASE_URL}/content/api/v1/cms/contract/request/change-status`,
  ALL_ADMIN_ACCOUNT: `${BASE_URL}/account/cms/admin-account/all`,
  FEEDBACK_NOTE: `${BASE_URL}/account/cms/feedback/`,
  FEEDBACK_STATUS: `${BASE_URL}/account/cms/feedback/status`,
  FEEDBACK_DOWNLOAD: `${BASE_URL}/account/cms/feedback/export`,
  CREATE_PACKAGE: `${BASE_URL}/content/api/v1/cms/package/create`,
  UPDATE_PACKAGE: `${BASE_URL}/content/api/v1/cms/package/update`,
  CAMPAIGN: `${BASE_URL}/notification/v1/cms/campaigns`,
  SEARCH_LIST: `${BASE_URL}/content/api/v1/cms/contract/search`,
  CHANGE_STATUS_LIST: `${BASE_URL}/content/api/v1/cms/contract/change-status`,
  CONTRACT_CREATE: `${BASE_URL}/content/api/v1/cms/contract/create`,
  DETAIL_CONTRACT: `${BASE_URL}/content/api/v1/cms/contract/view`,
  ALL_PACKAGE: `${BASE_URL}/content/api/v1/cms/package/active-packages`,
  UPDATE_CONTRACT: `${BASE_URL}/content/api/v1/cms/contract/update`,
  NOTI_STATUS: `${BASE_URL}/notification/v1/cms/campaigns/status`,
  EXPORT_USER: `${BASE_URL}/account/cms/customer/export`,
  USER_STATUS: `${BASE_URL}/account/cms/customer`,
  GET_MESSAGE_TEMPLATE: `${BASE_URL}/notification/v1/cms/message-templates`,
  TEMPLATE_STATUS: `${BASE_URL}/notification/v1/cms/message-templates/status`,
  ALL_CUSTOMER: `${BASE_URL}/account/cms/customer/search`,
  ADMIN_ACC_DETAIL: `${BASE_URL}/account/cms/admin-account/`,
  EXPORT_CONTRACT: `${BASE_URL}/content/api/v1/cms/contract/export`,
  NOTI_EXCEL: `${BASE_URL}/notification/v1/cms/campaigns/files/export`,
  CHANGE_PASSWORD: `${BASE_URL}/account/cms/admin-account/passwd`,
  ROLE_DETAIL: `${BASE_URL}/account/cms/role/`,
  ROLE_EDIT: `${BASE_URL}/account/cms/role/`,
  EXCEL: `${BASE_URL}/notification/v1/cms/campaigns/files/template`,
  SHOW_INTEREST: `${BASE_URL}/content/api/v1/cms/contract/show-list-interest-payment`,
  DEEP_LINK: `${BASE_URL}/content/api/v1/cms/common/deeplink`,
  GET_ROUTETYPE: `${BASE_URL}/notification/v1/cms/route-types`,
  UPDATE_CUSTOMER: `${BASE_URL}/account/cms/customer`,
};
