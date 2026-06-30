import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'test@ethereal.email',
        pass: process.env.SMTP_PASS || 'testpass'
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: '"Appointment Booking System" <no-reply@appointmentsystem.com>',
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Failed to send email to ${to}`, error);
        // We do not throw error here to avoid crashing the app if email fails
    }
};

export const sendBookingConfirmationEmail = (email, details) => {
    return sendEmail(email, 'Booking Confirmed', `Your booking for ${details.serviceName} is confirmed for ${new Date(details.startTime).toLocaleString()}.`);
};

export const sendBookingCancellationEmail = (email, details) => {
    return sendEmail(email, 'Booking Cancelled', `Your booking for ${details.serviceName} on ${new Date(details.startTime).toLocaleString()} has been cancelled.`);
};

export const sendBookingRejectedEmail = (email, details) => {
    return sendEmail(email, 'Booking Rejected', `Unfortunately, your booking for ${details.serviceName} on ${new Date(details.startTime).toLocaleString()} has been rejected by the provider.`);
};

export const sendBookingRescheduledEmail = (email, details) => {
    return sendEmail(email, 'Booking Rescheduled', `Your booking for ${details.serviceName} has been rescheduled to ${new Date(details.startTime).toLocaleString()}.`);
};

export const sendPasswordResetEmail = (email, token) => {
    // In a real app, this would be a link to the frontend
    return sendEmail(email, 'Password Reset Request', `You requested a password reset. Use this token to reset your password: ${token}\n\nIf you did not request this, please ignore this email.`);
};
