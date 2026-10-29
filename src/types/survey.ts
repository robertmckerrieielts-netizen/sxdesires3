/**
 * Types for the Sexual Desire Assessment Survey (SDAS-18)
 */

export type ChoiceLetter = 'A' | 'B' | 'C' | 'D';

export interface QuestionChoice {
  letter: ChoiceLetter;
  text: string;
  points: number;
}

export type QuestionCategory = 
  | 'Spontaneous Desire' 
  | 'Responsive Desire' 
  | 'Stress & Energy' 
  | 'Emotional & Relational' 
  | 'Body & Sensation';

export interface SurveyQuestion {
  id: number;
  category: QuestionCategory;
  text: string;
  choices: QuestionChoice[];
}

export type ProfileTier = 
  | 'High / Vibrant Desire' 
  | 'Moderate / Balanced Desire' 
  | 'Low-to-Moderate / Context-Sensitive Desire' 
  | 'Low / Dormant Desire';

export interface ProfileDefinition {
  tier: ProfileTier;
  minScore: number;
  maxScore: number;
  shortLabel: string;
  description: string;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
}

export interface Demographics {
  ageGroup?: string;
  gender?: string;
  relationshipStatus?: string;
  participantAlias?: string;
}

export interface SurveySubmission {
  id: string;
  participantId: string;
  timestamp: string;
  demographics?: Demographics;
  answers: Record<number, ChoiceLetter>;
  pointsBreakdown: Record<number, number>;
  totalScore: number;
  profile: ProfileTier;
  durationSeconds?: number;
}

export interface DimensionScore {
  name: string;
  score: number;
  maxPossible: number;
  percentage: number;
  description: string;
}
