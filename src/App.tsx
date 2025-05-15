/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import JsonView from '@uiw/react-json-view';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
  const [lambdaResponse, setLambdaResponse] = useState<any>(null);
  const [lambdaExternalResponse, setLambdaExternalResponse] =
    useState<any>(null);
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

      const { body } = await restOperation.response;
      const response = await body.json();
      setLambdaResponse(response);
    } catch (error: any) {
      setLambdaResponse(`Error: ${error.message}`);
    }
  };

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
      setLambdaExternalResponse(response);
    } catch (error: any) {
      setLambdaExternalResponse(`Error: ${error.message}`);
    }
  };

  return (
    <main
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '1200px',
        //width: '100%',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f4f4f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333' }}>My Todos</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={createTodo}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          + New Todo
        </button>
        <button
          onClick={signOut}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Sign Out
        </button>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          marginBottom: '20px',
          backgroundColor: 'white',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => deleteTodo(todo.id)}
            style={{
              padding: '10px 15px',
              borderBottom: '1px solid #ddd',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#f9f9f9')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'white')
            }
          >
            {todo.content}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleTestApi}
          style={{
            flex: 1,
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Test Lambda API Amplify
        </button>
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
          }}
        >
          Test Lambda API External Python
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
      >
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
            Lambda API Response
          </h3>
          {lambdaResponse && <JsonView value={lambdaResponse} />}
        </div>

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
            External Lambda API Response
          </h3>

          {lambdaExternalResponse && (
            <JsonView value={lambdaExternalResponse} />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
