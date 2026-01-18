import Groq from 'groq-sdk';
import fs from 'fs';
import dotenv from 'dotenv';
import InferenceHTTPClient from 'inference-sdk';

// Load environment variables
dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Convert image to base64
function imageToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
}



CLIENT = InferenceHTTPClient(
  api_url = "https://serverless.roboflow.com",
  api_key = "OnGIwp43w9s3C9lPMInc"
)

re = CLIENT.infer(your_image.jpg, model_id = "skin-disease-x965d/1")
// Specialized prompts for each medical imaging type
const prompts = {
  xray: `You are an expert radiologist analyzing an X-ray image. Provide a detailed medical analysis including:
1. Overall impression and image quality
2. Normal findings (if any)
3. Abnormal findings or areas of concern (if any)
4. Specific anatomical observations
5. Recommendations for follow-up or further testing
6. Confidence level in your assessment

Format your response in a clear, structured manner. Be thorough but concise. If you see any concerning findings, clearly state them. Always include a disclaimer that this is AI-assisted analysis and should be reviewed by a qualified healthcare professional.`,

  mri: `You are an expert radiologist analyzing an MRI scan. Provide a comprehensive medical analysis including:
1. Image quality and sequences visible
2. Normal anatomical structures observed
3. Any abnormalities, lesions, or areas of concern
4. Signal characteristics and their clinical significance
5. Differential diagnosis if applicable
6. Recommendations for clinical correlation or additional imaging

Be specific about anatomical locations and findings. Always note that this analysis should be confirmed by a board-certified radiologist.`,

  ct: `You are an expert radiologist analyzing a CT scan. Provide a detailed medical analysis including:
1. Image quality and contrast enhancement (if applicable)
2. Normal anatomical findings
3. Any abnormalities, masses, or pathological findings
4. Measurements of significant findings
5. Assessment of surrounding structures
6. Clinical recommendations and follow-up suggestions

Use precise medical terminology. Always emphasize that final diagnosis requires clinical correlation and review by a qualified radiologist.`,

  labReport: `You are a clinical pathologist analyzing a laboratory report. Provide a comprehensive analysis including:
1. Test results summary
2. Values outside normal ranges (if any)
3. Clinical significance of abnormal findings
4. Possible diagnoses or conditions indicated
5. Recommendations for additional testing
6. General health insights

Explain findings in clear medical terms. Note that interpretation should be done in context of patient's clinical history by their healthcare provider.`,

  skin: `You are a dermatologist analyzing a skin condition image. Provide a detailed dermatological assessment including:
1. Description of the skin lesion or condition
2. Morphological characteristics (color, texture, borders, size)
3. Possible diagnoses (differential diagnosis)
4. Severity assessment (mild, moderate, severe)
5. Recommended treatments or interventions
6. When to seek immediate medical attention

Be specific about visual characteristics. Always emphasize that skin conditions require in-person examination by a dermatologist for accurate diagnosis and treatment.`
};

// Main analysis function
export async function analyzeImage(imagePath, analysisType) {
  try {
    // Convert image to base64
    const base64Image = imageToBase64(imagePath);

    // Get the appropriate prompt
    const systemPrompt = prompts[analysisType];

    if (!systemPrompt) {
      throw new Error(`Invalid analysis type: ${analysisType}`);
    }

    // Call Groq API with Llama 4 Scout vision model
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: systemPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 2048,
      top_p: 0.9
    });

    // Extract the response
    const analysis = completion.choices[0]?.message?.content || 'No analysis generated';

    // Parse and structure the response
    return {
      success: true,
      analysis: analysis,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      timestamp: new Date().toISOString(),
      analysisType: analysisType
    };

  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

// Helper function to extract structured data from analysis
export function parseAnalysisResponse(analysisText, analysisType) {
  // This function can be enhanced to extract specific fields
  // For now, returning the full analysis with basic structure

  const sections = analysisText.split('\n\n');

  return {
    fullAnalysis: analysisText,
    sections: sections.filter(s => s.trim().length > 0),
    summary: sections[0] || analysisText.substring(0, 200) + '...'
  };
}
