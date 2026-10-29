import { SurveyQuestion, ProfileDefinition } from '../types/survey.ts';

export const SURVEY_TITLE = 'Sexual Desire Assessment Survey';
export const SURVEY_SUBTITLE = 'Choose the option that best reflects your experience over the past 3 to 6 months.';

export const POINT_MAP: Record<'A' | 'B' | 'C' | 'D', number> = {
  A: 5,
  B: 4,
  C: 2,
  D: 1,
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    category: 'Spontaneous Desire',
    text: 'How often do you experience spontaneous thoughts or fantasies about sex?',
    choices: [
      { letter: 'A', text: 'Daily or multiple times a day', points: 5 },
      { letter: 'B', text: 'A few times a week', points: 4 },
      { letter: 'C', text: 'Once or twice a month', points: 2 },
      { letter: 'D', text: 'Rarely or never', points: 1 },
    ],
  },
  {
    id: 2,
    category: 'Spontaneous Desire',
    text: 'How frequently do you feel a strong physical or emotional urge to be sexually intimate?',
    choices: [
      { letter: 'A', text: 'Several times a week or more', points: 5 },
      { letter: 'B', text: 'About once a week', points: 4 },
      { letter: 'C', text: 'Once or twice a month', points: 2 },
      { letter: 'D', text: 'Almost never', points: 1 },
    ],
  },
  {
    id: 3,
    category: 'Responsive Desire',
    text: 'How often do you initiate sexual activity or intimate touch with a partner?',
    choices: [
      { letter: 'A', text: 'Frequently; I am often the one to start', points: 5 },
      { letter: 'B', text: 'Occasionally; I initiate when the mood strikes', points: 4 },
      { letter: 'C', text: 'Rarely; I usually wait for my partner to initiate', points: 2 },
      { letter: 'D', text: 'Never; I rarely or never initiate', points: 1 },
    ],
  },
  {
    id: 4,
    category: 'Spontaneous Desire',
    text: 'When you wake up or go to bed, how often do you feel a sense of sexual energy or arousal?',
    choices: [
      { letter: 'A', text: 'Almost every day or night', points: 5 },
      { letter: 'B', text: 'A few times a week', points: 4 },
      { letter: 'C', text: 'Occasionally throughout the month', points: 2 },
      { letter: 'D', text: 'Rarely or never', points: 1 },
    ],
  },
  {
    id: 5,
    category: 'Responsive Desire',
    text: 'When your partner (or a potential partner) initiates sexual contact, how do you typically respond?',
    choices: [
      { letter: 'A', text: 'Enthusiastically; I am usually ready and excited', points: 5 },
      { letter: 'B', text: "Positively; even if I wasn't thinking about it, I get into the mood quickly", points: 4 },
      { letter: 'C', text: 'Hesitantly; I often feel neutral or reluctant at first', points: 2 },
      { letter: 'D', text: 'Unfavorably; I frequently feel disinterested or find reasons to decline', points: 1 },
    ],
  },
  {
    id: 6,
    category: 'Responsive Desire',
    text: 'How quickly or easily do you become sexually aroused once intimate touch or foreplay begins?',
    choices: [
      { letter: 'A', text: 'Very easily and quickly', points: 5 },
      { letter: 'B', text: 'Moderately quickly, after a short period of warming up', points: 4 },
      { letter: 'C', text: 'It takes a significant amount of time and effort', points: 2 },
      { letter: 'D', text: 'Very difficultly, or I rarely become aroused', points: 1 },
    ],
  },
  {
    id: 7,
    category: 'Responsive Desire',
    text: 'How does reading, watching, or hearing sensual/romantic content affect your desire?',
    choices: [
      { letter: 'A', text: 'It immediately triggers strong desire and arousal', points: 5 },
      { letter: 'B', text: 'It moderately increases my interest or mood', points: 4 },
      { letter: 'C', text: 'It has little to no effect on me', points: 2 },
      { letter: 'D', text: 'I feel indifferent or completely disconnected from it', points: 1 },
    ],
  },
  {
    id: 8,
    category: 'Stress & Energy',
    text: 'If you are stressed or tired, how does it impact your interest in sex?',
    choices: [
      { letter: 'A', text: 'Sex helps me release stress; my desire remains high or increases', points: 5 },
      { letter: 'B', text: 'My desire drops slightly, but I can still get into the mood easily', points: 4 },
      { letter: 'C', text: 'My desire drops significantly; I prefer rest or solitude', points: 2 },
      { letter: 'D', text: 'My desire completely disappears until stress levels drop entirely', points: 1 },
    ],
  },
  {
    id: 9,
    category: 'Body & Sensation',
    text: 'How connected do you feel to your own body and sexual sensation on a regular basis?',
    choices: [
      { letter: 'A', text: 'Very connected; I feel comfortable and attuned to my physical desires', points: 5 },
      { letter: 'B', text: 'Mostly connected, with occasional periods of feeling distant', points: 4 },
      { letter: 'C', text: 'Somewhat disconnected or distracted during intimate moments', points: 2 },
      { letter: 'D', text: 'Very disconnected or ungrounded regarding my sexual self', points: 1 },
    ],
  },
  {
    id: 10,
    category: 'Body & Sensation',
    text: 'How import is sexual intimacy to your overall sense of personal well-being or relationship satisfaction?',
    choices: [
      { letter: 'A', text: 'Essential; it is a vital priority for me', points: 5 },
      { letter: 'B', text: 'Important; it plays a meaningful role in my life', points: 4 },
      { letter: 'C', text: 'Minor; it is nice to have, but not particularly essential', points: 2 },
      { letter: 'D', text: 'Low/Unimportant; I feel completely fulfilled without it', points: 1 },
    ],
  },
  {
    id: 11,
    category: 'Body & Sensation',
    text: 'How satisfied are you with your current overall level of sexual desire?',
    choices: [
      { letter: 'A', text: 'Completely satisfied; my desire feels natural and balanced', points: 5 },
      { letter: 'B', text: 'Mostly satisfied, though it fluctuates from time to time', points: 4 },
      { letter: 'C', text: 'Somewhat dissatisfied; I wish my desire were higher or lower', points: 2 },
      { letter: 'D', text: 'Very dissatisfied or distressed by my level of desire', points: 1 },
    ],
  },
  {
    id: 12,
    category: 'Spontaneous Desire',
    text: 'How often do you engage in self-pleasure (masturbation) or feel the desire to do so?',
    choices: [
      { letter: 'A', text: 'Multiple times a week or daily', points: 5 },
      { letter: 'B', text: 'A few times a month', points: 4 },
      { letter: 'C', text: 'Once every few months', points: 2 },
      { letter: 'D', text: 'Very rarely or never', points: 1 },
    ],
  },
  {
    id: 13,
    category: 'Responsive Desire',
    text: 'When you feel physical affection (e.g., hugging, kissing, cuddling), how often does it transition into sexual desire?',
    choices: [
      { letter: 'A', text: 'Very often; physical touch easily sparks my desire', points: 5 },
      { letter: 'B', text: 'Sometimes, depending on the mood and setting', points: 4 },
      { letter: 'C', text: 'Rarely; non-sexual affection usually stays non-sexual for me', points: 2 },
      { letter: 'D', text: 'Almost never', points: 1 },
    ],
  },
  {
    id: 14,
    category: 'Stress & Energy',
    text: 'How would you rate your general physical energy and vitality levels on a daily basis?',
    choices: [
      { letter: 'A', text: 'High energy throughout the day', points: 5 },
      { letter: 'B', text: 'Moderate, stable energy', points: 4 },
      { letter: 'C', text: 'Frequently tired or fatigued', points: 2 },
      { letter: 'D', text: 'Chronically exhausted or depleted', points: 1 },
    ],
  },
  {
    id: 15,
    category: 'Stress & Energy',
    text: 'How easily are you able to stay mentally focused and present during intimate moments?',
    choices: [
      { letter: 'A', text: 'Very easily; my mind rarely wanders', points: 5 },
      { letter: 'B', text: 'Generally present, with occasional mild distractions', points: 4 },
      { letter: 'C', text: 'Often distracted by stress, work, or intrusive thoughts', points: 2 },
      { letter: 'D', text: 'Highly distracted; I find it very difficult to stay present', points: 1 },
    ],
  },
  {
    id: 16,
    category: 'Emotional & Relational',
    text: 'How does feeling emotional closeness with a partner influence your sexual desire?',
    choices: [
      { letter: 'A', text: 'Emotional closeness powerfully amplifies my desire', points: 5 },
      { letter: 'B', text: 'Emotional closeness moderately enhances my desire', points: 4 },
      { letter: 'C', text: 'It has a minimal impact on my baseline desire', points: 2 },
      { letter: 'D', text: 'I feel little to no desire regardless of emotional closeness', points: 1 },
    ],
  },
  {
    id: 17,
    category: 'Emotional & Relational',
    text: 'How comfortable do you feel communicating your sexual desires or boundaries to a partner?',
    choices: [
      { letter: 'A', text: 'Completely comfortable and open', points: 5 },
      { letter: 'B', text: 'Fairly comfortable, though some topics are harder to bring up', points: 4 },
      { letter: 'C', text: 'Somewhat uncomfortable; I prefer not to speak about it directly', points: 2 },
      { letter: 'D', text: 'Very uncomfortable or unable to communicate about it', points: 1 },
    ],
  },
  {
    id: 18,
    category: 'Emotional & Relational',
    text: 'Over the last year, how stable has your level of sexual interest remained?',
    choices: [
      { letter: 'A', text: 'Consistently high or balanced', points: 5 },
      { letter: 'B', text: 'Normal minor fluctuations, but generally stable', points: 4 },
      { letter: 'C', text: 'Noticeably declining or inconsistent', points: 2 },
      { letter: 'D', text: 'Low across the entire year', points: 1 },
    ],
  },
];

