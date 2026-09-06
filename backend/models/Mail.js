import mongoose from 'mongoose'

const mailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  status: { type: String, enum: ['sent', 'failed'], required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Mail', mailSchema)
