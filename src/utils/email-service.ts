import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import Mail from "nodemailer/lib/mailer";
import { IUser } from "../entities/user";

export default class EmailService {
  to: string;
  firstName: string;
  url: string;
  from: string;
  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Fitness admin - ${process.env.EMAIL_FROM}`;
  }

  newTransport(): Mail {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 0,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject: string, text: string) {
    const mailOptions: MailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "Welcome",
      `Dear ${this.firstName}, welcome to fitness app.`
    );
  }

  async sendPasswordReset() {
    await this.send(
      "Password reset",
      `Click on this link to reset your password.\n ${this.url} \n (Valid for 10 minutes.)`
    );
  }
}
