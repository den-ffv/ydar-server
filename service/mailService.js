import nodemailer from "nodemailer";
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.PMTP_HOST,
      port: process.env.PMTP_PORT,
      secure: false,
      auth: {
        user: process.env.PMTP_USER,
        pass: process.env.PMTP_PESSWORD,
      },
    });
  }

  async sendActivationMain(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.PMTP_USER,
        to: to,
        subject: "Activation of the account",
        test: "Hello world!!!",
        html: `
                <div>
                    <h1>Pull on a poselan</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
      });
    } catch (err) {
        console.error(err)

    }
  }
}

export default new MailService();
