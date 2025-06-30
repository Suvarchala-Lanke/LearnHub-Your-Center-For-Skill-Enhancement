// function Dashboard() {
//   return (
//     <div style={{ padding: 40 }}>
//       <h2>Welcome to LearnHub Dashboard 🎓</h2>
//       <p>This is your student area.</p>
//     </div>
//   );
// }

// export default Dashboard;
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    if (!token) {
      navigate('/');
      return;
    }

    const res = await fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) setUser(data);
    else {
      alert("Session expired. Please login again.");
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Enrolled Successfully! ✅");
      fetchCourses();
    } else {
      alert(data.message || "Failed to enroll");
    }
  };

  const handleCreateCourse = async () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    const res = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        C_title: title,
        C_description: description,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Course Created ✅");
      setTitle('');
      setDescription('');
      fetchCourses();
    } else {
      alert(data.message || "Course creation failed");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course._id);
    setEditTitle(course.C_title);
    setEditDescription(course.C_description);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/${editingCourse}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ C_title: editTitle, C_description: editDescription }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Course updated ✅");
      setEditingCourse(null);
      fetchCourses();
    } else {
      alert(data.message || "Update failed");
    }
  };

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Course deleted ✅");
      fetchCourses();
    } else {
      alert(data.message || "Failed to delete course");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (token) fetchCourses();
  }, [search]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', paddingTop: 40 }}>
      <h2>Welcome, {user.name} 👋</h2>
      <p>You are logged in as <strong>{user.type}</strong>.</p>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          alert("Logged out successfully");
          navigate('/');
        }}
        style={{
          margin: '1rem 0',
          padding: '0.5rem 1rem',
          background: 'crimson',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="🔍 Search Courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* 👨‍🏫 Teacher Create Course */}
      {user.type === 'teacher' && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
          <h3>Create a New Course</h3>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <button
            onClick={handleCreateCourse}
            style={{
              padding: '0.5rem 1rem',
              background: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create Course
          </button>
        </div>
      )}

      {/* 👨‍🎓 Student View */}
      {user.type === 'student' && (
        <>
          <h3 style={{ marginTop: '2rem' }}>🎓 My Enrolled Courses:</h3>
          <div className="course-grid">
            {courses
              .filter(course => course.enrolled?.includes(user._id))
              .map(course => (
                <div key={course._id} className="course-card">
                  <Link to={`/courses/${course._id}`}>
                    <h4>📘 {course.C_title}</h4>
                  </Link>
                  <span style={{ color: 'green' }}>✔ Enrolled</span>
                </div>
              ))}
          </div>

          <h3 style={{ marginTop: '2rem' }}>📚 Other Available Courses:</h3>
          <div className="course-grid">
            {courses
              .filter(course => !course.enrolled?.includes(user._id))
              .map(course => (
                <div key={course._id} className="course-card">
                  <Link to={`/courses/${course._id}`}>
                    <h4>📘 {course.C_title}</h4>
                  </Link>
                  <button onClick={() => handleEnroll(course._id)}>Enroll</button>
                </div>
              ))}
          </div>
        </>
      )}

      {/* 👨‍🏫 Teacher View */}
      {user.type === 'teacher' && (
        <>
          <h3 style={{ marginTop: '2rem' }}>📚 Courses You Created:</h3>
          <div className="course-grid">
            {courses
              .filter(course => course.userID === user._id)
              .map(course => (
                <div key={course._id} className="course-card">
                  {editingCourse === course._id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Edit Title"
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Edit Description"
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                      <button onClick={handleSaveEdit}>💾 Save</button>
                      <button onClick={() => setEditingCourse(null)} style={{ marginLeft: 8 }}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <Link to={`/courses/${course._id}`}>
                        <h4>📘 {course.C_title}</h4>
                      </Link>
                      <button onClick={() => handleEditCourse(course)}>✏️ Edit</button>
                      <button onClick={() => handleDeleteCourse(course._id)} style={{ marginLeft: 8 }}>🗑 Delete</button>
                    </>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
