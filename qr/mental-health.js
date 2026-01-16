// ============================================
// MENTAL HEALTH ANALYTICS RENDERING
// ============================================

// Score interpretation functions
function interpretScore(score, type) {
    const interpretations = {
        moodStability: [
            { min: 70, level: 'Excellent', description: 'Your mood is very stable with minimal fluctuations', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            { min: 50, level: 'Good', description: 'Your mood shows healthy variation with overall stability', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { min: 30, level: 'Moderate', description: 'Your mood shows some fluctuation that may benefit from attention', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { min: 0, level: 'Needs Attention', description: 'Your mood shows significant fluctuation - consider reaching out for support', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
        ],
        stressResilience: [
            { min: 70, level: 'High', description: 'You handle stress very well and recover quickly', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            { min: 50, level: 'Moderate', description: 'You manage stress reasonably well', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { min: 30, level: 'Low', description: 'Stress may be impacting you more than usual', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { min: 0, level: 'Very Low', description: 'You may be struggling with stress - consider stress management techniques', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
        ],
        burnoutRisk: [
            { min: 70, level: 'High Risk', description: 'Signs of burnout detected - please prioritize self-care', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
            { min: 50, level: 'Moderate Risk', description: 'Some burnout indicators present - watch your energy levels', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { min: 30, level: 'Low Risk', description: 'Minimal burnout signs - maintain healthy habits', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { min: 0, level: 'Minimal Risk', description: 'You\'re managing your energy well', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
        ],
        socialConnection: [
            { min: 70, level: 'Strong', description: 'You have healthy social connections', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            { min: 50, level: 'Moderate', description: 'Your social connections are adequate', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { min: 30, level: 'Limited', description: 'Consider reaching out to friends or loved ones', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { min: 0, level: 'Low', description: 'Social connection may need attention - consider connecting with others', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
        ],
        cognitiveFatigue: [
            { min: 70, level: 'High', description: 'You may be experiencing significant mental fatigue', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
            { min: 50, level: 'Moderate', description: 'Some mental fatigue detected - consider taking breaks', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { min: 30, level: 'Low', description: 'Your cognitive function is good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { min: 0, level: 'Minimal', description: 'You\'re mentally sharp and focused', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
        ],
        overallWellbeing: [
            { min: 75, level: 'Excellent', description: 'Your overall mental wellbeing is very strong', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            { min: 60, level: 'Good', description: 'Your mental wellbeing is healthy', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { min: 40, level: 'Fair', description: 'Your wellbeing could benefit from some attention', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { min: 0, level: 'Needs Support', description: 'Consider reaching out for professional support', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
        ]
    };

    const ranges = interpretations[type];
    for (let i = 0; i < ranges.length; i++) {
        if (score >= ranges[i].min) {
            return ranges[i];
        }
    }
    return ranges[ranges.length - 1];
}

// Get recommendations based on scores
function getRecommendations(scores) {
    const recommendations = [];

    if (scores.mood_stability_index < 50) {
        recommendations.push('Practice daily mood tracking to identify patterns');
        recommendations.push('Consider mindfulness or meditation exercises');
    }

    if (scores.stress_resilience_score < 50) {
        recommendations.push('Try breathing exercises when feeling stressed');
        recommendations.push('Build a stress management routine');
    }

    if (scores.burnout_risk_score > 50) {
        recommendations.push('Prioritize rest and recovery time');
        recommendations.push('Set boundaries around work and personal time');
        recommendations.push('Engage in activities that energize you');
    }

    if (scores.social_connection_index < 50) {
        recommendations.push('Reach out to a friend or family member');
        recommendations.push('Join a community or group activity');
    }

    if (scores.cognitive_fatigue_score > 50) {
        recommendations.push('Take regular breaks during focused work');
        recommendations.push('Ensure you\'re getting adequate sleep');
        recommendations.push('Try cognitive games to maintain mental sharpness');
    }

    if (recommendations.length === 0) {
        recommendations.push('Keep up your healthy habits!');
        recommendations.push('Continue monitoring your mental health');
    }

    return recommendations;
}

// Render mental health analytics
function renderMentalHealthAnalytics(scores) {
    if (!scores) {
        return `
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          Mental Health Analytics
        </h2>
        <div class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <p>No mental health data available yet</p>
        </div>
      </div>
    `;
    }

    const overallInterpretation = interpretScore(scores.overall_wellbeing_score, 'overallWellbeing');
    const moodInterpretation = interpretScore(scores.mood_stability_index, 'moodStability');
    const stressInterpretation = interpretScore(scores.stress_resilience_score, 'stressResilience');
    const burnoutInterpretation = interpretScore(scores.burnout_risk_score, 'burnoutRisk');
    const socialInterpretation = interpretScore(scores.social_connection_index, 'socialConnection');
    const cognitiveInterpretation = interpretScore(scores.cognitive_fatigue_score, 'cognitiveFatigue');
    const recommendations = getRecommendations(scores);

    const scoreCards = [
        { title: 'Mood Stability', score: scores.mood_stability_index, interpretation: moodInterpretation, icon: '📊' },
        { title: 'Stress Resilience', score: scores.stress_resilience_score, interpretation: stressInterpretation, icon: '⚡' },
        { title: 'Burnout Risk', score: scores.burnout_risk_score, interpretation: burnoutInterpretation, icon: '⚠️', inverted: true },
        { title: 'Social Connection', score: scores.social_connection_index, interpretation: socialInterpretation, icon: '❤️' },
        { title: 'Cognitive Fatigue', score: scores.cognitive_fatigue_score, interpretation: cognitiveInterpretation, icon: '🧠', inverted: true }
    ];

    return `
    <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        Mental Health Analytics
      </h2>

      <!-- Overall Wellbeing - Featured -->
      <div class="p-6 ${overallInterpretation.bgColor} rounded-xl border-2 ${overallInterpretation.borderColor} mb-6 fade-in">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-1">Overall Wellbeing</h3>
            <p class="text-sm text-gray-600">Based on recent mental health data</p>
          </div>
          <div class="text-right">
            <div class="text-5xl font-bold text-gray-800">${Math.round(scores.overall_wellbeing_score)}</div>
            <div class="${overallInterpretation.color} text-sm font-medium">${overallInterpretation.level}</div>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all" style="width: ${scores.overall_wellbeing_score}%"></div>
        </div>
        <p class="text-sm text-gray-600">${overallInterpretation.description}</p>
      </div>

      <!-- Individual Scores -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${scoreCards.map(card => {
        const displayScore = card.inverted ? 100 - card.score : card.score;
        return `
            <div class="bg-white border-2 ${card.interpretation.borderColor} rounded-xl p-4 fade-in">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${card.icon}</span>
                  <div>
                    <h4 class="font-semibold text-gray-800">${card.title}</h4>
                    <p class="${card.interpretation.color} text-xs font-medium">${card.interpretation.level}</p>
                  </div>
                </div>
                <div class="text-2xl font-bold text-gray-800">${Math.round(card.score)}</div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all" style="width: ${displayScore}%"></div>
              </div>
              <p class="text-xs text-gray-600">${card.interpretation.description}</p>
            </div>
          `;
    }).join('')}
      </div>

      <!-- Recommendations -->
      ${recommendations.length > 0 ? `
        <div class="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 fade-in">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            Personalized Recommendations
          </h3>
          <ul class="space-y-2">
            ${recommendations.map(rec => `
              <li class="flex items-start gap-2 text-sm text-gray-700">
                <span class="text-blue-600 mt-0.5">•</span>
                <span>${rec}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}
