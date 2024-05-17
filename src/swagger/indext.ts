import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import {
  SWAGGER_BOARD_API_NAME,
  SWAGGER_BOARD_API_CURRENT_VERSION,
  SWAGGER_BOARD_API_DESCRIPTION,
  SWAGGER_USER_API_DESCRIPTION,
  SWAGGER_USER_API_CURRENT_VERSION,
  SWAGGER_USER_API_NAME,
} from './constants';

export class SwaggerHelper {
  static singleton;
  private app: INestApplication;
  /**
   * admin
   */
  private adminApi = '/api/admin/v1/docs';

  private postApi = '/api/post/docs';

  private userApi = '/api/user/docs';

  constructor() {
    if (SwaggerHelper.singleton) return SwaggerHelper.singleton;
    SwaggerHelper.singleton = this;
  }
  setApp(app) {
    this.app = app;
  }

  getApp() {
    return this.app;
  }

  /**
   * admin
   */
  getAdminApi() {
    return this.adminApi;
  }

  /**
   *
   * post
   */
  getPostApi() {
    return this.postApi;
  }

  /**
   *
   * user
   */
  getUserApi() {
    return this.userApi;
  }

  // getBoardSwaggerHtml = (config?) => {
  //   const { document, options } = this.getBoardSwaggerDocument(config);
  //   const swaggerUi = loadPackage('swagger-ui-express', 'SwaggerModule', () => require('swagger-ui-express'));
  //   const swaggerHtml = swaggerUi.generateHTML(document, options);
  //
  //   return swaggerHtml;
  // };
  getBoardSwaggerDocument = (config?) => {
    const options = new DocumentBuilder()
      .setTitle(SWAGGER_BOARD_API_NAME)
      .setDescription(SWAGGER_BOARD_API_DESCRIPTION)
      .setVersion(SWAGGER_BOARD_API_CURRENT_VERSION)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, options, config);
    // fs.writeFileSync('./provider-swagger-spec.json', JSON.stringify(document));
    return document;
  };

  // getUserSwaggerHtml = (config?) => {
  //   const { document, options } = this.getUserSwaggerDocument(config);
  //   const swaggerUi = loadPackage('swagger-ui-express', 'SwaggerModule', () => require('swagger-ui-express'));
  //   const swaggerHtml = swaggerUi.generateHTML(document, options);
  //
  //   return swaggerHtml;
  // };
  getUserSwaggerDocument = (config?) => {
    const options = new DocumentBuilder()
      .setTitle(SWAGGER_USER_API_NAME)
      .setDescription(SWAGGER_USER_API_DESCRIPTION)
      .setVersion(SWAGGER_USER_API_CURRENT_VERSION)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, options, config);
    // fs.writeFileSync('./provider-swagger-spec.json', JSON.stringify(document));
    return document;
  };
}
