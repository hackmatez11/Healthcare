# n8n Post-Import Configuration Guide

## After Importing the Workflows

Once you've imported the `check-availability.json` and `book-appointment.json` workflows into n8n, follow these steps to configure and activate them.

---

## Step 1: Configure Environment Variables

Both workflows use environment variables to connect to Supabase. You need to set these up.

### In n8n Cloud:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:
   - `SUPABASE_URL`: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - `SUPABASE_KEY`: Your Supabase **service role key** (from Supabase dashboard → Settings → API)

### In Self-Hosted n8n:

Add to your `docker-compose.yml` or environment:
```yaml
environment:
  - SUPABASE_URL=https://your-project.supabase.co
  - SUPABASE_KEY=your_service_role_key_here
```

Then restart n8n:
```bash
docker-compose restart
```

---

## Step 2: Review and Update Workflow Nodes

### For Both Workflows:

1. **Open the workflow** in n8n editor
2. **Click on each node** to review settings
3. **Check the HTTP Request nodes** that connect to Supabase:
   - Verify the URL uses `{{$env.SUPABASE_URL}}`
   - Verify headers use `{{$env.SUPABASE_KEY}}`

### Specific Nodes to Check:

#### Check Availability Workflow:
- **Webhook Node**: Note the webhook URL (you'll need this later)
- **HTTP Request Node** (Query Supabase): Verify URL and headers
- **Function Nodes**: Review logic (usually no changes needed)

#### Book Appointment Workflow:
- **Webhook Node**: Note the webhook URL
- **HTTP Request Nodes**: Verify all Supabase connections
- **IF Node**: Review availability check logic

---

## Step 3: Activate the Workflows

1. Click the **toggle switch** at the top right of each workflow
2. The workflow should turn from gray to **green/active**
3. You should see "Workflow activated" message

**Important**: Both workflows must be active for the voice booking to work!

---

## Step 4: Get Webhook URLs

After activation, you need to copy the webhook URLs for ElevenLabs/VAPI configuration.

### To Get Webhook URLs:

1. Open the **check-availability** workflow
2. Click on the **Webhook** node
3. Copy the **Production URL** (looks like: `https://your-n8n.app.n8n.cloud/webhook/check-availability`)
4. Save this URL

5. Repeat for **book-appointment** workflow
6. Copy its webhook URL (looks like: `https://your-n8n.app.n8n.cloud/webhook/book-appointment`)

**Save both URLs** - you'll need them for ElevenLabs configuration!

---

## Step 5: Test the Workflows

Before integrating with ElevenLabs, test the workflows directly.

### Test Check Availability:

```bash
curl -X POST https://your-n8n-instance.com/webhook/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "1",
    "date": "2026-01-25",
    "time": "10:00"
  }'
```

**Expected Response**:
```json
{
  "available": true,
  "doctor_id": "1",
  "date": "2026-01-25",
  "time": "10:00",
  "message": "This slot is available for booking!"
}
```

### Test Book Appointment:

```bash
curl -X POST https://your-n8n-instance.com/webhook/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session_123",
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

**Expected Response**:
```json
{
  "success": true,
  "appointment_id": "uuid-here",
  "message": "Great! Your appointment with Dr. Sarah Chen is confirmed..."
}
```

---

## Step 6: Configure ElevenLabs with Webhook URLs

Now that your workflows are active, configure ElevenLabs to use them.

### In ElevenLabs Dashboard:

1. Go to your **Healthcare Booking Assistant** agent
2. Navigate to **Custom Tools**
3. Edit **checkAvailability** tool:
   - Set **Webhook URL** to your check-availability webhook URL
   - Verify HTTP Method is **POST**
4. Edit **bookAppointment** tool:
   - Set **Webhook URL** to your book-appointment webhook URL
   - Verify HTTP Method is **POST**
5. **Save** the agent configuration

---

## Step 7: Monitor Workflow Executions

### View Execution History:

1. In n8n, go to **Executions** tab
2. You'll see all workflow runs
3. Click on any execution to see:
   - Input data
   - Output from each node
   - Any errors

### Debug Issues:

If a workflow fails:
1. Click on the failed execution
2. Check which node failed (marked in red)
3. Review the error message
4. Common issues:
   - Environment variables not set
   - Supabase credentials incorrect
   - Database functions not deployed
   - Invalid input data format

---

## Step 8: Set Up Monitoring (Optional)

### Enable Error Notifications:

1. In n8n workflow settings
2. Go to **Workflow Settings** → **Error Workflow**
3. Set up email notifications for failures

### Add Logging:

You can add **Function** nodes to log important data:
```javascript
console.log('Booking request:', $json);
return $json;
```

---

## Common Issues & Solutions

### ❌ "Environment variable not found"
**Solution**: Make sure `SUPABASE_URL` and `SUPABASE_KEY` are set in n8n settings

### ❌ "Webhook not responding"
**Solution**: 
- Verify workflow is **active** (green toggle)
- Check webhook URL is correct
- Try testing with curl first

### ❌ "Database error"
**Solution**:
- Verify Supabase credentials are correct
- Check that database migrations have been run
- Verify RPC functions exist in Supabase

### ❌ "Tool not being called by ElevenLabs"
**Solution**:
- Verify webhook URLs in ElevenLabs match n8n URLs
- Check that webhooks are publicly accessible (not localhost)
- Review ElevenLabs agent logs

---

## Quick Checklist

After importing workflows, complete this checklist:

- [ ] Set `SUPABASE_URL` environment variable
- [ ] Set `SUPABASE_KEY` environment variable
- [ ] Activate check-availability workflow
- [ ] Activate book-appointment workflow
- [ ] Copy check-availability webhook URL
- [ ] Copy book-appointment webhook URL
- [ ] Test check-availability with curl
- [ ] Test book-appointment with curl
- [ ] Configure ElevenLabs tools with webhook URLs
- [ ] Test end-to-end voice booking

---

## Next Steps

Once workflows are configured and tested:

1. ✅ Configure ElevenLabs agent (see `ELEVENLABS_SETUP.md`)
2. ✅ Add `VITE_ELEVENLABS_AGENT_ID` to your `.env` file
3. ✅ Test voice booking from your website
4. ✅ Monitor executions and optimize

---

## Need Help?

- **n8n Docs**: [docs.n8n.io](https://docs.n8n.io)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **Workflow Issues**: Check execution logs in n8n
- **Supabase Issues**: Check Supabase logs and Edge Function logs

---

## Pro Tips

💡 **Use Test Executions**: Click "Execute Workflow" button to test manually before activating

💡 **Version Control**: Export workflows regularly and save to git

💡 **Monitor Costs**: Check n8n execution count to stay within plan limits

💡 **Add Validation**: Add Function nodes to validate input data before processing

💡 **Error Handling**: Add IF nodes to handle edge cases gracefully
