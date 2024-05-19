import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from '../../config/config.service';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  // nes-aws-sdk를 사용 할 경우
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}
  // nes-aws-sdk를 사용 안 할 경우
  // constructor(private appConfigService: AppConfigService) {}
  private bucket_name: string = process.env.AWS_S3_BUCKET_NAME;

  async uploadFile(
    file: Express.Multer.File,
    email?: string,
    title?: string,
  ): Promise<string> {
    let key = `${process.env.NODE_ENV}/post/`;
    if (email !== undefined) {
      key += `${email}/`;
    }
    if (title !== undefined) {
      key += `${title}/`;
    }
    key += `${uuidv4()}-${file.originalname}`;
    const params = {
      // nes-aws-sdk를 사용 안 할 경우
      // Bucket: this.appConfigService.awsS3BucketName,
      Bucket: this.bucket_name,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      // nes-aws-sdk를 사용 할 경우
      const data = await this.s3.upload(params).promise();
      // nes-aws-sdk를 사용 안 할 경우
      // const data = await this.appConfigService.awsS3.upload(params).promise();
      this.logger.log(`File uploaded successfully. ${data.Location}`);
      this.logger.log(`File uploaded successfully. Key: ${key}`);
      return key; // 키 반환
      // return data.Location;
    } catch (error) {
      this.logger.error(`File upload failed. ${error.message}`);
      throw new Error(`File upload failed. ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    email?: string,
    title?: string,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, email, title),
    );
    return Promise.all(uploadPromises);
  }

  async getFileUrl(key: string): Promise<string> {
    const params = {
      // nes-aws-sdk를 사용 안 할 경우
      // Bucket: this.appConfigService.awsS3BucketName,
      Bucket: this.bucket_name,
      Key: key,
      Expires: 300, // URL expires in 300 seconds
    };

    try {
      // nes-aws-sdk를 사용 할 경우
      const url = await this.s3.getSignedUrlPromise(
        'getObject',
        params,
      );
      // nes-aws-sdk를 사용 안 할 경우
      // const url = await this.appConfigService.awsS3.getSignedUrlPromise(
      //   'getObject',
      //   params,
      // );
      this.logger.log(`Generated URL: ${url}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate URL. ${error.message}`);
      throw new Error(`Failed to generate URL. ${error.message}`);
    }
  }

  async getFileUrls(keys: string[]): Promise<string[]> {
    const urlPromises = keys.map((key) => this.getFileUrl(key));
    console.log(`urlPromises : ${JSON.stringify(urlPromises, null ,2)}`)
    return Promise.all(urlPromises);
  }

  async loadTemplateFromS3(): Promise<{
    subject: string;
    body: string;
  }> {
    const params = {
      Bucket: this.bucket_name,
      Key: `${process.env.NODE_ENV}/email-template.json`,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      const template = data.Body.toString('utf-8');
      return JSON.parse(template);
    } catch (error) {
      console.error(`Failed to load template from S3. Error: ${error.message}`);
      throw new Error(
        `Failed to load template from S3. Error: ${error.message}`,
      );
    }
  }
}
