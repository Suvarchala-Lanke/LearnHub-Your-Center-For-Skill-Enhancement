// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch('http://localhost:5000/api/users/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       // ✅ Save token to localStorage
//       localStorage.setItem('token', data.token);
//       alert('Login Successful ✅');
//       navigate('/dashboard'); // ✅ Redirect to dashboard
//     } else {
//       alert(data.message || 'Login failed ❌');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: '100%', padding: 8, marginBottom: 10 }}
//         />
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: '100%', padding: 8, marginBottom: 10 }}
//         />
//         <button
//           type="submit"
//           style={{
//             width: '100%',
//             padding: '0.5rem',
//             backgroundColor: 'blue',
//             color: 'white',
//             border: 'none',
//             borderRadius: 4,
//           }}
//         >
//           Login
//         </button>
//       </form>

//       <p style={{ marginTop: 10 }}>
//         Don't have an account? <a href="/register">Register</a>
//       </p>
//     </div>
//   );
// }

// export default Login;


import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Check if user is already logged in
  useEffect(() => {
    console.log("✅ Login Component Mounted");
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔐 Token found, redirecting to /dashboard...");
      navigate('/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("✅ Login button clicked");

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login Successful ✅');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed ❌');
      }
    } catch (error) {
      alert('Something went wrong ❌');
      console.error('Login Error:', error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
