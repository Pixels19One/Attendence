import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="layout" style={{ background: theme.colors.background, color: theme.colors.text }}>
      <nav className="navbar" style={{ backgroundColor: theme.colors.surface, borderBottom: `1px solid ${theme.colors.border}` }}>
        <div className="navbar-content">
          <div className="navbar-brand">
            <h2 style={{ color: theme.colors.primary, margin: 0 }}>
              📊 Attendance Portal
            </h2>
          </div>
          
          {user && (
            <div className="navbar-actions">
              <span className="user-info" style={{ color: theme.colors.textSecondary }}>
                Welcome, {user.name}
              </span>
              
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.text,
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {theme.mode === 'light' ? '🌙' : '☀️'}
              </button>
              
              <button
                className="logout-btn"
                onClick={logout}
                style={{
                  background: theme.colors.error,
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;