'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const { calculate, summarise } = require('./lib/attendance');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'BunkWise', time: new Date().toISOString() });
});

app.post('/api/calculate', (req, res) => {
  const result = calculate(req.body || {});
  if (result.error) return res.status(400).json({ error: result.error });
  return res.json(result);
});

app.post('/api/summary', (req, res) => {
  const { subjects, target } = req.body || {};
  const result = summarise(subjects, target === undefined ? 75 : target);
  if (result.error) return res.status(400).json({ error: result.error });
  return res.json(result);
});

// Serve the built frontend (dist/) if present, otherwise the source (public/).
const dist = path.join(__dirname, 'dist');
const staticDir = fs.existsSync(dist) ? dist : path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
