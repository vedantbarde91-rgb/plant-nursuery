const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ FINAL CORS CONFIG (IMPORTANT)
const corsOptions = {
 origin: [
  "http://localhost:3001",
  "https://nurserywrsc.netlify.app"
],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ handle preflight

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/inward', require('./routes/inwardRoutes'));
app.use('/api/outward', require('./routes/outwardRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ message: '🌿 Forest Nursery Management System API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});