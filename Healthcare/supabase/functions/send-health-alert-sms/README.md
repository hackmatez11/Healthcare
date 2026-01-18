# Email Notification System - FREE with Resend

## Overview

Send **FREE email alerts** to patients when critical health issues are detected!

- ✅ **Completely FREE** - 3,000 emails/month
- ✅ **No credit card required** for free tier
- ✅ **Beautiful HTML emails** with professional design
- ✅ **Easy setup** - 5 minutes

---

## Step 1: Create Resend Account (FREE)

1. Go to https://resend.com/
2. Click **Sign Up** (use GitHub or email)
3. Verify your email
4. You're done! No credit card needed

---

## Step 2: Get API Key

1. Login to Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Copy the API key

---

## Step 3: Add API Key to Supabase

Go to **Supabase Dashboard → Edge Functions → Secrets** and add:

```
RESEND_API_KEY=re_your_api_key_here
```

---

## Step 4: Update Patient Email Addresses

The system uses the `phone` field as email. You need to add email addresses:

```sql
-- Add email column to patients table (if not exists)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS email TEXT;

-- Update patient emails
UPDATE patients 
SET email = 'patient@example.com' 
WHERE id = '3f31cc72-a6a5-48a3-8e79-e9e29106179a';
```

**OR** if you want to use the existing `phone` field for emails:

```sql
-- Just store email in phone field
UPDATE patients 
SET phone = 'patient@example.com' 
WHERE id = '3f31cc72-a6a5-48a3-8e79-e9e29106179a';
```

---

## Step 5: Deploy Edge Function

```powershell
cd d:\Health\Healthcare
npx supabase functions deploy send-health-alert-sms
```

---

## Step 6: Set Up Database Triggers

Run the SQL migration (same as before):

```sql
-- Run the entire 008_sms_notification_triggers.sql file
-- Make sure to replace YOUR_SERVICE_ROLE_KEY with actual key
```

---

## Step 7: Test the System

### Test Manually

```powershell
$PROJECT_URL = "https://edwuptavjdakjuqyrxaf.supabase.co"
$SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkd3VwdGF2amRha2p1cXlyeGFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODIzOTU1MSwiZXhwIjoyMDgzODE1NTUxfQ.aTofp-GOE2re7eZaGDhMFRoCbU0LcvNg-x0-Khg57Qo"

$body = @{
  user_id = "3f31cc72-a6a5-48a3-8e79-e9e29106179a"
  alert_type = "health_predictions"
  data = @{
    condition_name = "Test Critical Condition"
    risk_level = "critical"
    risk_score = 85
    description = "This is a test alert"
    recommendations = @("Consult doctor immediately", "Monitor symptoms")
  }
} | ConvertTo-Json

Invoke-RestMethod -Uri "$PROJECT_URL/functions/v1/send-health-alert-sms" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type" = "application/json"
  } `
  -Body $body
```

### Test via Database Insert

```sql
INSERT INTO health_predictions (
  user_id,
  prediction_type,
  condition_name,
  risk_score,
  risk_level,
  description,
  recommendations,
  is_active
) VALUES (
  '3f31cc72-a6a5-48a3-8e79-e9e29106179a',
  'condition_risk',
  'Test Critical Alert',
  85,
  'critical',
  'This is a test critical health alert',
  ARRAY['Seek immediate medical attention'],
  true
);
```

**Expected:** Email should be sent automatically!

---

## Email Preview

### Critical Health Alert Email

![Email Preview](https://via.placeholder.com/600x400/667eea/ffffff?text=Beautiful+HTML+Email)

- Professional gradient header
- Color-coded risk levels
- Clear action items
- Responsive design

---

## Troubleshooting

### Email Not Sending

**Check API Key:**
- Verify `RESEND_API_KEY` is set in Supabase secrets
- Make sure it starts with `re_`

**Check Email Address:**
```sql
SELECT phone FROM patients WHERE id = '3f31cc72-a6a5-48a3-8e79-e9e29106179a';
```
- Must be a valid email address
- Update if needed

**Check Resend Dashboard:**
- Login to Resend
- Go to **Emails** section
- Check delivery status

### Resend Free Tier Limits

- **3,000 emails/month** - FREE
- **100 emails/day** - FREE
- No credit card required

If you need more:
- Paid plan: $20/month for 50,000 emails

---

## Cost Comparison

| Service | Free Tier | Cost per SMS/Email |
|---------|-----------|-------------------|
| Fast2SMS | 50 SMS (web only) | ₹0.15-0.25 |
| Twilio | $15 credit | $0.0079 (~₹0.50) |
| **Resend** | **3,000 emails** | **FREE** ✅ |

**Winner: Resend!** 🎉

---

## Next Steps

1. ✅ Create Resend account
2. ✅ Get API key
3. ✅ Add to Supabase secrets
4. ✅ Update patient emails
5. ✅ Deploy function
6. ✅ Test!

The email notification system is ready! 📧
