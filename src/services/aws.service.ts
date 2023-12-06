import AmauiAws from '@amaui/aws';

import config from 'config';

const amauiAws = new AmauiAws({
  s3: {
    bucketName: config.value.service.aws.s3.bucketName,
    credentials: {
      accessKeyId: config.value.service.aws.s3.accessKey,
      secretAccessKey: config.value.service.aws.s3.secretKey
    },
    endpoint: config.value.service.aws.s3.endpoint,
    region: config.value.service.aws.s3.region,

    forcePathStyle: true
  }
} as any);

export default amauiAws;
