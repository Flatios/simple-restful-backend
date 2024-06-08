import nodemailer from 'nodemailer';

export interface mailInterface {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const config = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  defaults: { from: 'Flatios Email System <noreply@flatios.com>' },
};

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (!transporter) {
    transporter = nodemailer.createTransport(config);
    try {
      await transporter.verify();
      console.log('Mail connection successful');
    } catch (error) {
      console.error('Mail connection error:', error);
      throw error;
    }
  }
  return transporter;
}

export async function sendMail(data: mailInterface) {
  const mailOptions: mailInterface = { ...config.defaults, ...data };
  try {
    const result = await (await getTransporter()).sendMail(mailOptions);
    return {
      messageId: result.messageId,
      to: result.envelope.to?.[0] ?? '',
    }; 
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}