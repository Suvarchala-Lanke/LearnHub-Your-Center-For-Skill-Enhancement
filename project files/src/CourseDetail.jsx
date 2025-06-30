import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [user, setUser] = useState(null);
  const [editLessonId, setEditLessonId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);

  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    const res = await fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setUser(data);
    else {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const fetchCourse = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setCourse(data);
  };

  const fetchLessons = async () => {
    const res = await fetch(`http://localhost:5000/api/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setLessons(data);
  };

  const fetchCompletedLessons = async () => {
    const res = await fetch(`http://localhost:5000/api/users/lessons/completed/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setCompletedLessons(data.completedLessons);
  };

  const handleMarkCompleted = async (lessonId) => {
    const res = await fetch('http://localhost:5000/api/users/lessons/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: id, lessonId }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Lesson marked as completed ✅');
      fetchCompletedLessons();
    } else {
      alert(data.message || 'Failed to mark complete');
    }
  };

  const handleAddLesson = async () => {
    if (!lessonTitle || !lessonContent) {
      alert('Please fill all lesson fields');
      return;
    }

    const res = await fetch(`http://localhost:5000/api/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId: id,
        L_title: lessonTitle,
        L_content: lessonContent,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Lesson added ✅');
      setLessonTitle('');
      setLessonContent('');
      fetchLessons();
    } else {
      alert(data.message || 'Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      alert('Lesson deleted ✅');
      fetchLessons();
    } else {
      alert(data.message || 'Failed to delete');
    }
  };

  const handleEditLesson = (lesson) => {
    setEditLessonId(lesson._id);
    setEditTitle(lesson.L_title);
    setEditContent(lesson.L_content);
  };

  const handleUpdateLesson = async () => {
    const res = await fetch(`http://localhost:5000/api/lessons/${editLessonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ L_title: editTitle, L_content: editContent }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Lesson updated ✅');
      setEditLessonId(null);
      fetchLessons();
    } else {
      alert(data.message || 'Failed to update');
    }
  };

  // ✅ Secure Certificate Download Function (with Debug Logs)
  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/certificate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📦 Status Code:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error from server:', errorText);
        alert('❌ Failed to download certificate');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('❌ Exception occurred:', error);
      alert('❌ Error downloading certificate');
    }
  };

  useEffect(() => {
    if (!token) navigate('/');
    else {
      fetchProfile();
      fetchCourse();
      fetchLessons();
      fetchCompletedLessons();
    }
  }, []);

  if (!course || !user) return <p>Loading...</p>;

  const completedCount = completedLessons.length;
  const totalCount = lessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', paddingTop: 40 }}>
      <h2>{course.C_title}</h2>
      <p><strong>Educator:</strong> {course.C_educator}</p>
      <p><strong>Description:</strong> {course.C_description}</p>

      {user.type === 'student' && (
        <div style={{ margin: '20px 0' }}>
          <p><strong>📈 Progress:</strong> {completedCount} / {totalCount} lessons completed ({progressPercent}%)</p>
          <div style={{ background: '#e0e0e0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                background: 'green',
                height: '100%',
              }}
            />
          </div>
        </div>
      )}

      {user.type === 'student' && progressPercent === 100 && (
        <button
          onClick={handleDownloadCertificate}
          style={{
            margin: '20px 0',
            padding: '10px 20px',
            background: 'goldenrod',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🏆 Download Certificate
        </button>
      )}

      <h3 style={{ marginTop: '2rem' }}>📘 Lessons:</h3>
      {lessons.length > 0 ? (
        <ul>
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson._id);
            return (
              <li key={lesson._id} style={{ marginBottom: 20 }}>
                <strong>Lesson {index + 1}: </strong>
                {editLessonId === lesson._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Edit Title"
                      style={{ width: '100%', marginBottom: 5 }}
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit Content"
                      rows="3"
                      style={{ width: '100%', marginBottom: 5 }}
                    />
                    <button onClick={handleUpdateLesson} style={{ marginRight: 10 }}>Save</button>
                    <button onClick={() => setEditLessonId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div>{lesson.L_title}</div>
                    <p>{lesson.L_content}</p>

                    {user.type === 'student' && !isCompleted && (
                      <button onClick={() => handleMarkCompleted(lesson._id)}>
                        ✅ Mark Complete
                      </button>
                    )}
                    {user.type === 'student' && isCompleted && (
                      <span style={{ color: 'green', marginLeft: '10px' }}>✔ Completed</span>
                    )}

                    {user._id === course.userID && (
                      <>
                        <button onClick={() => handleEditLesson(lesson)} style={{ marginRight: 10 }}>Edit</button>
                        <button onClick={() => handleDeleteLesson(lesson._id)}>Delete</button>
                      </>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No lessons added yet.</p>
      )}

      {user._id === course.userID && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
          <h3>Add a New Lesson</h3>
          <input
            type="text"
            placeholder="Lesson Title"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <textarea
            placeholder="Lesson Content"
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            rows="3"
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <button
            onClick={handleAddLesson}
            style={{
              padding: '0.5rem 1rem',
              background: 'teal',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Lesson
          </button>
        </div>
      )}

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default CourseDetail;
