import { useState } from 'react';
import api from '../../utils/api';

const TaskForm = ({ addTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const { title, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/tasks', formData);
      addTask(res.data);
      setFormData({ title: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="task-form">
      <h2>Add Task</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Task Title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Task Description"
            name="description"
            value={description}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Add Task" />
      </form>
    </div>
  );
};

export default TaskForm;