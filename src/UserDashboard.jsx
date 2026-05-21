import { useAuth } from './AuthContext.jsx';
import DashboardTopNav from './DashboardTopNav.jsx';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  const cards = [
    { title: 'My Adventures', desc: 'Track your ongoing and completed adventures in one place.' },
    { title: 'Statistics',    desc: 'Review your personal stats, milestones, and recent activity.' },
    { title: 'Quick Actions', desc: 'Start a new adventure, update your profile, or view your history.' },
  ];

  return (
    <div className="dashboard-layout">
      <DashboardTopNav variant="user" />

      <div className="dashboard-body">
        <div className="role-dashboard">
          <h2>Your Dashboard</h2>
          <div className="dashboard-cards">
            {cards.map((c) => (
              <div className="dash-card user-card" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
