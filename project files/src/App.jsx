// import Login from './pages/Login';

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

// export default App;


// import Register from './pages/Register';

// function App() {
//   return (
//     <div>
//       <Register />
//     </div>
//   );
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import { Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import CourseDetail from './pages/CourseDetail'; // ✅ Import the new page

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/courses/:id" element={<CourseDetail />} /> {/* ✅ Course detail route */}
//     </Routes>
//   );
// }

// export default App;

// App.jsx
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />                {/* Default Login Route */}
      <Route path="/login" element={<Login />} />          {/* ✅ Added for navigation from Register */}
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      
      {/* ✅ Optional fallback route */}
      <Route path="*" element={<p style={{ textAlign: 'center' }}>404 - Page Not Found</p>} />
    </Routes>
  );
}

export default App;
