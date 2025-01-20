const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000; // Use Heroku's PORT or fallback to 5000 for local development

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

// Endpoint to register a new user
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if the email is already registered
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: role || 'user', // Default role is 'user'
  };

  // Add the user to the mock database
  users.push(newUser);

  // Return the new user (excluding the password)
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// Mock data for trading insights
const tradingInsights = [
  { asset: 'BTC', volume: 1000, successRate: 95 },
  { asset: 'ETH', volume: 800, successRate: 90 },
  { asset: 'XRP', volume: 600, successRate: 85 },
];

// Endpoint to fetch trading insights
app.get('/api/trading-insights', authenticateJWT, (req, res) => {
  res.json(tradingInsights);
});

// Mock data for financial performance
const financialPerformance = [
  { month: 'January', revenue: 50000 },
  { month: 'February', revenue: 60000 },
  { month: 'March', revenue: 70000 },
];

// Endpoint to fetch financial performance
app.get('/api/financial-performance', authenticateJWT, (req, res) => {
  res.json(financialPerformance);
});

// Mock data for predictive analytics
const predictiveAnalytics = [
  { asset: 'BTC', predictedPrice: 50000 },
  { asset: 'ETH', predictedPrice: 4000 },
  { asset: 'XRP', predictedPrice: 1.5 },
];

// Endpoint to fetch predictive analytics
app.get('/api/predictive-analytics', authenticateJWT, (req, res) => {
  res.json(predictiveAnalytics);
});

// Mock data for users (including passwords and roles)
const users = [
  { id: 1, name: "Admin", email: "admin@example.com", password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { id: 2, name: "User A", email: "userA@example.com", password: bcrypt.hashSync('userA123', 10), role: 'user' },
];

// Mock data for notifications
let notifications = [
  { id: 1, type: 'warning', message: "High churn risk detected for User A", read: false },
  { id: 2, type: 'error', message: "Unusual trading activity detected", read: false },
  { id: 3, type: 'info', message: "System update scheduled for 10 PM", read: false },
  { id: 4, type: 'success', message: "New user registered: User E", read: false },
];

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the SecureTradePlatform API!');
});

// Endpoint to login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

// Endpoint to fetch all users (admin only)
app.get('/api/users', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  res.json(users);
});

// Endpoint to update user status (admin only)
app.post('/api/users/:id/update-status', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const userId = parseInt(req.params.id);
  const { status } = req.body;

  const user = users.find((u) => u.id === userId);
  if (user) {
    user.status = status;
    res.json({ message: 'User status updated successfully', user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Send initial notifications to the client
  ws.send(JSON.stringify({ type: 'INITIAL_NOTIFICATIONS', data: notifications }));

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message);

    if (type === 'MARK_AS_READ') {
      const notificationId = data.notificationId;
      const notification = notifications.find((n) => n.id === notificationId);

      if (notification) {
        notification.read = true;
        // Broadcast the updated notification to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'NOTIFICATION_UPDATED', data: notification }));
          }
        });
      }
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});