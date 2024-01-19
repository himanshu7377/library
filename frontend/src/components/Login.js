import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role,setRole]=useState('')
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
        

      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-auth-token": token,
         
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();
      

      if (response.ok) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('role', responseData.role);
        console.log('Login successful!');
        
        navigate('/books');
      } else {
        console.error('Login failed:', responseData.msg);
        setError(responseData.msg);
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="bg-white p-8 rounded shadow-md w-96 border border-black">
        <h2 className="text-2xl font-bold mb-4 flex justify-center">LOGIN</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1 text-left">Username:</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1 text-left">Password:</label>
            <input
              type="password"
              className="border rounded w-full py-2 px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
