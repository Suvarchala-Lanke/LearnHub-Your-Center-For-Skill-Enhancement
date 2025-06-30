// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [name, setName] = useState('');
//   const [type, setType] = useState('student'); // default is student
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch('http://localhost:5000/api/users/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, type, email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Registration successful ✅");
//       navigate('/'); // redirect to login
//     } else {
//       alert(data.message || "Registration failed");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
//       <h2>Register for LearnHub</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         /><br /><br />

//         <select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="student">Student</option>
//           <option value="teacher">Teacher</option>
//         </select><br /><br />

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         /><br /><br />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br /><br />

//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('student'); // Default type

  const handleRegister = async (e) => {
    e.preventDefault(); // ✅ Prevent page reload
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, type }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful ✅');
        navigate('/login'); // ✅ Redirect to login page
      } else {
        alert(data.message || 'Register failed ❌');
      }
    } catch (error) {
      alert('Error registering ❌');
      console.log(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// function Register() {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [type, setType] = useState('student');

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5000/api/users/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password, type }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert('Registered successfully ✅');
//         navigate('/');
//       } else {
//         alert(data.message || 'Registration failed ❌');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Registration error ❌');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           required
//           onChange={(e) => setName(e.target.value)}
//           style={{ width: '100%', marginBottom: 10 }}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           required
//           onChange={(e) => setEmail(e.target.value)}
//           style={{ width: '100%', marginBottom: 10 }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           required
//           onChange={(e) => setPassword(e.target.value)}
//           style={{ width: '100%', marginBottom: 10 }}
//         />
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           style={{ width: '100%', marginBottom: 10 }}
//         >
//           <option value="student">Student</option>
//           <option value="teacher">Teacher</option>
//         </select>
//         <button type="submit" style={{ width: '100%', padding: 10, background: 'green', color: 'white' }}>
//           Register
//         </button>
//       </form>
//       <p style={{ marginTop: 10 }}>
//         Already have an account? <Link to="/">Login</Link>
//       </p>
//     </div>
//   );
// }

// export default Register;
