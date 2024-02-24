// HTTP REQUEST URL
export const BASE_URL_API = "https://api.gojekapi.com";
export const BASE_URL_GOID = "https://goid.gojekapi.com";
export const BASE_URL_CUSTOMER = "https://customer.gopayapi.com";
export const USER_AGENT = "okhttp/4.10.0";

// COUNTRY CODE
export const COUNTRY_CODE_PREFIX = "+62";
export const COUNTRY_CODE_ID = "ID";

// DEVICE INFO
export const X_PLATFORM = "Android";
export const X_UNIQUEID = "c6ad2e615cf54aa5";
export const X_APPVERSION = "4.74.3";
export const X_APPID = "com.gojek.app";
export const X_USER_TYPE = "customer";
export const X_DEVICE_OS = "Android,9";
export const X_PHONEMAKE = "samsung";
export const X_PHONEMODEL = "samsung,SM-S901N";
export const GOJEK_COUNTRY_CODE = "ID";

// CLIENT ID & SECRET
export const CLIENT_ID = "gojek:consumer:app";
export const CLIENT_SECRET = "pGwQ7oi8bKqqwvid09UrjqpkMEHklb";
export const CLIENT_ID_MFA = "6d11d261d7ae462dbd4be0dc5f36a697-MFAGOJEK";

// ENDPOINT
export const EP_LOGIN_REQUEST = BASE_URL_GOID + "/goid/login/request";
export const EP_VERIFY_OTP = BASE_URL_GOID + "/goid/token";
export const EP_VERIFY_MFA = BASE_URL_CUSTOMER + "/api/v1/users/pin/tokens";
export const EP_RESEND_OTP = BASE_URL_CUSTOMER + "/v2/otp/retry";
export const EP_PAYMENT_OPTIONS_BALANCES =
  BASE_URL_CUSTOMER + "/v1/payment-options/balances";
export const EP_USER_ORDER_HISTORY =
  BASE_URL_CUSTOMER + "/v1/users/order-history";
export const EP_CUSTOMER = BASE_URL_API + "/gojek/v2/customer";
export const EP_BANK_LIST = BASE_URL_CUSTOMER + "/v1/banks";
export const EP_VALIDATE_BANK =
  BASE_URL_CUSTOMER + "/v1/bank-accounts/validate";
export const EP_WITHDRAWALS = BASE_URL_CUSTOMER + "/v1/withdrawals";
export const EP_EXPLORE = BASE_URL_CUSTOMER + "/v1/explore";
export const EP_PAYMENTS_V1 = BASE_URL_CUSTOMER + "/customers/v1/payments";
export const EP_VALIDATE_P2P = BASE_URL_CUSTOMER + "/v1/users/p2p-profile";
export const EP_FUND_TRANSFER = BASE_URL_CUSTOMER + "/v1/funds/transfer";
export const EP_PAYMENT_OPTIONS =
  BASE_URL_CUSTOMER + "/v1/customer/payment-options";
export const EP_PIN_UPDATE = BASE_URL_CUSTOMER + "/v1/users/pin/update";

// CHALLENGES
export const CHALLENGES_PIN_2FA = "GoPay Pin 2FA";

// GRANT_TYPE
export const GRANT_TYPE_OTP = "otp";
export const GRANT_TYPE_PIN = "gopay_pin";

// CHANNEL TYPE
export const CHANNEL_TYPE_SMS = "sms";

// LOGIN TYPE
export const LOGIN_TYPE_PIN = "gopay_pin";
