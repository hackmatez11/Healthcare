// ============================================
// MAIN RENDERING LOGIC
// ============================================

// Render patient data
function renderPatient(data, documents, mentalHealthScores, lifestyleData) {
    document.getElementById('app').innerHTML = `
    <div class="py-8 px-4">
      <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">
                ${data.full_name || 'Patient'}'s Medical Profile
              </h1>
              <p class="text-gray-500">Complete Medical Information</p>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Basic Information
          </h2>
          <div class="grid md:grid-cols-2 gap-4">
            ${InfoCard(icons.user, 'Date of Birth', data.dob)}
            ${InfoCard(icons.user, 'Gender', data.gender)}
            ${InfoCard(icons.droplet, 'Blood Group', data.blood_group, true)}
            ${InfoCard(icons.phone, 'Phone', data.phone)}
            ${InfoCard(icons.phone, 'Emergency Contact', data.emergency_contact, true)}
            ${InfoCard(icons.activity, 'Height', data.height ? `${data.height} cm` : null)}
            ${InfoCard(icons.activity, 'Weight', data.weight ? `${data.weight} kg` : null)}
          </div>
        </div>

        <!-- Medical History -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Medical History
          </h2>
          <div class="space-y-4">
            ${data.diseases ? `
              <div class="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <div class="flex items-start gap-3">
                  ${icons.alert.replace('w-5 h-5', 'w-5 h-5 text-red-600 mt-1')}
                  <div>
                    <p class="font-semibold text-red-800 mb-1">Known Diseases</p>
                    <p class="text-red-700">${data.diseases}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${data.allergies ? `
              <div class="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                <div class="flex items-start gap-3">
                  ${icons.alert.replace('w-5 h-5', 'w-5 h-5 text-orange-600 mt-1')}
                  <div>
                    <p class="font-semibold text-orange-800 mb-1">Allergies</p>
                    <p class="text-orange-700">${data.allergies}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${data.medications ? `
              <div class="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div class="flex items-start gap-3">
                  ${icons.pill.replace('w-5 h-5', 'w-5 h-5 text-blue-600 mt-1')}
                  <div>
                    <p class="font-semibold text-blue-800 mb-1">Current Medications</p>
                    <p class="text-blue-700">${data.medications}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${data.surgeries ? `
              <div class="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div class="flex items-start gap-3">
                  ${icons.file.replace('w-5 h-5', 'w-5 h-5 text-purple-600 mt-1')}
                  <div>
                    <p class="font-semibold text-purple-800 mb-1">Past Surgeries</p>
                    <p class="text-purple-700">${data.surgeries}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${data.lifestyle ? `
              <div class="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div class="flex items-start gap-3">
                  ${icons.activity.replace('w-5 h-5', 'w-5 h-5 text-green-600 mt-1')}
                  <div>
                    <p class="font-semibold text-green-800 mb-1">Lifestyle</p>
                    <p class="text-green-700">${data.lifestyle}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${data.notes ? `
              <div class="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div class="flex items-start gap-3">
                  ${icons.file.replace('w-5 h-5', 'w-5 h-5 text-gray-600 mt-1')}
                  <div>
                    <p class="font-semibold text-gray-800 mb-1">Additional Notes</p>
                    <p class="text-gray-700">${data.notes}</p>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Lifestyle Analytics -->
        ${renderLifestyleAnalytics(lifestyleData)}

        <!-- Mental Health Analytics -->
        ${renderMentalHealthAnalytics(mentalHealthScores)}

        <!-- Medical Documents -->
        ${renderDocuments(documents)}

        <!-- Footer -->
        <div class="text-center text-gray-500 text-sm">
          <p>This medical information is confidential and should only be accessed by authorized medical personnel.</p>
        </div>

      </div>
    </div>
  `;
}

// Main function
async function loadPatientData() {
    showLoading();

    const patientId = getPatientId();

    if (!patientId) {
        showError('No patient ID provided in URL');
        return;
    }

    console.log('Loading data for patient ID:', patientId);

    try {
        // Fetch all data in parallel
        const [patientData, documents, mentalHealthScores, lifestyleData] = await Promise.all([
            fetchPatientData(patientId),
            fetchPatientDocuments(patientId),
            fetchMentalHealthScores(patientId),
            fetchLifestyleData(patientId)
        ]);

        console.log('All data loaded:', { patientData, documents, mentalHealthScores, lifestyleData });

        renderPatient(patientData, documents, mentalHealthScores, lifestyleData);
    } catch (err) {
        console.error('Error:', err);
        showError('Failed to load patient data. Please check your configuration.');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadPatientData);
