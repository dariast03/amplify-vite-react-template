/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { post } from 'aws-amplify/api';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
  const [lambdaResponse, setLambdaResponse] = useState<string | null>(null);
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt('Todo content') });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  const handleTestApi = async () => {
    try {
      const restOperation = post({
        apiName: 'my-api',
        path: 'api/mi-endpoint',
        options: {
          body: {
            message: 'Hello from the frontend',
          },
        },
      });
      console.log('🚀 ~ handleTestApi ~ restOperation:', restOperation);

      const { body } = await restOperation.response;
      const response = await body.json();
      setLambdaResponse(JSON.stringify(response, null, 2)); // Format JSON with indentation
    } catch (error: any) {
      setLambdaResponse(`Error: ${error.message}`);
    }
  };

  const handleExternalAuthTestApi = async () => {
    try {
      const restOperation = post({
        apiName: 'my-api',
        path: 'api/mi-endpoint',
        options: {
          body: {
            message: 'Hello from the frontend',
          },
        },
      });
      console.log('🚀 ~ handleTestApi ~ restOperation:', restOperation);

      const { body } = await restOperation.response;
      const response = await body.json();
      setLambdaResponse(JSON.stringify(response, null, 2)); // Format JSON with indentation
    } catch (error: any) {
      setLambdaResponse(`Error: ${error.message}`);
    }
  };

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href='https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates'>
          Review next step of this tutorial.
        </a>
      </div>

      <button onClick={signOut}>Sign out</button>
      <button onClick={handleTestApi}>TEST LAMBDA API</button>
      <button onClick={handleExternalAuthTestApi}>TEST LAMBDA EXTERNAL</button>
      {/* Display the response from the test lambda API */}
      <div
        id='lambda-response'
        style={{
          maxWidth: '500px',
          maxHeight: '500px',
          overflow: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          marginTop: '20px',
          whiteSpace: 'pre-wrap',
          backgroundColor: '#f9f9f9',
        }}
      >
        {lambdaResponse ? lambdaResponse : 'No response yet.'}
      </div>
    </main>
  );
}

export default App;
