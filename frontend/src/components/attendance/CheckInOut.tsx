import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { attendanceAPI } from '../../services/api';
import { DashboardData } from '../../types';
import './CheckInOut.css';

interface CheckInOutProps {
  todayStatus: DashboardData['todayStatus'];
  onUpdate: () => void;
}

const CheckInOut: React.FC<CheckInOutProps> = ({ todayStatus, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  const { theme } = useTheme();

  const handleCheckIn = async () => {
    if (!todayStatus.canCheckIn) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await attendanceAPI.checkIn();
      setMessage('Successfully checked in!');
      setMessageType('success');
      onUpdate();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to check in');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayStatus.canCheckOut) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await attendanceAPI.checkOut();
      setMessage('Successfully checked out!');
      setMessageType('success');
      onUpdate();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to check out');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div 
      className="checkin-container"
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.text
      }}
    >
      <div className="checkin-header">
        <h2 style={{ color: theme.colors.primary }}>Quick Actions</h2>
        <div className="current-time" style={{ color: theme.colors.textSecondary }}>
          Current Time: <span style={{ color: theme.colors.text, fontWeight: 'bold' }}>{currentTime}</span>
        </div>
      </div>

      <div className="checkin-status">
        <div className="status-grid">
          <div className="status-item">
            <div className="status-label" style={{ color: theme.colors.textSecondary }}>
              Check In
            </div>
            <div 
              className="status-value"
              style={{ 
                color: todayStatus.attendance?.check_in ? theme.colors.success : theme.colors.textSecondary 
              }}
            >
              {formatTime(todayStatus.attendance?.check_in || null)}
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-label" style={{ color: theme.colors.textSecondary }}>
              Check Out
            </div>
            <div 
              className="status-value"
              style={{ 
                color: todayStatus.attendance?.check_out ? theme.colors.warning : theme.colors.textSecondary 
              }}
            >
              {formatTime(todayStatus.attendance?.check_out || null)}
            </div>
          </div>
        </div>
      </div>

      <div className="checkin-actions">
        <button
          onClick={handleCheckIn}
          disabled={!todayStatus.canCheckIn || loading}
          className={`action-button checkin-button ${!todayStatus.canCheckIn ? 'disabled' : ''}`}
          style={{
            backgroundColor: todayStatus.canCheckIn ? theme.colors.success : theme.colors.border,
            color: todayStatus.canCheckIn ? 'white' : theme.colors.textSecondary,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading && !todayStatus.canCheckOut ? (
            <div className="button-spinner"></div>
          ) : null}
          {todayStatus.attendance?.check_in ? '✓ Checked In' : '📥 Check In'}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={!todayStatus.canCheckOut || loading}
          className={`action-button checkout-button ${!todayStatus.canCheckOut ? 'disabled' : ''}`}
          style={{
            backgroundColor: todayStatus.canCheckOut ? theme.colors.warning : theme.colors.border,
            color: todayStatus.canCheckOut ? 'white' : theme.colors.textSecondary,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading && todayStatus.canCheckOut ? (
            <div className="button-spinner"></div>
          ) : null}
          {todayStatus.attendance?.check_out ? '✓ Checked Out' : '📤 Check Out'}
        </button>
      </div>

      {message && (
        <div 
          className={`message ${messageType}`}
          style={{
            backgroundColor: messageType === 'success' 
              ? theme.colors.success + '20' 
              : theme.colors.error + '20',
            color: messageType === 'success' 
              ? theme.colors.success 
              : theme.colors.error,
            border: `1px solid ${messageType === 'success' 
              ? theme.colors.success 
              : theme.colors.error}`,
          }}
        >
          {message}
        </div>
      )}

      <div className="checkin-tips" style={{ color: theme.colors.textSecondary }}>
        <h4 style={{ color: theme.colors.text }}>💡 Tips</h4>
        <ul>
          <li>Check in when you start your work day</li>
          <li>Check out when you finish your work day</li>
          <li>You can only check in/out once per day</li>
          <li>Make sure to check out to complete your attendance</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckInOut;