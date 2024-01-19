import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VIEW_ALL'); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const responseData = await response.json();
      // console.log(responseData)

      if (response.ok) {
        console.log('Registration successful:', responseData.msg);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        navigate('/login');
      } else {
        console.error('Registration failed:', responseData.msg);
        setError(responseData.msg);
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 flex justify-center">Register</h2>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1 text-left">Role:</label>
            <select
              className="border rounded w-full py-2 px-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="VIEW_ALL">Viewer</option>
              <option value="CREATOR">Creator</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
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

export default Register;
