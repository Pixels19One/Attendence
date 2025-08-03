import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardData, AttendanceRecord } from '../../types';
import { attendanceAPI } from '../../services/api';
import CheckInOut from '../attendance/CheckInOut';
import AttendanceChart from './AttendanceChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { theme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceUpdate = () => {
    fetchDashboardData();
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ color: theme.colors.text }}>
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error" style={{ color: theme.colors.error }}>
        <p>{error}</p>
        <button onClick={fetchDashboardData} style={{ background: theme.colors.primary }}>
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 style={{ color: theme.colors.text }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: theme.colors.textSecondary }}>
          {formatDate(new Date().toISOString())}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <CheckInOut 
          todayStatus={dashboardData.todayStatus}
          onUpdate={handleAttendanceUpdate}
        />
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div 
          className="stat-card"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="stat-icon" style={{ color: theme.colors.success }}>
            📈
          </div>
          <div className="stat-content">
            <h3 style={{ color: theme.colors.text }}>
              {dashboardData.monthlyStats.attendance_percentage}%
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Monthly Attendance
            </p>
          </div>
        </div>

        <div 
          className="stat-card"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="stat-icon" style={{ color: theme.colors.primary }}>
            📅
          </div>
          <div className="stat-content">
            <h3 style={{ color: theme.colors.text }}>
              {dashboardData.monthlyStats.present_days}
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Days Present
            </p>
          </div>
        </div>

        <div 
          className="stat-card"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="stat-icon" style={{ color: theme.colors.warning }}>
            ⏰
          </div>
          <div className="stat-content">
            <h3 style={{ color: theme.colors.text }}>
              {dashboardData.monthlyStats.total_days}
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Total Days
            </p>
          </div>
        </div>

        <div 
          className="stat-card"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="stat-icon" style={{ color: theme.colors.error }}>
            ❌
          </div>
          <div className="stat-content">
            <h3 style={{ color: theme.colors.text }}>
              {dashboardData.monthlyStats.absent_days}
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Days Absent
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-section">
        <h2 style={{ color: theme.colors.text }}>Monthly Overview</h2>
        <div 
          className="chart-container"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <AttendanceChart data={dashboardData.monthlyStats} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2 style={{ color: theme.colors.text }}>Recent Activity</h2>
        <div 
          className="recent-activity"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          {dashboardData.recentAttendance.length > 0 ? (
            <div className="activity-list">
              {dashboardData.recentAttendance.map((record: AttendanceRecord) => (
                <div 
                  key={record.id} 
                  className="activity-item"
                  style={{ borderBottom: `1px solid ${theme.colors.border}` }}
                >
                  <div className="activity-date">
                    <span style={{ color: theme.colors.text }}>
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="activity-times">
                    <span style={{ color: theme.colors.success }}>
                      In: {formatTime(record.check_in)}
                    </span>
                    <span style={{ color: theme.colors.warning }}>
                      Out: {formatTime(record.check_out)}
                    </span>
                  </div>
                  <div 
                    className={`activity-status status-${record.status}`}
                    style={{ 
                      backgroundColor: record.status === 'present' 
                        ? theme.colors.success + '20' 
                        : record.status === 'absent'
                        ? theme.colors.error + '20'
                        : theme.colors.warning + '20',
                      color: record.status === 'present' 
                        ? theme.colors.success 
                        : record.status === 'absent'
                        ? theme.colors.error
                        : theme.colors.warning
                    }}
                  >
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity" style={{ color: theme.colors.textSecondary }}>
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;