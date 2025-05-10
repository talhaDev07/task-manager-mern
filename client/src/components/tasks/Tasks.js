import { useState, useEffect } from 'react';
import api from '../../utils/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task._id !== id));
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <TaskForm addTask={addTask} />
      <div className="tasks">
        {tasks.length === 0 ? (
          <p>No tasks found. Add a task to get started!</p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;