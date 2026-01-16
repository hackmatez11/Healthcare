// ============================================
// LIFESTYLE DATA RENDERING
// ============================================

// Render lifestyle analytics section
function renderLifestyleAnalytics(lifestyleData) {
    if (!lifestyleData || !lifestyleData.hasData) {
        return `
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          Lifestyle Analytics
        </h2>
        <div class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p>No lifestyle data available yet</p>
        </div>
      </div>
    `;
    }

    const { stats, goals } = lifestyleData;

    const metrics = [
        {
            icon: '🌙',
            label: 'Avg Sleep',
            value: `${stats.avgSleep}h`,
            target: '8h',
            progress: stats.sleepProgress,
            color: 'purple'
        },
        {
            icon: '👟',
            label: 'Avg Steps',
            value: stats.avgSteps.toLocaleString(),
            target: '10k',
            progress: stats.stepsProgress,
            color: 'blue'
        },
        {
            icon: '💧',
            label: 'Hydration',
            value: `${stats.avgHydration} cups`,
            target: '10 cups',
            progress: stats.hydrationProgress,
            color: 'cyan'
        },
        {
            icon: '🍽️',
            label: 'Avg Calories',
            value: stats.avgCalories.toLocaleString(),
            target: '2,000',
            progress: stats.caloriesProgress,
            color: 'orange'
        }
    ];

    const colorClasses = {
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-500' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-500' },
        cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', bar: 'bg-cyan-500' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-500' }
    };

    return `
    <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        Lifestyle Analytics
        <span class="text-sm font-normal text-gray-500 ml-auto">Last 7 days</span>
      </h2>

      <!-- Metrics Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        ${metrics.map(metric => {
        const colors = colorClasses[metric.color];
        return `
            <div class="bg-white border-2 border-gray-200 rounded-xl p-4 fade-in">
              <div class="flex items-center gap-3 mb-3">
                <div class="${colors.bg} p-2 rounded-lg">
                  <span class="text-2xl">${metric.icon}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-500">${metric.label}</p>
                  <p class="font-bold text-lg text-gray-800 truncate">${metric.value}</p>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">Target: ${metric.target}</span>
                  <span class="${colors.text} font-medium">${metric.progress}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="${colors.bar} h-2 rounded-full transition-all" style="width: ${metric.progress}%"></div>
                </div>
              </div>
            </div>
          `;
    }).join('')}
      </div>

      <!-- Goals Section -->
      ${goals && goals.length > 0 ? `
        <div class="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Active Goals
          </h3>
          <div class="space-y-3">
            ${goals.slice(0, 4).map(goal => {
        const progress = Math.min(100, Math.round(((goal.current_value || 0) / goal.target_value) * 100));
        return `
                <div class="bg-white rounded-lg p-3">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <p class="font-medium text-gray-800 text-sm">${goal.title}</p>
                      <p class="text-xs text-gray-500">
                        ${goal.current_value || 0} / ${goal.target_value} ${goal.unit}
                      </p>
                    </div>
                    <span class="text-xs font-semibold text-green-600">${progress}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all" style="width: ${progress}%"></div>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Health Summary -->
      <div class="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
        <h3 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Weekly Summary
        </h3>
        <div class="text-sm text-gray-700 space-y-1">
          ${stats.avgSleep >= 7 ?
            '<p>✅ Sleep duration is healthy</p>' :
            '<p>⚠️ Consider getting more sleep for better health</p>'
        }
          ${stats.avgSteps >= 7000 ?
            '<p>✅ Good activity level maintained</p>' :
            '<p>⚠️ Try to increase daily physical activity</p>'
        }
          ${stats.avgHydration >= 8 ?
            '<p>✅ Hydration levels are good</p>' :
            '<p>⚠️ Remember to drink more water throughout the day</p>'
        }
        </div>
      </div>
    </div>
  `;
}
