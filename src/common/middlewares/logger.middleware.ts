import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);
  use(req: Request, res: Response, next: () => void) {
    const tempUrl = req.method + ' ' + req.baseUrl;
    const headers = req.headers;
    const query = req.query;
    const body = req.body;
    const url = tempUrl;
    const originalUrl = req.originalUrl;
    const hostname = req.hostname;
    this.logger.log(
      {
        headers,
        query,
        body,
        url,
        hostname,
        originalUrl,
      },
      `[${RequestLoggerMiddleware.name}]`,
    );
    res.on('finish', () => {
      this.logger.log(`${req.ip}, ${req.method}, ${res.statusCode}`);
    });
    next();
  }
}
