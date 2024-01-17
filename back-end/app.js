const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;




console.log('MongoDB URI:', process.env.MONGODB_URI);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useCreateIndex: true, // To avoid deprecation warning
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log HTTP requests to the console

// Routes
// app.use('/auth', authRoutes);
// app.use('/books', bookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


// Define a simple route

app.get('/', (req, res) => {
    res.send('Hello, this is your Express API!');
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
