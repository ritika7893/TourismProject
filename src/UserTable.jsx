import React from 'react';

const UserTable = ({ users }) => {
  return (
    <div className="admin-table-wrapper" style={{ 
      overflowX: 'auto',
      overflowY: 'auto', // Enable vertical scrolling for fixed header
      maxHeight: '600px', // Example max height, adjust as needed
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ 
          backgroundColor: '#e0f2fe', // Light blue background for header
          borderBottom: '2px solid #90caf9', // Darker blue border
          position: 'sticky', // Make header sticky
          top: 0, // Stick to the top
          zIndex: 1, // Ensure header stays above scrolling content
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)' // Subtle shadow for depth
        }}>
          <tr>
            <th style={{ padding: '16px 20px', color: '#1e3a8a', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</th>
            <th style={{ padding: '16px 20px', color: '#1e3a8a', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</th>
            <th style={{ padding: '16px 20px', color: '#1e3a8a', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mobile Number</th>
            <th style={{ padding: '16px 20px', color: '#1e3a8a', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="admin-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px 20px', fontWeight: '600', color: '#2563eb' }}>{user.user_id}</td>
              <td style={{ padding: '16px 20px', color: '#1e293b', fontWeight: '500' }}>{user.name}</td>
              <td style={{ padding: '16px 20px', color: '#64748b' }}>{user.mobile_number}</td>
              <td style={{ padding: '16px 20px' }}>
                <span style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.7rem', 
                  fontWeight: '700',
                  backgroundColor: user.is_active ? '#ecfdf5' : '#fef2f2', // Lighter green/red
                  color: user.is_active ? '#047857' : '#ef4444', // Darker green/red
                  display: 'inline-block',
                  border: `1px solid ${user.is_active ? '#a7f3d0' : '#fca5a5'}` // Border matching background
                }}>
                  {user.is_active ? '● ACTIVE' : '○ INACTIVE'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;