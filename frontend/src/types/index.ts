export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  check_in: string | null;
  check_out: string | null;
  date: string;
  status: 'present' | 'absent' | 'partial';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStatistics {
  total_days: number;
  present_days: number;
  absent_days: number;
  partial_days: number;
  attendance_percentage: number;
}

export interface DashboardData {
  todayStatus: {
    attendance: AttendanceRecord | null;
    canCheckIn: boolean;
    canCheckOut: boolean;
  };
  monthlyStats: AttendanceStatistics;
  recentAttendance: AttendanceRecord[];
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}