const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const staffsPath = path.join(__dirname, '../data', 'staffs.json');
const staffs = JSON.parse(fs.readFileSync(staffsPath, 'utf-8'));

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY ;

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = staffs.find(user => user.email === email && user.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const { password: userPassword, ...userData } = user;
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200)
  .json({status: 'ok', token: token, user: userData});
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful. Please clear your token on the client side.' });
};
