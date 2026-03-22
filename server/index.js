const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("🚀 Sattva Siddhi API Running");
});

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');

app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');

app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
