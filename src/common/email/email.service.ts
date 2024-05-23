import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class EmailService {
  constructor(private readonly appConfigService: AppConfigService) {}

  protected replacePlaceholders(
    template: string,
    replacements: { [key: string]: string },
  ): string {
    return template.replace(/{{(\w+)}}/g, (_, key) => replacements[key] || '');
  }

  async sendVerificationEmail(
    email: string,
    template: any,
    replacements: { [key: string]: string },
  ): Promise<void> {
    const subject = this.replacePlaceholders(template.subject, replacements);
    const body = this.replacePlaceholders(template.body, replacements);

    const info = await this.appConfigService.transPorter.sendMail({
      from: 'noreply@gmail.com', // Mailtrap에서 허용된 도메인으로 설정
      to: email,
      subject: subject,
      text: body,
    });
    console.log('Message sent: %s', info.messageId);
  }
}
