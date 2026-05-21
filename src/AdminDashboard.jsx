import DashboardTopNav from './DashboardTopNav.jsx';
import './Dashboard.css';

const AdminDashboard = () => {
  const quickLinks = [
    { label: 'Users',     icon: '👥', className: 'ql-btn ql-admin-users'    },
    { label: 'Settings',  icon: '⚙️', className: 'ql-btn ql-admin-settings' },
    { label: 'Reports',   icon: '📈', className: 'ql-btn ql-admin-reports'  },
  ];

  const cards = [
    { title: 'User Management',  desc: 'View and manage all registered users, assign roles, and monitor activity.' },
    { title: 'System Settings',  desc: 'Configure application settings, manage integrations, and oversee system health.' },
    { title: 'Reports & Analytics', desc: 'Access platform-wide analytics, generate reports, and review key metrics.' },
  ];

  return (
    <div className="dashboard-layout">
      <DashboardTopNav variant="admin" />

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
          <h2>Admin Panel</h2>
          <div className="dashboard-cards">
            {cards.map((c) => (
              <div className="dash-card admin-card" key={c.title}>
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

export default AdminDashboard;
