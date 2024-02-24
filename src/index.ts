import axios, { Method } from "axios";
import {
  CHALLENGES_PIN_2FA,
  CHANNEL_TYPE_SMS,
  CLIENT_ID,
  CLIENT_ID_MFA,
  CLIENT_SECRET,
  COUNTRY_CODE_ID,
  COUNTRY_CODE_PREFIX,
  EP_BANK_LIST,
  EP_CUSTOMER,
  EP_EXPLORE,
  EP_LOGIN_REQUEST,
  EP_PAYMENT_OPTIONS_BALANCES,
  EP_PIN_UPDATE,
  EP_RESEND_OTP,
  EP_USER_ORDER_HISTORY,
  EP_VALIDATE_P2P,
  EP_VERIFY_MFA,
  EP_VERIFY_OTP,
  GOJEK_COUNTRY_CODE,
  GRANT_TYPE_OTP,
  GRANT_TYPE_PIN,
  LOGIN_TYPE_PIN,
  USER_AGENT,
  X_APPID,
  X_APPVERSION,
  X_DEVICE_OS,
  X_PHONEMAKE,
  X_PHONEMODEL,
  X_PLATFORM,
  X_UNIQUEID,
  X_USER_TYPE,
} from "./utils/const";

class GojekAPI {
  private headers: { [key: string]: any } = {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
    "X-Platform": X_PLATFORM,
    "X-Uniqueid": X_UNIQUEID,
    "X-Appversion": X_APPVERSION,
    "X-Appid": X_APPID,
    "X-User-Type": X_USER_TYPE,
    "X-Deviceos": X_DEVICE_OS,
    "X-Phonemake": X_PHONEMAKE,
    "X-Phonemodel": X_PHONEMODEL,
    "Gojek-Country-Code": GOJEK_COUNTRY_CODE,
  };

  constructor(token = "") {
    if (token) {
      this.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  public setToken(token: string) {
    this.headers["Authorization"] = `Bearer ${token}`;
  }

  public async request(method: Method, url: string, data?: any, headers?: any) {
    return new Promise((resolve, reject) => {
      axios({
        method,
        url,
        data,
        headers: headers
          ? {
              ...this.headers,
              ...headers,
            }
          : this.headers,
      })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  }

  public async login(phone: string): Promise<any> {
    const body = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      country_code: COUNTRY_CODE_PREFIX,
      login_type: "",
      magic_link_ref: "",
      phone_number: phone,
    };

    return await this.request("POST", EP_LOGIN_REQUEST, body);
  }

  public async relogin(phone: string, pin: string) {
    const body = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      country_code: COUNTRY_CODE_PREFIX,
      login_type: LOGIN_TYPE_PIN,
      phone_number: phone,
    };
    try {
      const challenge = await fetch(EP_LOGIN_REQUEST, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });

      const challengeJson = await challenge.json();

      if (!challengeJson.success) {
        throw challengeJson;
      }

      const challengeToken = await fetch(EP_VERIFY_MFA, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          challenge_id: challengeJson.data.gopay_challenge_id,
          client_id: CLIENT_ID_MFA,
          pin: pin,
        }),
      });

      const challengeTokenJson = await challengeToken.json();

      if (!challengeTokenJson.success) {
        throw challengeTokenJson;
      }

      const token = await fetch(EP_VERIFY_OTP, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          data: {
            gopay_challenge_id: challengeJson.data.gopay_challenge_id,
            gopay_jwt_value: challengeTokenJson.data.token,
          },
          grant_type: GRANT_TYPE_PIN,
          scopes: [],
        }),
      });

      const tokenJson = await token.json();
      return tokenJson;
    } catch (error) {
      throw error;
    }
  }

  public async verifyOTP(otp: string, otpToken: string): Promise<any> {
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      data: {
        otp: otp,
        otp_token: otpToken,
      },
      grant_type: GRANT_TYPE_OTP,
      scopes: [],
    };

    return await this.request("POST", EP_VERIFY_OTP, data);
  }

  public async verifyMFA(challengeId: string, pin: string): Promise<any> {
    const data = {
      challenge_id: challengeId,
      client_id: CLIENT_ID_MFA,
      pin: pin,
    };

    return await this.request("POST", EP_VERIFY_MFA, data);
  }

  public async verifyMFAToken(
    challengeToken: string,
    token: string
  ): Promise<any> {
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      data: {
        challenge_token: challengeToken,
        challenges: [
          {
            name: CHALLENGES_PIN_2FA,
            value: token,
          },
        ],
      },
      grant_type: "challenge",
      scopes: [],
    };

    return await this.request("POST", EP_VERIFY_OTP, data);
  }

  public async resendOTP(otpToken: string) {
    const data = {
      channel_type: CHANNEL_TYPE_SMS,
      otp_token: otpToken,
    };

    return await this.request("POST", EP_RESEND_OTP, data);
  }

  public async getProfile(): Promise<any> {
    return await this.request("GET", EP_CUSTOMER);
  }

  public async getBalance(): Promise<any> {
    return await this.request("GET", EP_PAYMENT_OPTIONS_BALANCES);
  }

  public async getTransactionHistory(
    page = 1,
    limit = 10,
    startDate = "",
    endDate = ""
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      lower_bound: startDate ? startDate + "T00:00:00" : "",
      upper_bound: endDate ? endDate + "T00:00:00" : "",
      country_code: COUNTRY_CODE_ID,
    });

    return await this.request("GET", EP_USER_ORDER_HISTORY + "?" + params);
  }

  public async getBankList(): Promise<any> {
    const params = new URLSearchParams({
      type: "transfer",
      show_withdrawal_block_status: "false",
    });
    return await this.request("GET", EP_BANK_LIST + "?" + params);
  }

  public async validateBankAccount(bankCode: string, accountNumber: string) {
    const params = new URLSearchParams({
      bank_code: bankCode,
      account_number: accountNumber,
    });

    return await this.request("GET", EP_BANK_LIST + "?" + params);
  }

  public async validateP2PProfile(phoneNumber: string) {
    const params = new URLSearchParams({
      phone_number: phoneNumber,
    });

    return await this.request("GET", EP_VALIDATE_P2P + "?" + params);
  }

  public async validateQRCode(qrData: unknown) {
    const data = {
      data: qrData,
      type: "QR_CODE",
    };

    return await this.request("POST", EP_EXPLORE, data);
  }

  public async updatePIN(oldPin: string, newPin: string) {
    const data = {
      new_pin: newPin,
    };

    return await this.request("PUT", EP_PIN_UPDATE, data, { Pin: oldPin });
  }
}

export default GojekAPI;
