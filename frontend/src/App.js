import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";


const API_URL = "http://127.0.0.1:5000/tasks";  // adjust if Flask runs on 8000


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
   const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    console.log("API Response:", res.data); // 👈 Check what you get
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask) return;
    await axios.post(API_URL, { title: newTask });
    setNewTask("");
    fetchTasks();
  };

  // const toggleTask = async (id, completed) => {
  //   await axios.put(`${API_URL}/${id}`, { completed: completed ? 0 : 1 });
  //   fetchTasks();
  // };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  // Start editing
  const startEditing = (id, title) => {
    setEditingTaskId(id);
    setTasks(title);
  };

  // Save edited task
  const saveTask = async () => {
    if (!tasks) return;
    await axios.put(`${API_URL}/${editingTaskId}`, { title: tasks });
    setTasks("");
    setEditingTaskId(null);
    fetchTasks();
  };

  return (
    <div className="app-container">
    <div style={{ padding: "20px" }}>
      
      <h1>📝 Task Sheet </h1>
      <div className="task-input">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a task" required
      />
      <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li className="task-item" key={task.id}>
            <span> {task.title}</span>         
            <button className="edit-btn" onClick={() => startEditing(task.id, task.title)}>Edit</button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App;
