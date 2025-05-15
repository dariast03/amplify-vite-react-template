/* eslint-disable @typescript-eslint/no-explicit-any */
import JsonView from '@uiw/react-json-view';
import { post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useState } from 'react';

const PythonLambdaProtectedAuth = () => {
  const [lambdaExternalResponse, setLambdaExternalResponse] =
    useState<any>(null);
  const handleExternalAuthTestApi = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString() ?? '';
    try {
      const restOperation = post({
        apiName: 'mi-otra-api',
        path: 'mi-endpoint',
        options: {
          body: {
            message: 'Hello from the frontend',
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      const { body } = await restOperation.response;
      const response = await body.json();
      console.log('🚀 ~ handleExternalAuthTestApi ~ response:', response);
      setLambdaExternalResponse(response);
    } catch (error: any) {
      setLambdaExternalResponse({
        error: error.message,
      });
    }
  };

  return (
    <>
      <button
        onClick={handleExternalAuthTestApi}
        style={{
          flex: 1,
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
        }}
      >
        Test Lambda API External Python
      </button>

      <div
        style={{
          maxWidth: '100%',
          maxHeight: '500px',
          overflow: 'auto',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 10px', color: '#333' }}>
          Test External Lambda API Response
        </h3>

        {lambdaExternalResponse ? (
          <JsonView value={lambdaExternalResponse} />
        ) : (
          'No response yet'
        )}
      </div>
    </>
  );
};

export default PythonLambdaProtectedAuth;
