import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import dns from 'dns'
import Mail from './models/Mail.js'

try {
  dns.setServers(['8.8.8.8', '8.8.4.4'])
} catch (e) {}

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const connectDb = async () => {
  if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI)
    } catch (e) {}
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/send-mail', async (req, res) => {
  await connectDb()
  const { subject, body, recipients } = req.body

  if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'Subject, body and recipients are required' })
  }

  const valid = recipients.filter(email => typeof email === 'string' && emailRegex.test(email.trim()))

  if (valid.length === 0) {
    return res.status(400).json({ error: 'No valid recipient email addresses provided' })
  }

  let status = 'failed'
  let info = null

  try {
    const trans = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    info = await trans.sendMail({
      from: process.env.EMAIL_USER,
      to: valid.join(', '),
      subject: subject,
      text: body
    })

    status = 'sent'
  } catch (err) {
    status = 'failed'
  }

  if (mongoose.connection.readyState === 1) {
    try {
      await Mail.create({
        subject,
        body,
        recipients: valid,
        status
      })
    } catch (dbErr) {}
  }

  if (status === 'sent') {
    res.json({
      success: true,
      message: 'Email sent successfully',
      count: valid.length,
      recipients: valid,
      messageId: info ? info.messageId : null
    })
  } else {
    res.status(500).json({ error: 'Failed to send email' })
  }
})

app.get('/api/mail-history', async (req, res) => {
  await connectDb()
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([])
    }
    const history = await Mail.find().sort({ createdAt: -1 })
    res.json(history)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch email history' })
  }
})

export default app
