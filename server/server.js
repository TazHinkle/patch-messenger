require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioPhone = process.env.TWILIO_PHONE_OUT
const Koa = require('koa')

const app = new Koa()



app.listen(3000, () => {
    console.log('server started on port 3000')
})