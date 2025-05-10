import { useState } from 'react';
import api from '../../utils/api';

const TaskItem = ({ task, deleteTask, updateTask }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description
  });

  const { title, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/tasks/${task._id}`, formData);
      updateTask(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      deleteTask(task._id);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async () => {
    try {
      const res = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed
      });
      updateTask(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {editing ? (
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="description"
              value={description}
              onChange={onChange}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-content">
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <p className="task-date">
              Created on {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="task-actions">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={toggleComplete}
            />
            <button
              className="btn btn-primary"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;