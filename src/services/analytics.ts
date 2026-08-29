import { 
  PeriodEntry, 
  CycleStats, 
  CyclePhase, 
  DailyWellness, 
  WellnessScoreBreakdown, 
  PatternCheckData, 
  AttentionLevel,
  SymptomRecord,
  MonthlyReportData 
} from '../types';

export function calculateCycleStats(periodEntries: PeriodEntry[], refDateStr?: string): CycleStats {
  const today = refDateStr ? new Date(refDateStr) : new Date();
  
  // Sort entries ascending by startDate
  const sorted = [...periodEntries].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  if (sorted.length === 0) {
    const nextEstimated = new Date(today);
    nextEstimated.setDate(today.getDate() + 14);
    return {
      currentCycleLength: 28,
      previousCycleLength: 28,
      averageCycleLength: 28,
      trackedCyclesCount: 0,
      daysSinceLastPeriod: 14,
      estimatedNextPeriodDate: nextEstimated.toISOString().split('T')[0],
      cycleVariabilityDays: 0,
      longestCycleDays: 28,
      shortestCycleDays: 28,
      recentDelayDays: 0,
      isIrregular: false,
      currentPhase: 'follicular',
      currentPhaseDay: 14,
      fertileWindowStart: '',
      fertileWindowEnd: '',
      ovulationDate: ''
    };
  }

  // Calculate cycle lengths (days between consecutive start dates)
  const cycleLengths: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const start1 = new Date(sorted[i].startDate).getTime();
    const start2 = new Date(sorted[i + 1].startDate).getTime();
    const diffDays = Math.round((start2 - start1) / (1000 * 60 * 60 * 24));
    if (diffDays > 10 && diffDays < 90) { // filter outliers/errors
      cycleLengths.push(diffDays);
    }
  }

  const latestPeriod = sorted[sorted.length - 1];
  const lastStartDate = new Date(latestPeriod.startDate);
  const diffFromLastStart = Math.max(0, Math.round((today.getTime() - lastStartDate.getTime()) / (1000 * 60 * 60 * 24)));

  const avgLength = cycleLengths.length > 0 
    ? Math.round(cycleLengths.reduce((acc, curr) => acc + curr, 0) / cycleLengths.length)
    : 28;

  const prevCycleLength = cycleLengths.length > 0 
    ? cycleLengths[cycleLengths.length - 1] 
    : 28;

  // Variability (standard deviation)
  let variability = 0;
  if (cycleLengths.length > 1) {
    const variance = cycleLengths.reduce((acc, val) => acc + Math.pow(val - avgLength, 2), 0) / cycleLengths.length;
    variability = Math.round(Math.sqrt(variance) * 10) / 10;
  }

  const longest = cycleLengths.length > 0 ? Math.max(...cycleLengths) : avgLength;
  const shortest = cycleLengths.length > 0 ? Math.min(...cycleLengths) : avgLength;

  // Next period estimate based on user's own average
  const nextEstimated = new Date(lastStartDate);
  nextEstimated.setDate(lastStartDate.getDate() + avgLength);
  const nextEstStr = nextEstimated.toISOString().split('T')[0];

  // Estimated delay
  const expectedDate = new Date(lastStartDate);
  expectedDate.setDate(lastStartDate.getDate() + avgLength);
  const delayDays = today > expectedDate ? Math.round((today.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Irregularity evaluation
  let isIrregular = false;
  let irregularityReason = '';
  if (variability > 6) {
    isIrregular = true;
    irregularityReason = `Cycle lengths vary by ~${variability} days across recent months.`;
  } else if (shortest < 21 || longest > 35) {
    isIrregular = true;
    irregularityReason = `Cycles have ranged between ${shortest} and ${longest} days.`;
  } else if (delayDays >= 7) {
    isIrregular = true;
    irregularityReason = `Current cycle is delayed by ${delayDays} days compared to your personal baseline.`;
  }

  // Phase calculation
  const currentPhaseDay = diffFromLastStart + 1;
  let currentPhase: CyclePhase = 'follicular';
  const periodDuration = 5;
  const ovulationDay = Math.max(10, avgLength - 14);

  if (currentPhaseDay <= periodDuration) {
    currentPhase = 'menstrual';
  } else if (currentPhaseDay < ovulationDay - 2) {
    currentPhase = 'follicular';
  } else if (currentPhaseDay <= ovulationDay + 2) {
    currentPhase = 'ovulatory';
  } else {
    currentPhase = 'luteal';
  }

  // Fertile window calculation
  const fertileStart = new Date(lastStartDate);
  fertileStart.setDate(lastStartDate.getDate() + ovulationDay - 4);
  const fertileEnd = new Date(lastStartDate);
  fertileEnd.setDate(lastStartDate.getDate() + ovulationDay + 1);
  const ovDate = new Date(lastStartDate);
  ovDate.setDate(lastStartDate.getDate() + ovulationDay);

  return {
    currentCycleLength: currentPhaseDay,
    previousCycleLength: prevCycleLength,
    averageCycleLength: avgLength,
    trackedCyclesCount: sorted.length,
    daysSinceLastPeriod: diffFromLastStart,
    estimatedNextPeriodDate: nextEstStr,
    cycleVariabilityDays: variability,
    longestCycleDays: longest,
    shortestCycleDays: shortest,
    recentDelayDays: delayDays,
    isIrregular,
    irregularityReason,
    currentPhase,
    currentPhaseDay,
    fertileWindowStart: fertileStart.toISOString().split('T')[0],
    fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
    ovulationDate: ovDate.toISOString().split('T')[0]
  };
}

export function calculateWellnessScore(wellness: DailyWellness): WellnessScoreBreakdown {
  const insights: string[] = [];

  // 1. Sleep score (Max 25 points)
  let sleepScore = 0;
  if (wellness.sleepHours >= 7 && wellness.sleepHours <= 9) {
    sleepScore = 22 + (wellness.sleepQuality >= 4 ? 3 : wellness.sleepQuality * 0.5);
    insights.push(`Optimal restorative sleep of ${Math.floor(wellness.sleepHours)}h ${Math.round((wellness.sleepHours % 1) * 60)}m logged.`);
  } else if (wellness.sleepHours >= 6 && wellness.sleepHours < 7) {
    sleepScore = 18 + (wellness.sleepQuality * 0.8);
    insights.push('Slightly below optimal sleep duration (<7h).');
  } else if (wellness.sleepHours > 9 && wellness.sleepHours <= 10.5) {
    sleepScore = 19;
    insights.push('Extended rest logged.');
  } else {
    sleepScore = Math.max(5, Math.min(14, wellness.sleepHours * 2.2));
    insights.push('Sleep duration was outside target window.');
  }
  sleepScore = Math.min(25, Math.round(sleepScore));

  // 2. Activity / Steps score (Max 25 points)
  const stepsRatio = Math.min(1.2, wellness.steps / (wellness.stepsGoal || 8000));
  const exercisePts = Math.min(10, (wellness.exerciseMinutes / 30) * 10);
  const stepsPts = Math.min(15, stepsRatio * 15);
  const activityScore = Math.min(25, Math.round(stepsPts + exercisePts));
  if (activityScore >= 20) {
    insights.push(`Great movement routine: ${wellness.steps.toLocaleString()} steps & ${wellness.exerciseMinutes}m exercise.`);
  }

  // 3. Hydration score (Max 20 points)
  const waterRatio = Math.min(1.1, wellness.waterLiters / (wellness.waterGoalLiters || 2.5));
  const hydrationScore = Math.min(20, Math.round(waterRatio * 20));
  if (hydrationScore >= 16) {
    insights.push(`Hydration target on track at ${wellness.waterLiters.toFixed(1)}L.`);
  }

  // 4. Mindfulness score (Max 15 points)
  let mindfulnessScore = 0;
  if (wellness.meditationMinutes >= 15) {
    mindfulnessScore = 15;
    insights.push('Full 15+ min mindfulness practice completed.');
  } else if (wellness.meditationMinutes >= 5) {
    mindfulnessScore = 10;
  } else if (wellness.meditationMinutes > 0) {
    mindfulnessScore = 6;
  } else {
    mindfulnessScore = 3;
  }

  // 5. Mood & Energy (Max 15 points)
  let moodBase = 10;
  switch (wellness.mood) {
    case 'radiant': moodBase = 14; break;
    case 'calm': moodBase = 13; break;
    case 'productive': moodBase = 13; break;
    case 'sensitive': moodBase = 9; break;
    case 'anxious': moodBase = 7; break;
    case 'exhausted': moodBase = 6; break;
    case 'low': moodBase = 6; break;
  }
  const energyBonus = (wellness.moodEnergy / 10) * 2;
  const moodScore = Math.min(15, Math.max(3, Math.round(moodBase + energyBonus)));

  const totalScore = Math.min(100, Math.max(10, sleepScore + activityScore + hydrationScore + mindfulnessScore + moodScore));

  return {
    totalScore,
    sleepScore,
    activityScore,
    hydrationScore,
    mindfulnessScore,
    moodScore,
    insights
  };
}

export function evaluatePatternAttention(data: PatternCheckData): {
  level: AttentionLevel;
  headline: string;
  explanation: string;
  positiveFactors: string[];
  attentionFactors: string[];
  recommendations: string[];
} {
  const flags: { key: string; label: string; active: boolean }[] = [
    { key: 'irregularPeriods', label: 'Irregular or skipping periods', active: data.irregularPeriods },
    { key: 'unusuallyLongCycles', label: 'Cycles regularly longer than 35 days', active: data.unusuallyLongCycles },
    { key: 'acne', label: 'Persistent adult or hormonal acne', active: data.acne },
    { key: 'increasedFacialBodyHair', label: 'Excess coarse facial or body hair growth', active: data.increasedFacialBodyHair },
    { key: 'unusualHairThinning', label: 'Noticeable scalp hair thinning or shedding', active: data.unusualHairThinning },
    { key: 'unexpectedWeightChanges', label: 'Unexpected weight fluctuations without diet changes', active: data.unexpectedWeightChanges },
    { key: 'fatigue', label: 'Persistent energy dips and chronic daytime fatigue', active: data.fatigue },
    { key: 'moodChanges', label: 'Frequent unexplained mood shifts or brain fog', active: data.moodChanges },
  ];

  const activeFactors = flags.filter(f => f.active).map(f => f.label);
  const count = activeFactors.length;

  let level: AttentionLevel = 'LOW';
  let headline = 'Your tracked pattern currently shows no major irregularity.';
  let explanation = 'Your cycle and reported symptoms are consistent with typical physiological variations.';

  if (count >= 4 || (data.irregularPeriods && data.unusuallyLongCycles && (data.acne || data.increasedFacialBodyHair))) {
    level = 'HIGH ATTENTION';
    headline = 'Your tracked cycle and symptom patterns show changes that may be worth discussing with a healthcare professional.';
    explanation = 'Multiple recurring indicators such as cycle changes, hair or skin alterations, and metabolic signals were logged. An evaluation by a licensed OB-GYN or endocrinologist can provide personalized clinical clarity.';
  } else if (count >= 2) {
    level = 'MODERATE';
    headline = 'Some patterns in your recent entries may be worth monitoring.';
    explanation = 'A few isolated symptoms were noted. Observing if these cluster around specific cycle phases or high-stress intervals can provide helpful insights.';
  }

  const recommendations = [
    'Maintain a consistent log of cycle dates and physical sensations.',
    'Prioritize blood-sugar balanced meals with fiber, healthy fats, and protein.',
    'Focus on restorative sleep (7-9 hours) to support natural hormonal rhythms.',
    'Engage in gentle movement like walking, swimming, or restorative yoga.'
  ];

  return {
    level,
    headline,
    explanation,
    positiveFactors: flags.filter(f => !f.active).map(f => f.label),
    attentionFactors: activeFactors,
    recommendations
  };
}

export function generateMonthlyReport(
  periodEntries: PeriodEntry[],
  dailyLogs: DailyWellness[],
  symptoms: SymptomRecord[],
  targetMonth: number, // 0-11
  targetYear: number
): MonthlyReportData {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthLogs = dailyLogs.filter(log => {
    const d = new Date(log.date);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });

  const prevMonthIndex = targetMonth === 0 ? 11 : targetMonth - 1;
  const prevYear = targetMonth === 0 ? targetYear - 1 : targetYear;
  const prevMonthLogs = dailyLogs.filter(log => {
    const d = new Date(log.date);
    return d.getMonth() === prevMonthIndex && d.getFullYear() === prevYear;
  });

  // Calculate Averages
  const count = currentMonthLogs.length || 1;
  const totalSleep = currentMonthLogs.reduce((acc, l) => acc + l.sleepHours, 0);
  const totalSteps = currentMonthLogs.reduce((acc, l) => acc + l.steps, 0);
  const totalWater = currentMonthLogs.reduce((acc, l) => acc + l.waterLiters, 0);
  const totalExercise = currentMonthLogs.reduce((acc, l) => acc + l.exerciseMinutes, 0);
  const totalMeditation = currentMonthLogs.reduce((acc, l) => acc + l.meditationMinutes, 0);

  const scores = currentMonthLogs.map(l => calculateWellnessScore(l).totalScore);
  const wellnessAvg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 80;

  // Previous Month Averages for comparison
  const prevCount = prevMonthLogs.length || 1;
  const prevTotalSleep = prevMonthLogs.reduce((acc, l) => acc + l.sleepHours, 0);
  const prevTotalSteps = prevMonthLogs.reduce((acc, l) => acc + l.steps, 0);
  const prevTotalWater = prevMonthLogs.reduce((acc, l) => acc + l.waterLiters, 0);

  const avgSleep = Math.round((totalSleep / count) * 10) / 10;
  const avgSteps = Math.round(totalSteps / count);
  const avgWater = Math.round((totalWater / count) * 10) / 10;

  const prevAvgSleep = Math.round((prevTotalSleep / prevCount) * 10) / 10;
  const prevAvgSteps = Math.round(prevTotalSteps / prevCount);
  const prevAvgWater = Math.round((prevTotalWater / prevCount) * 10) / 10;

  // What changed this month narrative rules
  const changesThisMonth: string[] = [];

  if (prevMonthLogs.length > 0) {
    const sleepDiffMinutes = Math.round((avgSleep - prevAvgSleep) * 60);
    if (Math.abs(sleepDiffMinutes) >= 15) {
      changesThisMonth.push(
        sleepDiffMinutes > 0
          ? `Your average sleep increased by ${sleepDiffMinutes} minutes compared with last month.`
          : `Your average sleep decreased by ${Math.abs(sleepDiffMinutes)} minutes compared with last month.`
      );
    }

    if (prevAvgSteps > 0) {
      const stepsPercent = Math.round(((avgSteps - prevAvgSteps) / prevAvgSteps) * 100);
      if (Math.abs(stepsPercent) >= 5) {
        changesThisMonth.push(
          stepsPercent > 0
            ? `Your walking activity increased by ${stepsPercent}% this month.`
            : `Your walking activity decreased by ${Math.abs(stepsPercent)}% this month.`
        );
      }
    }

    const waterDiff = Math.round((avgWater - prevAvgWater) * 10) / 10;
    if (Math.abs(waterDiff) >= 0.2) {
      changesThisMonth.push(
        waterDiff > 0
          ? `Daily hydration improved by +${waterDiff}L on average.`
          : `Daily hydration was -${Math.abs(waterDiff)}L compared to previous month.`
      );
    }
  } else {
    changesThisMonth.push('First tracked month on HERSELF. Your baseline data has been successfully established.');
    changesThisMonth.push(`Maintained an average daily activity of ${avgSteps.toLocaleString()} steps.`);
  }

  // Symptom counts
  const monthSymptoms = symptoms.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });
  const symptomFreq: { [symptom: string]: number } = {};
  monthSymptoms.forEach(s => {
    symptomFreq[s.symptomLabel] = (symptomFreq[s.symptomLabel] || 0) + 1;
  });

  // Mood counts
  const moodCounts: { [m: string]: number } = {};
  currentMonthLogs.forEach(l => {
    moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
  });
  let topMood = 'Calm';
  let maxMoodCount = 0;
  for (const [m, c] of Object.entries(moodCounts)) {
    if (c > maxMoodCount) {
      maxMoodCount = c;
      topMood = m.charAt(0).toUpperCase() + m.slice(1);
    }
  }

  // Cycle summary for month
  const monthCycles = periodEntries.filter(p => {
    const d = new Date(p.startDate);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });

  return {
    monthName: monthNames[targetMonth],
    year: targetYear,
    cycleSummary: {
      cyclesCount: monthCycles.length,
      averageLength: 28,
      periodDaysCount: monthCycles.length * 5,
      status: monthCycles.length > 0 ? 'Logged normally' : 'In interval'
    },
    wellnessScoreAvg: wellnessAvg,
    sleepAvgHours: avgSleep,
    stepsAvg: avgSteps,
    waterAvgLiters: avgWater,
    totalExerciseMinutes: totalExercise,
    totalMeditationMinutes: totalMeditation,
    topMood,
    symptomFrequency: symptomFreq,
    changesThisMonth,
    wellnessHighlights: [
      `Recorded ${currentMonthLogs.length} active wellness check-ins.`,
      `Accumulated ${totalExercise} minutes of deliberate exercise.`,
      `Dedicated ${totalMeditation} minutes to mindfulness and calm breathing.`
    ]
  };
}
