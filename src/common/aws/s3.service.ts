import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadFile(fileName: string, fileContent: Buffer): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileContent,
    };

    try {
      const data = await this.s3.upload(params).promise();
      this.logger.log(`File uploaded successfully. ${data.Location}`);
      return data.Location;
    } catch (error) {
      this.logger.error(`File upload failed. ${error.message}`);
      throw new Error(`File upload failed. ${error.message}`);
    }
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      this.logger.log(`File downloaded successfully.`);
      return data.Body as Buffer;
    } catch (error) {
      this.logger.error(`File download failed. ${error.message}`);
      throw new Error(`File download failed. ${error.message}`);
    }
  }
}
