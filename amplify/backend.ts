import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { miApi } from './functions/mi-api/resource';
import { Stack } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  miApi,
});

// create a new API stack
const apiStack = backend.createStack(process.env.AWS_BRANCH ?? 'development');

const stageName = process.env.AWS_BRANCH ?? 'development';

// create a new REST API
const myApiRest = new RestApi(apiStack, 'MyApi', {
  restApiName: 'my-api',
  deploy: true,
  deployOptions: {
    stageName,
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

const myApiIntegration = new LambdaIntegration(backend.miApi.resources.lambda);

const myApiPath = myApiRest.root.addResource('api').addResource('mi-endpoint');
myApiPath.addMethod('POST', myApiIntegration);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [myApiRest.restApiName]: {
        endpoint: myApiRest.url,
        region: Stack.of(myApiRest).region,
        apiName: myApiRest.restApiName,
      },
    },
  },
});
