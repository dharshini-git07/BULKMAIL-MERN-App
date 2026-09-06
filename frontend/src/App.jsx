import { useState, useRef, useEffect } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function App() {
  const [tab, setTab] = useState('send')
  const [fileName, setFileName] = useState('')
  const [csvEmails, setCsvEmails] = useState([])
  const [manualText, setManualText] = useState('')
  const [sub, setSub] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [dragging, setDragging] = useState(false)

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyErr, setHistoryErr] = useState('')

  const fileInputRef = useRef(null)

  const fetchHistory = async () => {
    setHistoryLoading(true)
    setHistoryErr('')
    try {
      const res = await fetch('http://localhost:5000/api/mail-history')
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      setHistory(data)
    } catch (e) {
      setHistoryErr('Failed to load email history')
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'history') {
      fetchHistory()
    }
  }, [tab])

  const parseCsvText = (text) => {
    const lines = text.split(/[\r\n,]+/)
    const list = []
    lines.forEach(line => {
      const email = line.trim()
      if (emailRegex.test(email)) {
        list.push(email)
      }
    })
    setCsvEmails(Array.from(new Set(list)))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => {
      parseCsvText(evt.target.result)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (evt) => {
        parseCsvText(evt.target.result)
      }
      reader.readAsText(file)
    }
  }

  const getManualEmails = () => {
    const lines = manualText.split(/[\r\n,]+/)
    const list = []
    lines.forEach(line => {
      const email = line.trim()
      if (emailRegex.test(email)) {
        list.push(email)
      }
    })
    return list
  }

  const manualList = getManualEmails()
  const allRecipients = Array.from(new Set([...csvEmails, ...manualList]))

  const handleSend = async () => {
    setMsg('')
    setErr('')

    if (!sub.trim()) {
      setErr('Please enter email subject')
      return
    }
    if (!body.trim()) {
      setErr('Please enter email body')
      return
    }
    if (allRecipients.length === 0) {
      setErr('Please add at least one recipient email')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sub,
          body: body,
          recipients: allRecipients
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMsg(`Success: ${data.message} (${data.count} emails sent)`)
        setSub('')
        setBody('')
        setManualText('')
        setCsvEmails([])
        setFileName('')
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setErr(data.error || 'Failed to send emails')
      }
    } catch (e) {
      setErr('Server connection failed. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>BulkMail</h1>
        <p>Send multiple emails quickly from one place</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'send' ? 'active' : ''}`}
          onClick={() => setTab('send')}
        >
          Send Mail
        </button>
        <button
          className={`tab-btn ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          Mail History
        </button>
      </div>

      {tab === 'send' ? (
        <div>
          {msg && <div className="alert alert-success">{msg}</div>}
          {err && <div className="alert alert-error">{err}</div>}

          <div className="section">
            <label className="label">Upload CSV File</label>
            <div
              className={`drop-zone ${dragging ? 'active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <p>Drag and drop CSV file here or click to browse</p>
              {fileName && <div className="file-name">Selected: {fileName}</div>}
            </div>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="section">
            <label className="label">Manual Recipients (One email per line)</label>
            <textarea
              className="textarea-field"
              style={{ minHeight: '80px' }}
              placeholder="user1@example.com&#10;user2@example.com"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />
          </div>

          <div className="section">
            <div className="counter-badge">
              Total Emails: {allRecipients.length}
            </div>
          </div>

          <div className="section">
            <label className="label">Email Subject</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter email subject"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
            />
          </div>

          <div className="section">
            <label className="label">Email Body</label>
            <textarea
              className="textarea-field"
              placeholder="Enter email message content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <button
            className="btn-send"
            disabled={loading}
            onClick={handleSend}
          >
            {loading ? 'Sending...' : 'Send Emails'}
          </button>
        </div>
      ) : (
        <div>
          {historyLoading && <div className="empty-state">Loading mail history...</div>}
          {historyErr && <div className="alert alert-error">{historyErr}</div>}
          {!historyLoading && !historyErr && history.length === 0 && (
            <div className="empty-state">No email history found.</div>
          )}
          {!historyLoading && history.length > 0 && (
            <div>
              {history.map((item, idx) => (
                <div key={item._id || idx} className="history-item">
                  <div className="history-header">
                    <span className="history-title">{item.subject}</span>
                    <span className={`status-badge status-${item.status}`}>{item.status}</span>
                  </div>
                  <div className="history-meta">
                    <span>Recipients: {item.recipients ? item.recipients.length : 0}</span>
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
