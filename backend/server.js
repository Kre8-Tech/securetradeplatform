// backend/server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const nodemailer = require('nodemailer'); // For email notifications
const twilio = require('twilio'); // For WhatsApp notifications

console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);
console.log('Twilio Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Twilio Auth Token:', process.env.TWILIO_AUTH_TOKEN);
console.log('Twilio WhatsApp Number:', process.env.TWILIO_WHATSAPP_NUMBER);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from http://localhost:3000
app.use(bodyParser.json()); // Parse JSON request bodies

// Mock Data
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    blocked: false,
    redFlagged: false,
    contactDetails: {
      whatsapp: '+265999123456',
      location: 'Lilongwe',
      areasOfOperation: []
    }
  },
  {
    id: 2,
    name: 'John Banda',
    email: 'john@example.com',
    password: bcrypt.hashSync('customer123', 10),
    role: 'customer',
    blocked: true, // New users should be blocked by default
    redFlagged: false,
    contactDetails: {
      whatsapp: '+265999654321',
      location: 'Blantyre',
      areasOfOperation: []
    }
  },
  {
    id: 3,
    name: 'Mary Phiri',
    email: 'mary@example.com',
    password: bcrypt.hashSync('merchant123', 10),
    role: 'merchant',
    blocked: true, // New users should be blocked by default
    redFlagged: false,
    contactDetails: {
      whatsapp: '+265888654321',
      location: 'Lilongwe',
      areasOfOperation: []
    }
  },
  {
    id: 4,
    name: 'Alice Mwale',
    email: 'alice@example.com',
    password: bcrypt.hashSync('customer456', 10),
    role: 'customer',
    blocked: false,
    redFlagged: false,
    contactDetails: {
      whatsapp: '+265999654321',
      location: 'Blantyre',
      areasOfOperation: []
    }
  },
  {
    id: 5,
    name: 'Bob Chibwe',
    email: 'bob@example.com',
    password: bcrypt.hashSync('merchant456', 10),
    role: 'merchant',
    blocked: false,
    redFlagged: false,
    contactDetails: {
      whatsapp: '+265888123456',
      location: 'Lilongwe',
      areasOfOperation: []
    }
  }
];

// Mock Data for Tickets
const tickets = [];

// Example ticket structure
// { id: 1, userId: 2, description: 'Issue with payment', status: 'Open', createdAt: new Date() }

const transactions = [
  { id: 1, userId: 2, description: 'Purchase of maize', amount: 15000, paymentMode: 'Airtel Money', status: 'Completed', creatorEmail: 'john@example.com', creatorPhone: '+265999123456', otherPartyEmail: 'mary@example.com', otherPartyPhone: '+265888654321', courier: 'Not Assigned' },
  { id: 2, userId: 4, description: 'Purchase of fertilizer', amount: 25000, paymentMode: 'TNM Mpamba', status: 'Pending', creatorEmail: 'alice@example.com', creatorPhone: '+265999654321', otherPartyEmail: 'bob@example.com', otherPartyPhone: '+265888123456', courier: 'Not Assigned' },
  { id: 3, userId: 2, description: 'Purchase of seeds', amount: 10000, paymentMode: 'Airtel Money', status: 'Completed', creatorEmail: 'john@example.com', creatorPhone: '+265999123456', otherPartyEmail: 'mary@example.com', otherPartyPhone: '+265888654321', courier: 'Not Assigned' },
  { id: 4, userId: 3, description: 'Purchase of tools', amount: 50000, paymentMode: 'Bank Transfer', status: 'Failed', creatorEmail: 'mary@example.com', creatorPhone: '+265888654321', otherPartyEmail: 'bob@example.com', otherPartyPhone: '+265888123456', courier: 'Not Assigned' },
  { id: 5, userId: 5, description: 'Purchase of irrigation equipment', amount: 75000, paymentMode: 'Cash', status: 'Completed', creatorEmail: 'bob@example.com', creatorPhone: '+265888123456', otherPartyEmail: 'alice@example.com', otherPartyPhone: '+265999654321', courier: 'Not Assigned' },
];

