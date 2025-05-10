import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Tasks from './tasks/Tasks';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="container">
      <h1>Dashboard</h1>
      <p>Welcome {user && user.name}</p>
      <Tasks />
    </section>
  );
};

export default Dashboard;