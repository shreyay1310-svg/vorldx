require('dotenv').config();
const nodemailer = require('nodemailer');

let cachedTransporter = null;
let cachedIsEthereal = false;

async function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);

  // If user provided real SMTP credentials (e.g. Gmail App Password)
  if (user && pass) {
    const isGmail = user.toLowerCase().includes('@gmail.com') || host.includes('gmail');
    const transporter = isGmail
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass }
        })
      : nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        });

    return {
      transporter,
      isEthereal: false,
      fromAddress: `"VorldX Human Resources" <${user}>`
    };
  }

  // Cached fallback transporter
  if (cachedTransporter) {
    return {
      transporter: cachedTransporter,
      isEthereal: cachedIsEthereal,
      fromAddress: '"VorldX Human Resources" <hr@vorldx.com>'
    };
  }

  // Create Ethereal test account for offline/demo email delivery
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    cachedIsEthereal = true;
    return {
      transporter: cachedTransporter,
      isEthereal: true,
      fromAddress: '"VorldX Human Resources" <hr@vorldx.com>'
    };
  } catch (e) {
    console.warn('[Mailer] Could not create Ethereal account:', e.message);
    return null;
  }
}

/**
 * 1. Send OTP Verification Email to Employee
 */
async function sendOtpEmail({ to, name, id, designation, department, otp }) {
  const mailSetup = await getTransporter();
  const subject = `🔐 Your VorldX Verification OTP: ${otp} (${id})`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060b13; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 560px; margin: 0 auto; background: #0c1424; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
        .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 0.5px; }
        .header p { margin: 4px 0 0 0; font-size: 13px; color: #e0e7ff; }
        .body { padding: 28px 24px; }
        .otp-box { background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(99,102,241,0.15)); border: 2px dashed #0ea5e9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #38bdf8; margin: 0; }
        .otp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-top: 6px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); }
        .details-table td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .details-table td.label { color: #94a3b8; width: 40%; font-weight: 600; }
        .details-table td.value { color: #f8fafc; font-weight: 700; }
        .footer { background: #070c16; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>VorldX Technologies</h1>
          <p>Official Employee Onboarding Verification</p>
        </div>
        <div class="body">
          <p style="font-size: 15px; margin: 0 0 12px 0;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin: 0;">
            Aapko VorldX Technologies central HR portal par register kiya ja raha hai. Aapka account activate karne ke liye neeche diya gaya 6-digit verification code HR ko batayein ya enter karein:
          </p>

          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-label">6-Digit Verification Code (Valid for 15 minutes)</div>
          </div>

          <table class="details-table">
            <tr><td class="label">Employee Name:</td><td class="value">${name}</td></tr>
            <tr><td class="label">Employee ID:</td><td class="value" style="color:#38bdf8;">${id}</td></tr>
            <tr><td class="label">Designation:</td><td class="value">${designation}</td></tr>
            <tr><td class="label">Department:</td><td class="value">${department}</td></tr>
            <tr><td class="label">Registered Email:</td><td class="value">${to}</td></tr>
          </table>

          <p style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin: 16px 0 0 0;">
            ⚠️ Agar aapne is verification request ko initiate nahi kiya hai, toh kripya turant VorldX IT security team ko inform karein.
          </p>
        </div>
        <div class="footer">
          &copy; 2026 VorldX Technologies Pvt Ltd &bull; Corporate Headquarters, Lucknow &bull; All Rights Reserved
        </div>
      </div>
    </body>
    </html>
  `;

  if (!mailSetup || !mailSetup.transporter) {
    return {
      success: true,
      delivered: false,
      mode: 'SIMULATED',
      recipient: to,
      otp,
      subject,
      html,
      message: 'Email generated & recorded in database (Simulated mode)'
    };
  }

  try {
    const info = await mailSetup.transporter.sendMail({
      from: mailSetup.fromAddress,
      to,
      subject,
      text: `Hello ${name}, your VorldX verification OTP is: ${otp}. Employee ID: ${id}, Designation: ${designation}.`,
      html
    });

    const previewUrl = mailSetup.isEthereal ? nodemailer.getTestMessageUrl(info) : null;
    return {
      success: true,
      delivered: true,
      mode: mailSetup.isEthereal ? 'ETHEREAL_TEST' : 'SMTP_LIVE',
      messageId: info.messageId,
      previewUrl,
      recipient: to,
      otp,
      subject,
      html,
      message: mailSetup.isEthereal 
        ? `OTP mail sent to ${to} (Viewable at Ethereal live preview URL)`
        : `Official OTP mail sent directly to ${to} inbox!`
    };
  } catch (err) {
    console.warn('[Mailer] Error sending OTP mail:', err.message);
    return {
      success: true,
      delivered: false,
      mode: 'FALLBACK_SIMULATED',
      error: err.message,
      recipient: to,
      otp,
      subject,
      html,
      message: `OTP generated for ${to}: ${otp} (Local fallback delivery)`
    };
  }
}

/**
 * 2. Send Congratulations Welcome Email to Employee
 */
async function sendWelcomeEmail({ to, name, id, designation, department, shift, password }) {
  const mailSetup = await getTransporter();
  const subject = `🎉 Congratulations ${name}! You are officially part of VorldX Technologies!`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060b13; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background: #0c1424; border: 1px solid #10b981; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
        .header { background: linear-gradient(135deg, #10b981, #0ea5e9); padding: 26px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #ffffff; }
        .header p { margin: 4px 0 0 0; font-size: 13px; color: #ecfdf5; }
        .body { padding: 28px 24px; }
        .congrats-hero { background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(14,165,233,0.15)); border: 1px solid rgba(16,185,129,0.4); border-radius: 12px; padding: 18px; margin-bottom: 20px; }
        .congrats-title { font-size: 18px; font-weight: 800; color: #34d399; margin: 0 0 6px 0; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; background: rgba(255,255,255,0.02); border-radius: 10px; padding: 14px; border: 1px solid rgba(255,255,255,0.06); }
        .detail-item { font-size: 12px; }
        .detail-label { color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-val { color: #ffffff; font-weight: 700; font-size: 13px; margin-top: 2px; }
        .cred-box { background: rgba(0,0,0,0.4); border: 1px solid rgba(245,158,11,0.4); border-radius: 10px; padding: 14px; margin-top: 18px; }
        .footer { background: #070c16; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🎉 Welcome to VorldX Technologies!</h1>
          <p>Official Employment Confirmation & Portal Access</p>
        </div>
        <div class="body">
          <div class="congrats-hero">
            <div class="congrats-title">Congratulations ${name}! You are officially part of the company now!</div>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin: 0;">
              Hum aapka VorldX Technologies family mein swagat karte hain. Aapka verification complete ho chuka hai aur aapki details active employee directory mein officially record ho chuki hain.
            </p>
          </div>

          <div style="font-size: 11px; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            📋 Official Employment Profile:
          </div>
          <div class="details-grid">
            <div class="detail-item"><div class="detail-label">Employee Name</div><div class="detail-val">${name}</div></div>
            <div class="detail-item"><div class="detail-label">Employee ID</div><div class="detail-val" style="color:#38bdf8;">${id}</div></div>
            <div class="detail-item"><div class="detail-label">Designation</div><div class="detail-val" style="color:#c084fc;">${designation}</div></div>
            <div class="detail-item"><div class="detail-label">Department</div><div class="detail-val">${department}</div></div>
            <div class="detail-item"><div class="detail-label">Registered Email</div><div class="detail-val">${to}</div></div>
            <div class="detail-item"><div class="detail-label">Work Shift</div><div class="detail-val">${shift || 'General (09:00 AM - 06:00 PM)'}</div></div>
          </div>

          <div class="cred-box">
            <div style="font-size: 11px; color: #f59e0b; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">
              🔒 Portal Login Credentials:
            </div>
            <div style="font-size: 12px; color: #cbd5e1;">
              <strong>Login Portal URL:</strong> http://localhost:5173/?tab=employee<br>
              <strong>Email:</strong> ${to}<br>
              <strong>Password:</strong> <code style="color:#fbbf24; font-weight: 800;">${password}</code>
            </div>
          </div>
        </div>
        <div class="footer">
          VorldX Technologies Human Resources &bull; hr@vorldx.com &bull; Lucknow HQ
        </div>
      </div>
    </body>
    </html>
  `;

  if (!mailSetup || !mailSetup.transporter) {
    return { success: true, delivered: false, recipient: to, subject, html };
  }

  try {
    const info = await mailSetup.transporter.sendMail({
      from: mailSetup.fromAddress,
      to,
      subject,
      text: `Congratulations ${name}! You are officially part of VorldX Technologies! Employee ID: ${id}, Designation: ${designation}.`,
      html
    });
    const previewUrl = mailSetup.isEthereal ? nodemailer.getTestMessageUrl(info) : null;
    return {
      success: true,
      delivered: true,
      messageId: info.messageId,
      previewUrl,
      recipient: to,
      subject,
      html
    };
  } catch (err) {
    console.warn('[Mailer] Error sending welcome mail:', err.message);
    return { success: true, delivered: false, recipient: to, subject, html, error: err.message };
  }
}

async function verifySmtpCredentials(user, pass) {
  const cleanUser = user.trim();
  const cleanPass = pass.trim().replace(/\s+/g, '');
  const isGmail = cleanUser.toLowerCase().includes('@gmail.com');
  const transporter = isGmail
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: cleanUser, pass: cleanPass }
      })
    : nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: true,
        auth: { user: cleanUser, pass: cleanPass },
        tls: { rejectUnauthorized: false }
      });

  await transporter.verify();
  return true;
}

function setSmtpCredentials(user, pass) {
  process.env.SMTP_USER = user.trim();
  process.env.SMTP_PASS = pass.trim().replace(/\s+/g, '');
  cachedTransporter = null;
  cachedIsEthereal = false;
}

module.exports = {
  getTransporter,
  sendOtpEmail,
  sendWelcomeEmail,
  verifySmtpCredentials,
  setSmtpCredentials
};