const reports = [
  { id: 1, title: 'Monthly Report', date: '2023-09-30', content: 'Maize production increased by 15%.' },
  { id: 2, title: 'Quarterly Report', date: '2023-12-31', content: 'Fertilizer sales doubled compared to last quarter.' },
  { id: 3, title: 'Annual Report', date: '2023-12-31', content: 'Total revenue increased by 25% compared to last year.' },
  { id: 4, title: 'Market Analysis', date: '2023-10-15', content: 'Demand for irrigation equipment has surged.' },
];

const merchants = [
  { id: 1, name: 'AgroMart Malawi', location: 'Lilongwe', contact: '+265888123456', email: 'agromart@example.com' },
  { id: 2, name: 'Farmers Co-op', location: 'Blantyre', contact: '+265888654321', email: 'farmerscoop@example.com' },
  { id: 3, name: 'Green Fields', location: 'Mzuzu', contact: '+265888789012', email: 'greenfields@example.com' },
  { id: 4, name: 'Harvest Hub', location: 'Zomba', contact: '+265888345678', email: 'harvesthub@example.com' },
];

const announcements = [
  { id: 1, type: 'news', message: 'New maize prices announced.', date: '2023-10-01' },
  { id: 2, type: 'offer', message: 'Special discount on fertilizer.', date: '2023-10-02' },
  { id: 3, type: 'news', message: 'New farming tools available in stores.', date: '2023-10-05' },
  { id: 4, type: 'offer', message: 'Free delivery on orders above MWK 50,000.', date: '2023-10-10' },
];

const analyticsData = {
  totalUsers: 150,
  activeUsers: 120,
  totalTrades: 300,
  totalRevenue: 4500000, // MWK
  platformUptime: 99.9,
};

const financialPerformance = [
  { date: '2023-09-01', revenue: 1000000, expenses: 500000 },
  { date: '2023-09-15', revenue: 1200000, expenses: 600000 },
  { date: '2023-10-01', revenue: 1500000, expenses: 700000 },
  { date: '2023-10-15', revenue: 1800000, expenses: 800000 },
];

const predictiveAnalysis = {
  assetPricePredictions: [
    { date: '2023-11-01', predictedPrice: 5000 },
    { date: '2023-11-15', predictedPrice: 5200 },
    { date: '2023-12-01', predictedPrice: 5400 },
    { date: '2023-12-15', predictedPrice: 5600 },
  ],
  userChurnPredictions: [
    { userId: 1, churnProbability: 0.1 },
    { userId: 2, churnProbability: 0.3 },
    { userId: 3, churnProbability: 0.2 },
    { userId: 4, churnProbability: 0.4 },
  ],
};

const tradingInsightsData = {
  tradeVolume: [
    { asset: 'Maize', volume: 50000 },
    { asset: 'Fertilizer', volume: 30000 },
    { asset: 'Seeds', volume: 20000 },
    { asset: 'Tools', volume: 10000 },
  ],
  successRate: [
    { name: 'Maize', value: 90 },
    { name: 'Fertilizer', value: 85 },
    { name: 'Seeds', value: 80 },
    { name: 'Tools', value: 75 },
  ],
};

const notifications = [
  { id: 1, message: 'New transaction created.', date: '2023-10-01' },
  { id: 2, message: 'Transaction status updated.', date: '2023-10-02' },
];

