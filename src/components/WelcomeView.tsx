import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Demographics } from '../types/survey.ts';
import { RESEARCH_DISCLAIMER } from '../data/questions.ts';

interface WelcomeViewProps {
  onStartTest: (demographics: Demographics) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStartTest }) => {
  const [ageGroup, setAgeGroup] = useState<string>('26-35');
  const [gender, setGender] = useState<string>('Prefer not to say');
  const [relationshipStatus, setRelationshipStatus] = useState<string>('In a relationship');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdultConfirmed) return;

    onStartTest({
      ageGroup,
      gender,
      relationshipStatus,
      participantAlias: `P-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
      {/* Title block */}
      <div className="mb-10 text-left">
        <p className="text-xs font-mono uppercase tracking-widest text-stone-600 mb-3">
          Behavioral Research Study
        </p>
        <h1 className="font-editorial text-3xl sm:text-4xl text-stone-900 leading-tight mb-4 font-normal">
          Sexual Desire Assessment Survey
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Choose the option that best reflects your experience over the past 3 to 6 months.
        </p>
      </div>

      {/* Purpose & Research Notes */}
      <div className="border-t border-b border-stone-200/80 py-6 mb-8 text-sm text-stone-700 leading-relaxed space-y-3">
        <p>
          This assessment is part of an ongoing empirical behavioral study on human sexual desire, evaluating spontaneous thoughts, responsive arousal triggers, physiological vitality, and relational intimacy.
        </p>
        <p className="text-stone-600 text-xs leading-relaxed">
          The survey consists of <strong>18 questions</strong> and takes approximately 3 to 5 minutes to complete. All responses are completely anonymous and used exclusively for aggregated research analysis.
        </p>
      </div>

      {/* Normalizing & Ethical Warning */}
      <div className="bg-stone-100/70 border border-stone-200/70 rounded-lg p-5 mb-8 text-xs text-stone-700 leading-relaxed">
        <div className="font-semibold text-stone-900 mb-1">
          Clinical & Research Note
        </div>
        <p className="text-stone-700 mb-2">
          {RESEARCH_DISCLAIMER}
        </p>
        <p className="text-stone-500">
          This assessment is intended for educational reflection and behavioral research purposes. It does not replace medical consultation or clinical therapy.
        </p>
      </div>

      {/* Demographics & Start Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
            Demographic Context (Optional)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-stone-600 mb-1">Age group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded-md px-2.5 py-2 text-stone-800 focus:outline-none focus:border-stone-500"
              >
                <option value="18-25">18 – 25</option>
                <option value="26-35">26 – 35</option>
                <option value="36-45">36 – 45</option>
                <option value="46-55">46 – 55</option>
                <option value="56+">56+</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-stone-600 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded-md px-2.5 py-2 text-stone-800 focus:outline-none focus:border-stone-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Self-describe">Self-describe</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-stone-600 mb-1">Relationship</label>
              <select
                value={relationshipStatus}
                onChange={(e) => setRelationshipStatus(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded-md px-2.5 py-2 text-stone-800 focus:outline-none focus:border-stone-500"
              >
                <option value="In a relationship">In a relationship</option>
                <option value="Married / Cohabiting">Married / Cohabiting</option>
                <option value="Dating">Dating</option>
                <option value="Single">Single</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consent check */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 leading-normal select-none">
            <input
              type="checkbox"
              checked={isAdultConfirmed}
              onChange={(e) => setIsAdultConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-stone-800 focus:ring-0 cursor-pointer"
            />
            <span>
              I confirm I am 18 years of age or older and consent to participating in this anonymous survey.
            </span>
          </label>
        </div>

        {/* Start button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isAdultConfirmed}
            className={`px-7 py-3 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              isAdultConfirmed
                ? 'bg-stone-900 hover:bg-stone-800 text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
