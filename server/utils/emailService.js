const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  examReminder: (userName, examTitle, examDate, examTime) => ({
    subject: `📝 Exam Reminder: ${examTitle}`,
    text: `Hello ${userName},\n\nThis is a reminder that you have an exam scheduled:\n\nExam: ${examTitle}\nDate: ${examDate}\nTime: ${examTime}\n\nPlease make sure to log in to the examination system 10 minutes before the exam starts.\n\nGood luck!\n\nBest regards,\nOnline Examination System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📝 Exam Reminder</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>This is a reminder that you have an exam scheduled:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Exam:</strong> ${examTitle}</p>
          <p><strong>Date:</strong> ${examDate}</p>
          <p><strong>Time:</strong> ${examTime}</p>
        </div>
        <p>Please make sure to log in to the examination system 10 minutes before the exam starts.</p>
        <p style="color: #059669; font-weight: bold;">Good luck!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Online Examination System</p>
      </div>
    `
  }),

  examResult: (userName, examTitle, score, totalMarks, percentage, passed) => ({
    subject: `📊 Exam Result: ${examTitle}`,
    text: `Hello ${userName},\n\nYour exam result is now available:\n\nExam: ${examTitle}\nScore: ${score}/${totalMarks}\nPercentage: ${percentage}%\nStatus: ${passed ? 'PASSED' : 'FAILED'}\n\nYou can view detailed results by logging into the examination system.\n\nBest regards,\nOnline Examination System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📊 Exam Result</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Your exam result is now available:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Exam:</strong> ${examTitle}</p>
          <p><strong>Score:</strong> ${score}/${totalMarks}</p>
          <p><strong>Percentage:</strong> ${percentage}%</p>
          <p><strong>Status:</strong> <span style="color: ${passed ? '#059669' : '#dc2626'}; font-weight: bold;">${passed ? 'PASSED' : 'FAILED'}</span></p>
        </div>
        <p>You can view detailed results by logging into the examination system.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Online Examination System</p>
      </div>
    `
  }),

  welcomeEmail: (userName, role) => ({
    subject: `🎉 Welcome to Online Examination System`,
    text: `Hello ${userName},\n\nWelcome to the Online Examination System!\n\nYour account has been successfully created as a ${role}.\n\nYou can now log in to your dashboard and start using the system.\n\nBest regards,\nOnline Examination System Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🎉 Welcome to Online Examination System</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Welcome to the Online Examination System!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <p>Your account has been successfully created as a <strong>${role}</strong>.</p>
          <p>You can now log in to your dashboard and start using the system.</p>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Online Examination System Team</p>
      </div>
    `
  }),

  passwordReset: (userName, resetLink) => ({
    subject: `🔐 Password Reset Request`,
    text: `Hello ${userName},\n\nYou have requested a password reset for your account.\n\nClick the following link to reset your password:\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nOnline Examination System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🔐 Password Reset Request</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You have requested a password reset for your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #dc2626; font-size: 14px;">If you didn't request this reset, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>Online Examination System</p>
      </div>
    `
  })
};

// Specific email functions
const sendExamReminder = async (userEmail, userName, examTitle, examDate, examTime) => {
  const template = emailTemplates.examReminder(userName, examTitle, examDate, examTime);
  return await sendEmail(userEmail, template.subject, template.text, template.html);
};

const sendExamResult = async (userEmail, userName, examTitle, score, totalMarks, percentage, passed) => {
  const template = emailTemplates.examResult(userName, examTitle, score, totalMarks, percentage, passed);
  return await sendEmail(userEmail, template.subject, template.text, template.html);
};

const sendWelcomeEmail = async (userEmail, userName, role) => {
  const template = emailTemplates.welcomeEmail(userName, role);
  return await sendEmail(userEmail, template.subject, template.text, template.html);
};

const sendPasswordReset = async (userEmail, userName, resetLink) => {
  const template = emailTemplates.passwordReset(userName, resetLink);
  return await sendEmail(userEmail, template.subject, template.text, template.html);
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendExamReminder,
  sendExamResult,
  sendWelcomeEmail,
  sendPasswordReset,
  testEmailConfig,
  emailTemplates
}; 