// JWT Secret Key (for signing tokens)
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ✅ Register API
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, whatsapp, location, areasOfOperation } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) return res.status(400).json({ message: 'User already exists.' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const referenceCode = `${name.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser = { 
    id: users.length + 1, 
    name, 
    email, 
    password: hashedPassword, 
    role, 
    blocked: true, 
    redFlagged: false, 
    referenceCode,
    contactDetails: {
      whatsapp,
      location,
      areasOfOperation: areasOfOperation || []
    }
  };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

  // Send notification to user
  const notificationMessage = `Your account is blocked until payment is confirmed. Your reference code is ${referenceCode}.`;
  sendEmail(email, 'Account Blocked', notificationMessage);
  sendWhatsApp(newUser.contactDetails.whatsapp, notificationMessage);

  res.json({ token, role: newUser.role, referenceCode });
});

// ✅ Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ message: 'User not found.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

  if (user.blocked) {
    return res.status(403).json({ message: 'Your account is blocked. Please contact the admin.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

//unblock user route
app.patch('/api/users/:id/unblock', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.blocked = false;
  res.json({ message: 'User unblocked successfully.', user });
});

// ✅ Get User Preferences
app.get('/api/user/preferences', authenticateJWT, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user.preferences);
});

// ✅ Update User Preferences
app.post('/api/user/preferences', authenticateJWT, async (req, res) => {
  const { theme, notifications, language, timezone } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.preferences = {
    theme,
    notifications,
    language,
    timezone,
  };

  res.json({ message: 'Preferences updated successfully.' });
});

// backend/server.js
app.patch('/api/user/change-password', authenticateJWT, async (req, res) => {
  const { newPassword } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.password = bcrypt.hashSync(newPassword, 10);
  res.json({ message: 'Password changed successfully.' });
});

app.patch('/api/user/change-username', authenticateJWT, async (req, res) => {
  const { newUsername } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.name = newUsername;
  res.json({ message: 'Username changed successfully.' });
});

// ✅ Customer Dashboard
app.get('/api/customer-dashboard', authenticateJWT, (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json(customerDashboardData);
});

// ✅ Courier Dashboard
app.get('/api/courier-dashboard', authenticateJWT, (req, res) => {
  if (req.user.role !== 'courier') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json(courierDashboardData);
});

// ✅ Merchant Dashboard
app.get('/api/merchant-dashboard', authenticateJWT, (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json(merchantDashboardData);
});

// backend/server.js
app.get('/api/user/activity', authenticateJWT, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Mock user activity data
  const userActivity = [
    { id: 1, action: 'Logged in' },
    { id: 2, action: 'Viewed dashboard' },
  ];

  res.json(userActivity);
});

app.get('/api/transactions', authenticateJWT, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Mock transactions data
  const transactions = [
    { id: 1, description: 'Purchase of maize', amount: 15000, paymentMode: 'Airtel Money', status: 'Completed' },
    { id: 2, description: 'Purchase of fertilizer', amount: 25000, paymentMode: 'TNM Mpamba', status: 'Pending' },
  ];

  res.json(transactions);
});

app.get('/api/whats-new', authenticateJWT, (req, res) => {
  res.json(announcements);
});

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Email credentials are missing in the .env file!");
  process.exit(1);
}

// ✅ Twilio Setup
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
  console.error("❌ Twilio credentials are missing in the .env file!");
  process.exit(1);
}

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Email & WhatsApp Notifications
const sendEmail = (to, subject, message) => {
  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text: message };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error sending email:', error);
    else console.log('Email sent:', info.response);
  });
};

const sendWhatsApp = (to, message) => {
  twilioClient.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body: message,
  }).then((msg) => console.log('WhatsApp sent:', msg.sid))
    .catch((error) => console.error('Error sending WhatsApp:', error));
};

// ✅ Notification Endpoint
app.post('/api/send-notifications', authenticateJWT, (req, res) => {
  const { creatorEmail, creatorPhone, otherPartyEmail, otherPartyPhone, message } = req.body;

  // Send email notifications
  sendEmail(creatorEmail, 'Transaction Update', message);
  sendEmail(otherPartyEmail, 'Transaction Update', message);

  // Send WhatsApp notifications
  sendWhatsApp(creatorPhone, message);
  sendWhatsApp(otherPartyPhone, message);

  res.json({ message: 'Notifications sent successfully.' });
});

// ✅ Dashboard Analytics API
app.get('/api/analytics/overview', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const analytics = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => !u.blocked).length,
    totalTrades: transactions.length,
    totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
    platformUptime: 99.9,
  };

  res.json(analytics);
});

// ✅ Get Announcements (Manage What's New)
app.get('/api/whats-new', authenticateJWT, (req, res) => {
  res.json(announcements);
});

// ✅ Post New Announcement (Admin Only)
app.post('/api/admin/whats-new', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const { type, message } = req.body;
  if (!type || !message) return res.status(400).json({ message: 'Type and message required.' });

  const newAnnouncement = { id: announcements.length + 1, type, message, date: new Date().toISOString().split('T')[0] };
  announcements.push(newAnnouncement);
  res.json(newAnnouncement);
});

// ✅ Search Merchants
app.get('/api/merchants/search', authenticateJWT, (req, res) => {
  const { q } = req.query;
  const filteredMerchants = merchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(q.toLowerCase()) || merchant.location.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filteredMerchants);
});

// ✅ Get All Merchants
app.get('/api/merchants', authenticateJWT, (req, res) => {
  res.json(merchants);
});

// ✅ Get Reports
app.get('/api/reports', authenticateJWT, (req, res) => {
  res.json(reports);
});

// ✅ Get All Transactions
// backend/server.js
app.get('/api/transactions', authenticateJWT, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role === 'admin') {
    // Admin can see all transactions
    res.json(transactions);
  } else {
    // Non-admin users can only see transactions involving them
    const userTransactions = transactions.filter(
      (transaction) => 
        transaction.creatorEmail === user.email || 
        transaction.otherPartyEmail === user.email
    );
    res.json(userTransactions);
  }
});

// backend/server.js
app.post('/api/transactions', authenticateJWT, (req, res) => {
  const { description, amount, paymentMode, creatorEmail, creatorPhone, otherPartyEmail, otherPartyPhone, courier } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!description || !amount || !paymentMode || !creatorEmail || !creatorPhone || !otherPartyEmail || !otherPartyPhone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newTransaction = {
    id: transactions.length + 1,
    description,
    amount,
    paymentMode,
    status: 'Pending',
    creatorEmail,
    creatorPhone,
    otherPartyEmail,
    otherPartyPhone,
    courier: courier || 'Not Assigned',
  };

  transactions.push(newTransaction);

  // Notify both parties
  const notificationMessage = `Transaction Created: ${description} - Amount: MWK ${amount} - Status: Pending.`;
  sendEmail(creatorEmail, 'Transaction Created', notificationMessage);
  sendEmail(otherPartyEmail, 'Transaction Created', notificationMessage);
  sendWhatsApp(creatorPhone, notificationMessage);
  sendWhatsApp(otherPartyPhone, notificationMessage);

  res.json(newTransaction);
});

// ✅ Update Transaction Status
app.patch('/api/transactions/:id/status', authenticateJWT, (req, res) => {
  const { status } = req.body;
  const transaction = transactions.find((t) => t.id === parseInt(req.params.id));

  if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
  if (!['Completed', 'Failed'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });

  transaction.status = status;

  // Notify both parties about status update
  const statusMessage = `Transaction ${transaction.description} is now marked as ${status}.`;
  sendEmail(transaction.creatorEmail, 'Transaction Status Update', statusMessage);
  sendEmail(transaction.otherPartyEmail, 'Transaction Status Update', statusMessage);
  sendWhatsApp(transaction.creatorPhone, statusMessage);
  sendWhatsApp(transaction.otherPartyPhone, statusMessage);

  res.json({ message: `Transaction updated to ${status}.`, transaction });
});

// ✅ Get All Users (User Management)
app.get('/api/users', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });
  res.json(users);
});

// ✅ Block/Unblock User
app.patch('/api/users/:id/block', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.blocked = req.body.blocked;
  res.json({ message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully.`, user });
});

