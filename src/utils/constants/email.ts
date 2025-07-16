// OTP Email HTML template for sending styled OTP emails
export const OTP_EMAIL_TEMPLATE = ({ name, email, otp }: { name?: string; email: string; otp: string }) => `
  <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px 0;">
    <div style="max-width: 400px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 32px 24px;">
      <h2 style="color: #2d3748; text-align: center; margin-bottom: 16px;">Expense Tracker Login</h2>
      <p style="color: #4a5568; font-size: 16px; text-align: center;">Hello <b>${name || email}</b>,</p>
      <p style="color: #4a5568; font-size: 16px; text-align: center;">Use the following OTP to log in to your account:</p>
      <div style="margin: 24px 0; text-align: center;">
        <span style="display: inline-block; background: #edf2f7; color: #2b6cb0; font-size: 32px; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; font-weight: bold; border: 2px dashed #2b6cb0;">${otp}</span>
      </div>
      <p style="color: #718096; font-size: 14px; text-align: center;">This OTP is valid for a short time. Please do not share it with anyone.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
      <p style="color: #a0aec0; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
    </div>
  </div>
`; 