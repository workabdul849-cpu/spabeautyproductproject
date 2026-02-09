const express = require('express');
const twilio = require('twilio');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

// Initialise Twilio client if credentials exist
let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send an SMS or WhatsApp message
router.post('/send', requirePermission('notifications', 'write'), async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: 'Twilio not configured' });
  }
  const { to, message, channel } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'Recipient and message are required' });
  }
  try {
    // For WhatsApp messages, Twilio expects the from/to numbers to be prefixed with "whatsapp:"
    const from = channel === 'whatsapp'
      ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
      : process.env.TWILIO_PHONE_NUMBER;
    const destination = channel === 'whatsapp' ? `whatsapp:${to}` : to;
    const result = await client.messages.create({
      body: message,
      to: destination,
      from,
    });
    return res.json({ sid: result.sid, status: result.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;