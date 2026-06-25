const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/grocerCart';
const JWT_SECRET = 'supersecretkey123'; // In production, this should be in .env

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => res.send('Backend API is running!'));

// --- AUTH ROUTES ---

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Account not found! Redirecting...', code: 'USER_NOT_FOUND' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDER ROUTES ---

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create a new order (Checkout)
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const order = new Order({
      userId: req.user.userId,
      products,
      totalAmount
    });
    await order.save();
    res.json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed DB route
app.post('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      { name: "Fresh Organic Bananas", description: "High quality bananas", price: 60, unit: "kg", category: "Fruits", imageUrl: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=500&q=80", discountPercentage: 10 },
      { name: "Farm Fresh Tomatoes", description: "Juicy red tomatoes", price: 40, unit: "kg", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80", discountPercentage: 10 },
      { name: "Whole Wheat Bread", description: "Freshly baked whole wheat bread", price: 45, unit: "loaf", category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", discountPercentage: 10 },
      { name: "Premium Dairy Milk", description: "Fresh cow milk", price: 65, unit: "L", category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80", discountPercentage: 10 },
      { name: "Organic Green Apples", description: "Crunchy green apples", price: 150, unit: "kg", category: "Fruits", imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=500&q=80", discountPercentage: 10 },
      { name: "Fresh Carrots", description: "Crunchy carrots", price: 30, unit: "kg", category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80", discountPercentage: 10 }
    ];
    const inserted = await Product.insertMany(sampleProducts);
    res.json({ message: "Database seeded successfully!", products: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
