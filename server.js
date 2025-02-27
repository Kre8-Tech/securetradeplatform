// backend/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Middleware: Authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Mock Data
const users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: bcrypt.hashSync('admin123', 10), role: 'admin', blocked: false, redFlagged: false },
  { id: 2, name: 'John Banda', email: 'john@example.com', password: bcrypt.hashSync('customer123', 10), role: 'customer', blocked: false, redFlagged: false },
  { id: 3, name: 'Mary Phiri', email: 'mary@example.com', password: bcrypt.hashSync('merchant123', 10), role: 'merchant', blocked: false, redFlagged: false },
  { id: 4, name: 'Alice Mwale', email: 'alice@example.com', password: bcrypt.hashSync('customer456', 10), role: 'customer', blocked: false, redFlagged: false },
  { id: 5, name: 'Bob Chibwe', email: 'bob@example.com', password: bcrypt.hashSync('merchant456', 10), role: 'merchant', blocked: false, redFlagged: false },
];

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

const notifications = [
  { id: 1, type: 'news', message: 'New feature added.', date: '2023-10-10' },
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

// ✅ Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ message: 'User not found.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
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
app.get('/api/transactions', authenticateJWT, (req, res) => {
  res.json(transactions);
});

// ✅ Add Transaction
app.post('/api/transactions', authenticateJWT, (req, res) => {
  const { description, amount, paymentMode, creatorEmail, creatorPhone, otherPartyEmail, otherPartyPhone, courier } = req.body;

  if (!description || !amount || !paymentMode || !creatorEmail || !creatorPhone || !otherPartyEmail || !otherPartyPhone) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  const newTransaction = { id: transactions.length + 1, description, amount, paymentMode, status: 'Pending', creatorEmail, creatorPhone, otherPartyEmail, otherPartyPhone, courier: courier || 'Not Assigned' };
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

// ✅ Register API
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) return res.status(400).json({ message: 'User already exists.' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: users.length + 1, name, email, password: hashedPassword, role, blocked: false, redFlagged: false };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: newUser.role });
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

// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));