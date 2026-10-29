import {
  ChoiceLetter,
  ProfileDefinition,
  ProfileTier,
  DimensionScore,
  SurveySubmission,
} from '../types/survey.ts';
import {
  POINT_MAP,
  PROFILE_DEFINITIONS,
  SURVEY_QUESTIONS,
} from '../data/questions.ts';

export function calculateScoreAndBreakdown(answers: Record<number, ChoiceLetter>) {
  const pointsBreakdown: Record<number, number> = {};
  let totalScore = 0;

  SURVEY_QUESTIONS.forEach((q) => {
    const choice = answers[q.id];
    const points = choice ? POINT_MAP[choice] || 0 : 0;
    pointsBreakdown[q.id] = points;
    totalScore += points;
  });

  const profile = getProfileForScore(totalScore);

  return {
    totalScore,
    pointsBreakdown,
    profile: profile.tier,
    profileDef: profile,
  };
}

export function getProfileForScore(score: number): ProfileDefinition {
  for (const def of PROFILE_DEFINITIONS) {
    if (score >= def.minScore && score <= def.maxScore) {
      return def;
    }
  }
  // Fallback for edge cases
  if (score > 90) return PROFILE_DEFINITIONS[0];
  return PROFILE_DEFINITIONS[3];
}

export function calculateDimensions(pointsBreakdown: Record<number, number>): DimensionScore[] {
  const spontaneousQuestions = [1, 2, 4, 12]; // 4 * 5 = 20
  const responsiveQuestions = [3, 5, 6, 7, 13]; // 5 * 5 = 25
  const stressEnergyQuestions = [8, 14, 15]; // 3 * 5 = 15
  const relationalQuestions = [10, 16, 17]; // 3 * 5 = 15
  const somaticQuestions = [9, 11, 18]; // 3 * 5 = 15

  const sum = (qIds: number[]) => qIds.reduce((acc, id) => acc + (pointsBreakdown[id] || 0), 0);

  const spontaneousScore = sum(spontaneousQuestions);
  const responsiveScore = sum(responsiveQuestions);
  const stressEnergyScore = sum(stressEnergyQuestions);
  const relationalScore = sum(relationalQuestions);
  const somaticScore = sum(somaticQuestions);

  return [
    {
      name: 'Spontaneous Drive',
      score: spontaneousScore,
      maxPossible: 20,
      percentage: Math.round((spontaneousScore / 20) * 100),
      description: 'Frequency of unprompted sexual thoughts, morning/evening arousal, and internal sexual cues.',
    },
    {
      name: 'Responsive Arousal',
      score: responsiveScore,
      maxPossible: 25,
      percentage: Math.round((responsiveScore / 25) * 100),
      description: 'Ability to become aroused in response to sensual stimulation, touch, partner cues, and foreplay.',
    },
    {
      name: 'Stress & Energy Resilience',
      score: stressEnergyScore,
      maxPossible: 15,
      percentage: Math.round((stressEnergyScore / 15) * 100),
      description: 'How robust your desire remains against physical fatigue, daily work strain, and cognitive distractions.',
    },
    {
      name: 'Relational & Emotional Bond',
      score: relationalScore,
      maxPossible: 15,
      percentage: Math.round((relationalScore / 15) * 100),
      description: 'Interplay between emotional intimacy, communicative safety, and sexual fulfillment.',
    },
    {
      name: 'Somatic & Desire Satisfaction',
      score: somaticScore,
      maxPossible: 15,
      percentage: Math.round((somaticScore / 15) * 100),
      description: 'Connection with physical sensations, long-term stability, and peace with your current desire level.',
    },
  ];
}

export function exportSubmissionsToCsv(submissions: SurveySubmission[]): string {
  if (submissions.length === 0) return '';

  const headers = [
    'Submission ID',
    'Participant ID',
    'Timestamp (UTC)',
    'Age Group',
    'Gender',
    'Relationship Status',
    'Total Score',
    'Profile Tier',
    'Duration (Seconds)',
    ...SURVEY_QUESTIONS.map((q) => `Q${q.id} Answer`),
    ...SURVEY_QUESTIONS.map((q) => `Q${q.id} Points`),
  ];

  const rows = submissions.map((sub) => {
    const qAnswers = SURVEY_QUESTIONS.map((q) => sub.answers[q.id] || '');
    const qPoints = SURVEY_QUESTIONS.map((q) => sub.pointsBreakdown[q.id] ?? 0);

    return [
      `"${sub.id}"`,
      `"${sub.participantId}"`,
      `"${sub.timestamp}"`,
      `"${sub.demographics?.ageGroup || 'N/A'}"`,
      `"${sub.demographics?.gender || 'N/A'}"`,
      `"${sub.demographics?.relationshipStatus || 'N/A'}"`,
      sub.totalScore,
      `"${sub.profile}"`,
      sub.durationSeconds || 0,
      ...qAnswers.map((a) => `"${a}"`),
      ...qPoints,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
