import { useAuth } from './AuthContext.jsx';
import DashboardTopNav from './DashboardTopNav.jsx';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  /* Quick-links shown only on tablet / mobile (via CSS max-width queries) */
  const quickLinks = [
    { label: 'Adventures', icon: '🏔', className: 'ql-btn ql-user-adventures' },
    { label: 'Stats',     icon: '📊', className: 'ql-btn ql-user-stats'     },
    { label: 'Actions',   icon: '⚡', className: 'ql-btn ql-user-actions'   },
  ];

  const cards = [
    { title: 'My Adventures', desc: 'Track your ongoing and completed adventures in one place.' },
    { title: 'Statistics',    desc: 'Review your personal stats, milestones, and recent activity.' },
    { title: 'Quick Actions', desc: 'Start a new adventure, update your profile, or view your history.' },
  ];

  return (
    <div className="dashboard-layout">
      <DashboardTopNav variant="user" />

      {/* ── Tablet & Mobile quick-links row ── */}
      <nav className="topnav-quick-links" aria-label="Quick links">
        {quickLinks.map((ql) => (
          <a key={ql.label} href="#" className={ql.className}>
            <span aria-hidden="true">{ql.icon}</span>
            {ql.label}
          </a>
        ))}
      </nav>

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
