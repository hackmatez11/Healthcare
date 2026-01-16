// ============================================
// API FUNCTIONS - Data Fetching from Supabase
// ============================================

// Fetch patient data
async function fetchPatientData(patientId) {
    const { data, error } = await supabaseClient
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

    if (error) throw error;
    return data;
}

// Fetch patient documents
async function fetchPatientDocuments(patientId) {
    const { data, error } = await supabaseClient
        .from('patient_documents')
        .select('*')
        .eq('patient_id', patientId)
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
    return data || [];
}

// Fetch mental health scores
async function fetchMentalHealthScores(patientId) {
    const { data, error } = await supabaseClient
        .from('mental_health_scores')
        .select('*')
        .eq('user_id', patientId)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching mental health scores:', error);
    }
    return data || null;
}

// Fetch lifestyle data
async function fetchLifestyleData(patientId) {
    try {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        const dateStr = weekAgo.toISOString().split('T')[0];

        // Fetch all lifestyle data for the past week
        const [sleepRes, activityRes, hydrationRes, nutritionRes, goalsRes] = await Promise.all([
            supabaseClient
                .from('lifestyle_sleep_entries')
                .select('*')
                .eq('user_id', patientId)
                .gte('date', dateStr)
                .order('date', { ascending: false }),

            supabaseClient
                .from('lifestyle_activity_entries')
                .select('*')
                .eq('user_id', patientId)
                .gte('date', dateStr)
                .order('date', { ascending: false }),

            supabaseClient
                .from('lifestyle_hydration_entries')
                .select('*')
                .eq('user_id', patientId)
                .gte('date', dateStr)
                .order('date', { ascending: false }),

            supabaseClient
                .from('lifestyle_nutrition_entries')
                .select('*')
                .eq('user_id', patientId)
                .gte('date', dateStr)
                .order('date', { ascending: false }),

            supabaseClient
                .from('lifestyle_goals')
                .select('*')
                .eq('user_id', patientId)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
        ]);

        const sleepData = sleepRes.data || [];
        const activityData = activityRes.data || [];
        const hydrationData = hydrationRes.data || [];
        const nutritionData = nutritionRes.data || [];
        const goalsData = goalsRes.data || [];

        // Calculate weekly averages
        const avgSleep = sleepData.length > 0
            ? sleepData.reduce((sum, e) => sum + e.duration_hours, 0) / sleepData.length
            : 0;

        const avgSteps = activityData.length > 0
            ? activityData.reduce((sum, e) => sum + (e.steps || 0), 0) / activityData.length
            : 0;

        const avgHydration = hydrationData.length > 0
            ? hydrationData.reduce((sum, e) => sum + e.cups_consumed, 0) / hydrationData.length
            : 0;

        const avgCalories = nutritionData.length > 0
            ? nutritionData.reduce((sum, e) => sum + e.calories, 0) / nutritionData.length
            : 0;

        // Calculate progress
        const sleepTarget = 8;
        const stepsTarget = 10000;
        const hydrationTarget = 10;
        const caloriesTarget = 2000;

        return {
            hasData: sleepData.length > 0 || activityData.length > 0 || hydrationData.length > 0 || nutritionData.length > 0,
            stats: {
                avgSleep: Math.round(avgSleep * 10) / 10,
                avgSteps: Math.round(avgSteps),
                avgHydration: Math.round(avgHydration * 10) / 10,
                avgCalories: Math.round(avgCalories),
                sleepProgress: Math.min(100, Math.round((avgSleep / sleepTarget) * 100)),
                stepsProgress: Math.min(100, Math.round((avgSteps / stepsTarget) * 100)),
                hydrationProgress: Math.min(100, Math.round((avgHydration / hydrationTarget) * 100)),
                caloriesProgress: Math.min(100, Math.round((avgCalories / caloriesTarget) * 100)),
            },
            goals: goalsData,
            recentEntries: {
                sleep: sleepData.slice(0, 3),
                activity: activityData.slice(0, 3),
                hydration: hydrationData.slice(0, 3),
                nutrition: nutritionData.slice(0, 3),
            }
        };
    } catch (error) {
        console.error('Error fetching lifestyle data:', error);
        return {
            hasData: false,
            stats: null,
            goals: [],
            recentEntries: { sleep: [], activity: [], hydration: [], nutrition: [] }
        };
    }
}
