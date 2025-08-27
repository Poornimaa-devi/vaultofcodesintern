const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/registrationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  dob: Date,
  gender: String,
  profilePic: String,
});

const User = mongoose.model('User', userSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Registration endpoint
app.post('/register', upload.single('profile'), async (req, res) => {
  try {
    const { fname, lname, email, password, dob, gender } = req.body;
    const profilePic = req.file ? req.file.filename : '';

    // Basic validation (add more as needed)
    if (!fname || !lname || !email || !password || !dob || !gender) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save user to database
    const user = new User({
      fname,
      lname,
      email,
      password, // In production, hash the password!
      dob,
      gender,
      profilePic,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});