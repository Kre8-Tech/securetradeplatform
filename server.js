const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

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