# Modern Attendance Website

A complete modern attendance management system built with React.js frontend and Node.js/Express.js backend with MariaDB database integration.

## Features

### 🎨 Frontend Features
- **Modern React.js** with TypeScript and functional components
- **Aesthetic UI** with gradient backgrounds and smooth animations
- **Responsive Design** that works on all device sizes
- **Dark/Light Theme Toggle** for better user experience
- **Real-time Clock** and attendance status updates
- **Interactive Dashboard** with statistics and charts
- **Smooth Animations** using CSS transitions and keyframes

### 🚀 Backend Features
- **Node.js/Express.js** REST API server
- **MariaDB Integration** with connection pooling
- **JWT Authentication** with bcrypt password hashing
- **Role-based Access Control** (Admin/Employee)
- **Input Validation** and error handling
- **CORS and Security** middleware integration

### 📊 Core Functionality
1. **User Authentication** - Login/Register with role management
2. **Check-in/Check-out** - Easy attendance marking with timestamps
3. **Dashboard** - Overview with statistics and recent activity
4. **Attendance History** - View past records with filtering
5. **Statistics & Reports** - Monthly attendance percentages and charts
6. **Admin Panel** - User management for administrators

## Tech Stack

### Frontend
- React.js 18+ with TypeScript
- React Router for navigation
- Chart.js for data visualization
- CSS3 with Flexbox/Grid
- Axios for API communication

### Backend
- Node.js with Express.js
- MariaDB database
- JWT for authentication
- bcryptjs for password hashing
- Express-validator for input validation
- CORS and Helmet for security

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MariaDB** (v10.4 or higher)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Attendence
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Database Configuration
1. Make sure MariaDB is running on your system
2. Create a database (the app will create tables automatically)
3. Copy the environment configuration:
```bash
cp .env.example .env
```

#### Configure Environment Variables
Edit the `.env` file with your database credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=attendance_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h

# Security
BCRYPT_ROUNDS=12
```

#### Start the Backend Server
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure API URL (Optional)
Create a `.env` file in the frontend directory if you need to change the API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start the Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

### Initial Setup
1. Open your browser and navigate to `http://localhost:3000`
2. Click "Sign up here" to create your first account
3. Choose "Admin" role for the first user to have administrative privileges
4. Login with your credentials

### Daily Usage
1. **Check In**: Click the "Check In" button when you start work
2. **Check Out**: Click the "Check Out" button when you finish work
3. **View Dashboard**: See your attendance statistics and recent activity
4. **Theme Toggle**: Use the theme button in the navbar to switch between light/dark mode

### Admin Features
- View all users' attendance records
- Access comprehensive attendance statistics
- Manage user accounts

## Database Schema

The application automatically creates the following tables:

### Users Table
- `id` - Primary key
- `name` - Full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - 'admin' or 'employee'
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### Attendance Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `check_in` - Check-in timestamp
- `check_out` - Check-out timestamp
- `date` - Date of attendance
- `status` - 'present', 'absent', or 'partial'
- `notes` - Optional notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### Settings Table
- `id` - Primary key
- `setting_key` - Setting identifier
- `setting_value` - Setting value
- `description` - Setting description
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/history` - Get attendance history
- `GET /api/attendance/statistics` - Get attendance statistics
- `GET /api/attendance/dashboard` - Get dashboard data
- `GET /api/attendance/all` - Get all attendance (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get specific user (Admin only)

## Development Commands

### Backend
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

### Frontend
```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in your environment
2. Update database credentials for production
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start src/server.js --name "attendance-api"
```

### Frontend
1. Build the production version:
```bash
npm run build
```
2. Serve the `build` folder using a web server like Nginx or Apache

## Security Features

- **Password Hashing** with bcrypt
- **JWT Token Authentication** with configurable expiration
- **Input Validation** on all endpoints
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Role-based Access Control** for admin features

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MariaDB is running
   - Check database credentials in `.env` file
   - Ensure the database exists

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill existing processes using the port

3. **CORS Errors**
   - Verify the frontend URL is allowed in backend CORS configuration
   - Check that both servers are running

4. **JWT Token Errors**
   - Clear browser localStorage
   - Check JWT_SECRET in `.env` file

### Getting Help
If you encounter any issues, please check:
1. Both servers are running
2. Database is accessible
3. Environment variables are correctly set
4. All dependencies are installed

## License

This project is licensed under the ISC License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request