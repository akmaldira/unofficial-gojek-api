# Getting Started

Install package

- yarn

```bash
yarn add unofficial-gojek-api
```

- npm

```bash
npm install unofficial-gojek-api
```

## Example

```bash
import fs from "fs";
import readline from "readline";
import GojekAPI from "unofficial-gojek-api";
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query: any) =>
  new Promise((resolve) => rl.question(query, resolve));

// You need to store your phone number and pin (this example, i store on .env)
const phone = process.env.PHONE;
const pin = process.env.PIN;

if (!phone || !pin) {
  throw new Error("Phone number or pin is required on environment variable");
}

// Create storage to save access token and refresh token
if (!fs.existsSync("./account.json")) {
  fs.writeFileSync(
    "./account.json",
    JSON.stringify({
      accessToken: null,
      refreshToken: null,
    })
  );
}

const account = JSON.parse(fs.readFileSync("./account.json").toString()) as {
  accessToken: string | null;
  refreshToken: string | null;
};

(async () => {
  try {
    const gojek = new GojekAPI();
    if (!account.accessToken) {
      const login = await gojek.login(phone);
      if (!login.success) {
        throw login;
      }

      const otpInput = (await prompt("OTP code: ")) as string;

      const accessToken = await gojek
        .verifyOTP(otpInput, login.data.otp_token)
        .catch(async (err: any) => {
          if (
            err.errors[0].code ===
            "mfa:customer_send_challenge:challenge_required"
          ) {
            const challengeId =
              err.errors[0].details.challenges[0].gopay_challenge_id;
            const challengeToken = err.errors[0].details.challenge_token;

            const challenge = await gojek.verifyMFA(challengeId, pin);

            if (challenge.success) {
              const accessToken = await gojek.verifyMFAToken(
                challengeToken,
                challenge.data.token
              );
              return accessToken;
            } else {
              throw challenge;
            }
          } else {
            throw err;
          }
        });

      fs.writeFileSync(
        "./account.json",
        JSON.stringify({
          ...account,
          accessToken: accessToken.access_token,
          refreshToken: accessToken.refresh_token,
        })
      );

      gojek.setToken(accessToken.access_token);
    } else {
      gojek.setToken(account.accessToken);
      const token = await gojek.relogin(phone, pin);
      const { access_token, refresh_token } = token;
      fs.writeFileSync(
        "./account.json",
        JSON.stringify({
          ...account,
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      );
      gojek.setToken(access_token);
    }

    const balance = await gojek.getBalance();

    if (!balance.success) {
      throw balance;
    }
    balance.data.map((item: any) =>
      console.log(
        `[${item.type}] ${item.balance.currency === "IDR" ? "Rp" : ""}${
          item.balance.value
        }`
      )
    );

    process.exit(0);
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
})();

```