export const PROFILE_DEFINITIONS: ProfileDefinition[] = [
  {
    tier: 'High / Vibrant Desire',
    minScore: 72,
    maxScore: 90,
    shortLabel: 'High / Vibrant',
    description:
      'You possess strong spontaneous and responsive desire. Sexual thoughts and intimacy play an active, vital role in your life, and you adapt easily to intimate contexts.',
    colorClass: {
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-200',
      accent: '#e11d48',
    },
  },
  {
    tier: 'Moderate / Balanced Desire',
    minScore: 54,
    maxScore: 71,
    shortLabel: 'Moderate / Balanced',
    description:
      'Your desire is healthy and typical. You may experience responsive desire (arousal triggered by context/touch) more often than spontaneous desire, with periodic fluctuations due to stress or routine.',
    colorClass: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      accent: '#059669',
    },
  },
  {
    tier: 'Low-to-Moderate / Context-Sensitive Desire',
    minScore: 36,
    maxScore: 53,
    shortLabel: 'Context-Sensitive',
    description:
      'Your desire is deeply influenced by stress, fatigue, emotional connection, or environment. Intimacy may take significant context or preparation to cultivate.',
    colorClass: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      accent: '#d97706',
    },
  },
  {
    tier: 'Low / Dormant Desire',
    minScore: 18,
    maxScore: 35,
    shortLabel: 'Low / Dormant',
    description:
      'You experience low interest in sexual activity or arousal. This may reflect personal preference/orientation (e.g., asexual spectrum), lifestyle exhaustion, hormonal factors, or relationship stress.',
    colorClass: {
      bg: 'bg-stone-100',
      text: 'text-stone-800',
      border: 'border-stone-300',
      accent: '#57534e',
    },
  },
];

export const RESEARCH_DISCLAIMER =
  'Note: Sexual desire varies naturally based on stress, age, relationship longevity, health, and medications. Low scores are only a concern if they cause personal distress or relationship conflict.';

export const RESEARCH_PURPOSE_TEXT =
  'This survey is an empirical behavioral assessment examining multifaceted dimensions of human sexual desire: spontaneous versus responsive arousal mechanisms, stress buffering, somatic awareness, and relational intimacy.';
