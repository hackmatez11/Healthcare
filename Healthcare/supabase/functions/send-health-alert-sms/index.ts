import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface AlertData {
  user_id: string;
  alert_type: string;
  data: any;
}

serve(async (req) => {
  try {
    const { user_id, alert_type, data }: AlertData = await req.json();

    console.log(`Processing health alert for user: ${user_id}, type: ${alert_type}`);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch patient email and name
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("phone, full_name")
      .eq("id", user_id)
      .single();

    if (patientError || !patient) {
      throw new Error(`Failed to fetch patient: ${patientError?.message}`);
    }

    // Use phone as email (assuming phone field contains email)
    // If you have a separate email field, change this to select("email, full_name")
    const email = patient.phone;

    if (!email) {
      console.log(`No email for user ${user_id}, skipping notification`);
      return new Response(
        JSON.stringify({ success: false, reason: "No email address" }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Format email content based on alert type
    const { subject, htmlContent } = formatEmailContent(alert_type, data, patient.full_name);

    // Send email via Resend API (FREE - 3000 emails/month)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Health Alerts <onboarding@resend.dev>", // Use your verified domain
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Resend API error: ${emailResponse.status} - ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log(`Email sent successfully to ${email}`, emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        email: email,
        subject: subject,
        emailId: emailResult.id
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error sending health alert email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});

function formatEmailContent(alertType: string, data: any, patientName: string) {
  if (alertType === "health_predictions") {
    const subject = `🚨 Critical Health Alert: ${data.condition_name}`;
    const recommendations = data.recommendations && data.recommendations.length > 0
      ? data.recommendations.map((r: string) => `<li>${r}</li>`).join('')
      : '<li>Please consult your healthcare provider immediately.</li>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .risk-level { display: inline-block; padding: 5px 15px; background: #dc2626; color: white; border-radius: 20px; font-weight: bold; }
          .recommendations { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          ul { padding-left: 20px; }
          li { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🚨 Critical Health Alert</h1>
          </div>
          <div class="content">
            <p>Dear ${patientName},</p>
            
            <div class="alert-box">
              <h2 style="margin-top: 0; color: #dc2626;">Critical Risk Detected</h2>
              <p><strong>Condition:</strong> ${data.condition_name}</p>
              <p><strong>Risk Level:</strong> <span class="risk-level">${data.risk_level.toUpperCase()}</span></p>
              ${data.risk_score ? `<p><strong>Risk Score:</strong> ${data.risk_score}/100</p>` : ''}
            </div>

            ${data.description ? `<p>${data.description}</p>` : ''}

            <div class="recommendations">
              <h3 style="margin-top: 0; color: #667eea;">Recommended Actions:</h3>
              <ul>
                ${recommendations}
              </ul>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the full details in your health dashboard</li>
              <li>Consult with your healthcare provider</li>
              <li>Follow the recommended actions above</li>
            </ol>

            <div class="footer">
              <p>This is an automated health alert from your Healthcare System.</p>
              <p>Please do not reply to this email. For questions, contact your healthcare provider.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, htmlContent };
  } else if (alertType === "medical_test_recommendations") {
    const subject = `⚕️ Urgent Medical Test Required: ${data.test_name}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .test-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .priority { display: inline-block; padding: 5px 15px; background: #f59e0b; color: white; border-radius: 20px; font-weight: bold; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">⚕️ Medical Test Recommendation</h1>
          </div>
          <div class="content">
            <p>Dear ${patientName},</p>
            
            <div class="test-box">
              <h2 style="margin-top: 0; color: #f59e0b;">Urgent Test Required</h2>
              <p><strong>Test Name:</strong> ${data.test_name}</p>
              <p><strong>Priority:</strong> <span class="priority">${data.priority_level.toUpperCase()}</span></p>
              ${data.test_category ? `<p><strong>Category:</strong> ${data.test_category}</p>` : ''}
            </div>

            ${data.reason ? `
              <p><strong>Reason for Recommendation:</strong></p>
              <p>${data.reason}</p>
            ` : ''}

            ${data.recommended_frequency ? `
              <p><strong>Recommended Frequency:</strong> ${data.recommended_frequency}</p>
            ` : ''}

            <p><strong>Action Required:</strong></p>
            <p>Please schedule this test as soon as possible. Contact your healthcare provider to book an appointment.</p>

            <div class="footer">
              <p>This is an automated health alert from your Healthcare System.</p>
              <p>Please do not reply to this email. For questions, contact your healthcare provider.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, htmlContent };
  }

  // Fallback
  return {
    subject: "Health Alert Notification",
    htmlContent: `<p>You have a new health alert. Please check your health dashboard for details.</p>`,
  };
}
