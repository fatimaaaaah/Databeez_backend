import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const smtpHost = this.configService.get<string>(
      'SMTP_HOST',
      'smtp.gmail.com',
    );
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    this.logger.log(`Email transporter configured for ${smtpHost}:${smtpPort}`);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { to, subject, template, context } = options;

      const html = await this.compileTemplate(template, context);
      const emailFrom = this.configService.get<string>(
        'EMAIL_FROM',
        'noreply@databeez.africa',
      );

      const mailOptions = {
        from: emailFrom,
        to,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email envoyé avec succès à ${to}. MessageId: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'envoi de l'email à ${options.to}:`,
        error,
      );
      throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
    }
  }

  async sendOtpEmail(
    email: string,
    code: string,
    type: 'verification' | 'reset' | 'login',
  ): Promise<void> {
    const subjects = {
      verification: 'Vérification de votre compte Databeez',
      reset: 'Réinitialisation de votre mot de passe Databeez',
      login: 'Code de connexion Databeez',
    };

    const templates = {
      verification: 'otp-verification',
      reset: 'otp-password-reset',
      login: 'otp-login',
    };

    const expiryMinutes = this.configService.get<number>(
      'OTP_EXPIRY_MINUTES',
      10,
    );

    await this.sendEmail({
      to: email,
      subject: subjects[type],
      template: templates[type],
      context: {
        otpCode: code,
        expiryMinutes,
        email,
        platformName: 'Databeez',
        supportEmail: 'support@databeez.africa',
      },
    });
  }

  private async compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    try {
      const templatePath = path.join(
        __dirname,
        'templates',
        `${templateName}.hbs`,
      );

      if (!fs.existsSync(templatePath)) {
        this.logger.warn(
          `Template ${templateName} introuvable, utilisation du template par défaut`,
        );
        return this.getDefaultTemplate(context);
      }

      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      return template(context);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la compilation du template ${templateName}:`,
        error,
      );
      return this.getDefaultTemplate(context);
    }
  }

  private getDefaultTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Code de vérification Databeez</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Databeez</h1>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
          <h2 style="color: #334155; margin-bottom: 20px;">Code de vérification</h2>
          <p style="color: #64748b; margin-bottom: 20px;">
            Votre code de vérification est :
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; background-color: #eff6ff; padding: 15px 25px; border-radius: 8px; letter-spacing: 5px;">
              ${context.otpCode}
            </span>
          </div>
          <p style="color: #64748b; margin-bottom: 10px;">
            Ce code expire dans ${context.expiryMinutes} minutes.
          </p>
          <p style="color: #64748b; font-size: 14px;">
            Si vous n'avez pas demandé ce code, ignorez cet email.
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p>© 2024 Databeez - Plateforme de mentorat professionnel</p>
        </div>
      </body>
      </html>
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Connexion SMTP vérifiée avec succès');
      return true;
    } catch (error) {
      this.logger.error('Erreur de connexion SMTP:', error);
      return false;
    }
  }
}
