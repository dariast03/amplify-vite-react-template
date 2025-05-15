import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import PythonLambdaProtectedAuth from './PythonLambda.tsx';

Amplify.configure(outputs);

const existingConfig = Amplify.getConfig();

Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig.API,
    REST: outputs.custom.API,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Authenticator
      components={{
        Footer: () => <PythonLambdaProtectedAuth />,
      }}
    >
      <App />
    </Authenticator>
  </>
);
