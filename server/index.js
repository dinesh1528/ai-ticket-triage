const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
const winston = require('winston');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB Error:', err));

const Ticket = mongoose.model('Ticket', new mongoose.Schema({
  userId: String,
  content: String,
  classification: String,
  suggestedAnswer: String,
  createdAt: { type: Date, default: Date.now }
}));

app.post('/api/ticket', authenticate, async (req, res) => {
  const { content } = req.body;
  const aiRes = await axios.post(process.env.AI_API_URL, { content });
  const ticket = new Ticket({
    userId: req.user.id,
    content,
    classification: aiRes.data.classification,
    suggestedAnswer: aiRes.data.answer
  });
  await ticket.save();
  logger.info(`Ticket created and classified as ${ticket.classification}`);
  res.json(ticket);
});

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(process.env.PORT || 5000, () => logger.info('Server running'));
