# n8n Setup - No Environment Variables Needed! ✅

## Quick Start

Your n8n workflows are now configured with **hardcoded credentials** - no environment variables needed!

---

## Step 1: Import Workflows into n8n

### For n8n Cloud:

1. Go to [n8n.cloud](https://n8n.cloud) and sign in
2. Click **Workflows** → **Add Workflow** → **Import from File**
3. Import `check-availability.json`
4. Import `book-appointment.json`

### For Self-Hosted n8n:

1. Access your n8n instance (e.g., `http://localhost:5678`)
2. Click **Workflows** → **Import from File**
3. Import both JSON files

---

## Step 2: Activate the Workflows

1. Open **check-availability** workflow
2. Click the **toggle switch** at top-right (should turn green)
3. Open **book-appointment** workflow  
4. Click the **toggle switch** (should turn green)

**Both workflows must be active!**

---

## Step 3: Get Webhook URLs

### For check-availability:

1. Open the workflow
2. Click on the **Webhook** node
3. Copy the **Production URL**
   - Example: `https://your-n8n.app.n8n.cloud/webhook/check-availability`
4. **Save this URL** - you'll need it for ElevenLabs

### For book-appointment:

1. Open the workflow
2. Click on the **Webhook** node
3. Copy the **Production URL**
   - Example: `https://your-n8n.app.n8n.cloud/webhook/book-appointment`
4. **Save this URL** - you'll need it for ElevenLabs

---

## Step 4: Test the Workflows

Test to make sure they work:

### Test Check Availability:

```bash
curl -X POST https://your-n8n-url/webhook/check-availability \
  -H "Content-Type: application/json" \
  -d '{"doctor_id":"1","date":"2026-01-25","time":"10:00"}'
```

**Expected Response**:
```json
{
  "available": true,
  "message": "This slot is available for booking!"
}
```

### Test Book Appointment:

```bash
curl -X POST https://your-n8n-url/webhook/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_123",
    "doctor_id": "1",
    "doctor_name": "Dr. Sarah Chen",
    "specialty": "General Physician",
    "date": "2026-01-25",
    "time": "10:00",
    "patient_name": "Test Patient",
    "patient_phone": "+1234567890",
    "patient_email": "test@example.com"
  }'
```

---

## Step 5: Configure ElevenLabs

Now add your webhook URLs to ElevenLabs:

1. Go to your ElevenLabs agent
2. Edit **checkAvailability** tool:
   - Set **Webhook URL** to your check-availability URL
3. Edit **bookAppointment** tool:
   - Set **Webhook URL** to your book-appointment URL
4. **Save** the agent

---

## That's It! 🎉

No environment variables needed. The workflows have your Supabase credentials built-in.

### Quick Checklist:

- [ ] Import both workflows to n8n
- [ ] Activate both workflows (green toggle)
- [ ] Copy check-availability webhook URL
- [ ] Copy book-appointment webhook URL
- [ ] Test both webhooks with curl
- [ ] Add webhook URLs to ElevenLabs agent
- [ ] Test voice booking from website

---

## Troubleshooting

**Webhook not responding?**
- Make sure workflow is **active** (green toggle)
- Check that webhook URL is correct
- Try testing with curl first

**Database errors?**
- Make sure you've run the database migration
- Check Supabase logs

**ElevenLabs not calling webhooks?**
- Verify webhook URLs are correct in ElevenLabs
- Make sure webhooks are publicly accessible
- Check ElevenLabs agent logs

---

## Next Steps

1. ✅ Workflows configured (no env vars needed!)
2. 📝 Configure ElevenLabs agent
3. 🎙️ Test voice booking
4. 🚀 Deploy to production

See `ELEVENLABS_SETUP.md` for ElevenLabs configuration details.
