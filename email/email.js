import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const CLIENT_ID = '571089471111-jldn6ivl6ue7hadgk6s1pdbg2qkfvt0p.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//042vA_rtRDRk3CgYIARAAGAQSNwF-L9Ir0ZN6QD_GMy3DA48gJxtTOjuBZ-ZygnPtwySx_vULq_NBI5pkWtwb7MwqotmpvKhf9MQ';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken()
      
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'checerovitch@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.accessToken
        }
      })

      const mailOptions = {
        from: 'Checerovitch <checerovitch@gmail.com>',
        to: 'cischass@gmail.com',
        subject: "Hello from gmail using api",
        text: "Hello from gmail using api",
        html: '<h1>"Hello from gmail using api"</h1>',
      };

      const result = await transport.sendMail(mailOptions)
      return result
    }   catch (error) {
        return error
    }
}
sendMail().then(result=> console.log('Correo enviado', result))
.catch(error => console.log(error.message));

export default sendMail;



