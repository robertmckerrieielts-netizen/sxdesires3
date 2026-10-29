import React, { useState } from 'react';
import { Download, RotateCcw, Check, Share2 } from 'lucide-react';
import { SurveySubmission } from '../types/survey.ts';
import { PROFILE_DEFINITIONS, RESEARCH_DISCLAIMER } from '../data/questions.ts';
import { calculateDimensions } from '../utils/scoring.ts';

interface ResultsViewProps {
  submission: SurveySubmission;
  onRetake: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  submission,
  onRetake,
}) => {
  const [copied, setCopied] = useState(false);
  const currentProfile =
    PROFILE_DEFINITIONS.find((p) => p.tier === submission.profile) ||
    PROFILE_DEFINITIONS[1];

  const dimensions = calculateDimensions(submission.pointsBreakdown);

  // Position on gauge: 18 is 0%, 90 is 100%
  const gaugePercent = Math.max(
    0,
    Math.min(100, Math.round(((submission.totalScore - 18) / (90 - 18)) * 100))
  );

  const handleCopySummary = async () => {
    const summaryText = `Sexual Desire Assessment Survey (SDAS-18)
Participant: ${submission.participantId}
Total Score: ${submission.totalScore}/90 points
Profile: ${submission.profile}
Description: ${currentProfile.description}
Note: ${RESEARCH_DISCLAIMER}`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16 print:py-4">
      {/* Editorial Title */}
      <div className="mb-10 text-left print:mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-stone-600 mb-2">
          Assessment Report
        </p>
        <h1 className="font-editorial text-3xl sm:text-4xl text-stone-900 leading-tight mb-2 font-normal">
          Your Sexual Desire Profile
        </h1>
        <div className="text-xs text-stone-500 font-sans">
          Participant {submission.participantId} · {new Date(submission.timestamp).toLocaleDateString()}
        </div>
      </div>

      {/* Core Profile Summary Card */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-stone-400 mb-1">
              Desire Profile
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
              {currentProfile.tier}
            </h2>
          </div>

          <div className="sm:text-right">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-stone-900 tabular-nums">
              {submission.totalScore}
            </span>
            <span className="text-xs font-mono text-stone-400 ml-1">/ 90</span>
          </div>
        </div>

        {/* Minimalist spectrum scale */}
        <div className="pt-6 mb-6">
          <div className="flex justify-between text-[11px] text-stone-400 font-mono mb-2">
            <span>18 pts</span>
            <span>36</span>
            <span>54</span>
            <span>72</span>
            <span>90 pts</span>
          </div>

          <div className="relative w-full h-2 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-stone-300"
              style={{ width: `${((35 - 18) / 72) * 100}%` }}
              title="Low / Dormant"
            />
            <div
              className="h-full bg-stone-400"
              style={{ width: `${((53 - 35) / 72) * 100}%` }}
              title="Context-Sensitive"
            />
            <div
              className="h-full bg-stone-600"
              style={{ width: `${((71 - 53) / 72) * 100}%` }}
              title="Moderate / Balanced"
            />
            <div
              className="h-full bg-stone-900"
              style={{ width: `${((90 - 71) / 72) * 100}%` }}
              title="High / Vibrant"
            />
          </div>

          {/* Simple marker */}
          <div className="relative w-full mt-1.5">
            <div
              className="absolute transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${gaugePercent}%` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              <span className="text-[10px] font-mono text-stone-700 mt-0.5">
                {submission.totalScore}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Description */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-sm sm:text-[15px] text-stone-800 leading-relaxed">
          {currentProfile.description}
        </div>
      </div>

      {/* Mandatory Normalizing Clinical Note */}
      <div className="bg-stone-100/70 border border-stone-200/70 rounded-lg p-5 mb-8 text-xs text-stone-700 leading-relaxed">
        <div className="font-semibold text-stone-900 mb-1">
          Essential Note
        </div>
        <p className="mb-2">
          {RESEARCH_DISCLAIMER}
        </p>
        <p className="text-stone-500">
          Sexual desire is dynamic and contextual rather than a fixed trait. It is normal for levels to shift across life transitions, partnership stages, health changes, and work demands.
        </p>
      </div>

      {/* Sub-Dimension Breakdown */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-8">
        <h3 className="font-editorial text-xl font-normal text-stone-900 mb-1">
          Dimensional Analysis
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          How desire operates across key psychological facets:
        </p>

        <div className="space-y-5">
          {dimensions.map((dim) => (
            <div key={dim.name} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="font-medium text-stone-900">{dim.name}</span>
                <span className="font-mono text-xs text-stone-500">
                  {dim.score} / {dim.maxPossible} ({dim.percentage}%)
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className="bg-stone-800 h-full rounded-full transition-all duration-500"
                  style={{ width: `${dim.percentage}%` }}
                />
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {dim.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Score Ranges Reference Table */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-8">
        <h3 className="font-editorial text-lg font-normal text-stone-900 mb-3">
          Score Interpretation Guide
        </h3>
        <div className="divide-y divide-stone-100 text-xs">
          {PROFILE_DEFINITIONS.map((def) => {
            const isCurrent = def.tier === submission.profile;
            return (
              <div
                key={def.tier}
                className={`py-3 first:pt-0 last:pb-0 ${isCurrent ? 'bg-stone-50/80 -mx-3 px-3 rounded' : ''}`}
              >
                <div className="flex items-center justify-between font-medium mb-1">
                  <span className={`${isCurrent ? 'font-bold text-stone-900' : 'text-stone-800'}`}>
                    {def.tier}
                  </span>
                  <span className="font-mono text-stone-500">
                    {def.minScore} – {def.maxScore} pts
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  {def.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions - NO ADMIN BUTTON */}
      <div className="flex items-center justify-between gap-3 pt-2 print:hidden">
        <button
          onClick={onRetake}
          className="text-xs font-medium text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5 cursor-pointer py-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake survey</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-stone-900" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
