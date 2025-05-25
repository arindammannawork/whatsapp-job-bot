import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
if (!accountSid || !authToken) {
  console.log(accountSid);
  console.log(authToken);

  throw new Error("Twilio credentials are missing");
}

const twilioClient = new Twilio(accountSid, authToken);

export default twilioClient;
