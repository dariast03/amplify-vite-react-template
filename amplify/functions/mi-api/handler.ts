import type { APIGatewayProxyHandler } from 'aws-lambda';

const ENVIROMENT = {
  MY_SECRET: process.env.MY_SECRET ?? 'NO_SECRET',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  };

  console.log('API Gateway Event:', event);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Response from my API',
      success: true,
      event,
      ENVIROMENT,
    }),
  };
};
