import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<void> {
    // In a real application, you would send an actual email here
    // For development purposes, we'll just log the information
    
    console.log('=== PASSWORD RESET EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('============================');
    
    // Example email template:
    const emailContent = `
      Hello,
      
      You have requested to reset your password. Please click the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you did not request this password reset, please ignore this email.
      
      Best regards,
      Invoice Management System
    `;
    
    console.log('Email Content:', emailContent);
    
    // In production, you would use a service like SendGrid, Mailgun, or AWS SES
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: email,
    //   from: process.env.FROM_EMAIL,
    //   subject: 'Password Reset Request',
    //   text: emailContent,
    //   html: emailContent.replace(/\n/g, '<br>'),
    // });
  }
} 