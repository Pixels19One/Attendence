import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { AttendanceStatistics } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AttendanceChartProps {
  data: AttendanceStatistics;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const chartData = {
    labels: ['Present', 'Absent', 'Partial'],
    datasets: [
      {
        data: [data.present_days, data.absent_days, data.partial_days],
        backgroundColor: [
          theme.colors.success,
          theme.colors.error,
          theme.colors.warning,
        ],
        borderColor: [
          theme.colors.success,
          theme.colors.error,
          theme.colors.warning,
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'normal' as const,
          },
          color: theme.colors.text,
        },
      },
      tooltip: {
        backgroundColor: theme.colors.surface,
        titleColor: theme.colors.text,
        bodyColor: theme.colors.text,
        borderColor: theme.colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = data.total_days;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} days (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: theme.colors.text,
          }}
        >
          {data.attendance_percentage}%
        </div>
        <div
          style={{
            fontSize: '0.9rem',
            color: theme.colors.textSecondary,
            marginTop: '0.25rem',
          }}
        >
          Attendance
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;