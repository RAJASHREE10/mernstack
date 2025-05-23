import React, { useState, useEffect } from 'react';
import './App.css';

const backgroundImages = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80',
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!title) return;
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
  };

  const updateTask = async (id, updatedTitle, completed) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle, completed }),
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
    setEditId(null);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t._id !== id));
  };

  // Function to cycle to the next background image
  const nextBackground = () => {
    setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImages[bgIndex]})`,
      }}
    >
      <div className="todo-card">
        <h2 className="todo-header">My To-Do List</h2>
        
        <button onClick={nextBackground} className="bg-change-button">
          Change Background
        </button>

        <div className="input-group">
          <input
            type="text"
            placeholder="Add a new task"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            className="task-input"
          />
          <button onClick={addTask} className="add-button">
            Add
          </button>
        </div>

        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className="task-item">
              {editId === task._id ? (
                <>
                  <input
                    type="text"
                    defaultValue={task.title}
                    onChange={e => (task.title = e.target.value)}
                    className="task-edit-input"
                  />
                  <button
                    onClick={() => updateTask(task._id, task.title, task.completed)}
                    className="save-button"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div
                    className={`task-content ${task.completed ? 'completed' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => updateTask(task._id, task.title, !task.completed)}
                  >
                    <input type="checkbox" checked={task.completed} readOnly />
                    <span>{task.title}</span>
                  </div>
                  <button onClick={() => setEditId(task._id)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task._id)} className="delete-button">
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
