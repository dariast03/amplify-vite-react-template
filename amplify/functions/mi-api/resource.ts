import { defineFunction, secret } from '@aws-amplify/backend';

export const miApi = defineFunction({
  name: 'mi-api',
  entry: './handler.ts',
  timeoutSeconds: 60,
  environment: {
    MY_SECRET: secret('MY_SECRET'),
  },
});
