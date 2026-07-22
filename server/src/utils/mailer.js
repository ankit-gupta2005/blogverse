const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  sendMail: async ({ to, subject, html, text }) => {
    return await resend.emails.send({
      from: 'BlogVerse <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html || `<p>${text}</p>`,
    });
  },
};

module.exports = transporter;
