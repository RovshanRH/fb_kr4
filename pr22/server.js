const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const instanceName = process.env.INSTANCE_NAME || `backend-${port}`;
const responseDelayMs = Number(process.env.RESPONSE_DELAY_MS || 0);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', instance: instanceName, port });
});

app.get('/', async (req, res) => {
  if (responseDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, responseDelayMs));
  }

  res.json({
    message: 'Response from backend server',
    instance: instanceName,
    port,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    instance: instanceName,
    port,
    pid: process.pid,
    uptime: Math.round(process.uptime())
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server ${instanceName} started on http://localhost:${port}`);
});