// ✅ Red-Flag User
app.patch('/api/users/:id/redflag', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.redFlagged = true;
  res.json({ message: 'User red-flagged successfully.', user });
});

// API Endpoints for Analytics Data
app.get('/api/analytics/financial-performance', (req, res) => {
  res.json(financialPerformance);
});

app.get('/api/analytics/predictive-analytics', (req, res) => {
  res.json(predictiveAnalysis);
});

app.get('/api/analytics/trading-insights', (req, res) => {
  res.json(tradingInsightsData);
});

// ✅ Get Notifications
app.get('/api/notifications', authenticateJWT, (req, res) => {
  res.json(notifications);
});

// ✅ Download Report
app.get('/api/reports/download/:id', authenticateJWT, (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = reports.find((r) => r.id === reportId);

  if (!report) {
    return res.status(404).json({ message: 'Report not found.' });
  }

  // Mock file download (replace with actual file generation logic)
  const fileContent = `Report: ${report.title}\nDate: ${report.date}\nContent: ${report.content}`;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename=report-${reportId}.txt`);
  res.send(fileContent);
});

// backend/server.js

// Endpoint to create a support ticket
app.post('/api/support/ticket', authenticateJWT, (req, res) => {
  const { description } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  const newTicket = {
    id: tickets.length + 1,
    userId: user.id,
    description,
    status: 'Submitted',
    createdAt: new Date(),
  };
  tickets.push(newTicket);

  // Optionally send an email notification to the admin
  const notificationMessage = `New support ticket from ${user.name}: ${description}`;
  sendEmail(process.env.EMAIL_USER, 'New Support Ticket', notificationMessage);

  res.json({ message: 'Support ticket opened successfully.', ticket: newTicket });
});

// Endpoint to fetch tickets for a user or admin
app.get('/api/support/tickets', authenticateJWT, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (user.role === 'admin') {
    // Admin can see all tickets
    res.json(tickets);
  } else {
    // Non-admin users can only see their own tickets
    const userTickets = tickets.filter(ticket => ticket.userId === user.id);
    res.json(userTickets);
  }
});

// Endpoint to update ticket status (Admin only)
app.patch('/api/support/tickets/:id', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  const { status } = req.body;
  ticket.status = status; // Update the ticket status

  res.json({ message: 'Ticket status updated successfully.', ticket });
});

// Endpoint to send an email
app.post('/api/support/email', authenticateJWT, (req, res) => {
  const { email, message } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Here you can implement logic to send the email
  const emailMessage = `Message from ${user.name} (${email}): ${message}`;
  const supportEmail = 'support@securetrade.africa'; // Support email address

  sendEmail(supportEmail, 'Support Request', emailMessage); // Send to support email

  res.json({ message: 'Email sent successfully!' });
});

// backend/server.js

// ✅ Create a Support Ticket
app.post('/api/support/ticket', authenticateJWT, (req, res) => {
  const { description } = req.body;
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  const newTicket = {
    id: tickets.length + 1,
    userId: user.id,
    description,
    status: 'Open',
    createdAt: new Date(),
  };
  tickets.push(newTicket);

  // Optionally send an email notification to the admin
  const notificationMessage = `New support ticket from ${user.name}: ${description}`;
  sendEmail(process.env.EMAIL_USER, 'New Support Ticket', notificationMessage);

  res.json({ message: 'Support ticket opened successfully.', ticket: newTicket });
});

// ✅ Get All Tickets (Admin Only)
app.get('/api/support/tickets', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  res.json(tickets);
});

// ✅ Update Ticket Status
app.patch('/api/support/tickets/:id', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  const { status } = req.body;
  ticket.status = status; // Update the ticket status

  res.json({ message: 'Ticket status updated successfully.', ticket });
});

// backend/server.js

// Endpoint to update ticket status (Admin only)
app.patch('/api/support/tickets/:id', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required.' });

  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

  const { status } = req.body;
  ticket.status = status; // Update the ticket status

  // Send notification to the user
  const user = users.find((u) => u.id === ticket.userId);
  if (user) {
    const notificationMessage = `Your support ticket (ID: ${ticket.id}) has been updated to status: ${status}.`;
    sendEmail(user.email, 'Support Ticket Update', notificationMessage);
  }

  res.json({ message: 'Ticket status updated successfully.', ticket });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});