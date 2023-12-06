import path from 'path';
import dotenv from 'dotenv';

import { castParam } from '@amaui/utils';

const NODE_ENV = process.env.NODE_ENV;

let envPath = '';

if (['local'].includes(NODE_ENV)) envPath = path.resolve('./.env.local');
else if (['dev', 'development'].includes(NODE_ENV)) envPath = path.resolve('./.env.dev');
else if (['prod', 'production'].includes(NODE_ENV)) envPath = path.resolve('./.env.prod');
else if (['test'].includes(NODE_ENV)) envPath = path.resolve('./.env.test');

// Import environment variable values
dotenv.config({
  path: envPath
});

class Config {
  private values = {
    port: 4000,
    env: 'development',
    private: 'deel',

    limits: {
      // api
      api: {
        second: 4,
        minute: 140
      },

      // 100 mb
      request: 1024 * 1024 * 100
    },

    log: {
      variants: ['log', 'debug', 'info', 'warn', 'error', 'important'],

      request: {
        slow: 4000
      }
    }
  };

  get value() {

    return {
      port: process.env.PORT !== undefined ? process.env.PORT : this.values.port,
      env: process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : this.values.env,

      private: process.env.CONFIG_PRIVATE !== undefined ? process.env.CONFIG_PRIVATE : this.values.private,

      app: {
        main: process.env.APP_MAIN
      },

      limits: {
        api: {
          second: castParam(process.env.CONFIG_LIMITS_API_SECOND || this.values.limits.api.second),
          minute: castParam(process.env.CONFIG_LIMITS_API_MINUTE || this.values.limits.api.minute)
        },

        request: castParam(process.env.CONFIG_LIMITS_REQUEST || this.values.limits.request)
      },

      log: {
        variants: this.array(process.env.LOG_VARIANTS) || this.values.log.variants,

        request: {
          slow: castParam(process.env.LOG_REQUEST_SLOW || this.values.log.request.slow)
        }
      },

      db: {
        mysql: {
          uri: process.env.DB_MYSQL_URI,
          name: process.env.DB_MYSQL_NAME
        }
      },

      service: {
        aws: {
          s3: {
            accessKey: process.env.SERVICE_AWS_S3_ACCESS_KEY_ID,
            secretKey: process.env.SERVICE_AWS_S3_SECRET_ACCESS_KEY,
            bucketName: process.env.SERVICE_AWS_S3_BUCKET_NAME,
            endpoint: process.env.SERVICE_AWS_S3_ENDPOINT,
            region: process.env.SERVICE_AWS_S3_REGION
          }
        }
      }
    }
  }

  private array(value: string) {
    if (!value) return;

    return (value || '').split(',').map(item => item.trim()).filter(Boolean);
  }
}

export default new Config();
