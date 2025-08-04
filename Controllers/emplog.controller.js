const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../Models/login.model');

exports.register = async (req, res) => {
  try {
    const { username, password, employeeId } = req.body;

    const existing = await Auth.findByUsername(username);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const user = await Auth.create({ username, password, employeeId });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Auth.findByUsername(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials1' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
