import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ChoiceLetter } from '../types/survey.ts';
import { SURVEY_QUESTIONS } from '../data/questions.ts';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: Record<number, ChoiceLetter>;
  onJumpToQuestion: (index: number) => void;
  onSubmit: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  answers,
  onJumpToQuestion,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const totalQuestions = SURVEY_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;
  const missingCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-lg text-stone-900">
              Review Responses
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {answeredCount} of {totalQuestions} answered
              {!isComplete && ` (${missingCount} remaining)`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list - NO POINTS DISPLAYED */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-stone-100">
          {SURVEY_QUESTIONS.map((q, idx) => {
            const chosenLetter = answers[q.id];
            const chosenOption = q.choices.find((c) => c.letter === chosenLetter);

            return (
              <div
                key={q.id}
                onClick={() => {
                  onJumpToQuestion(idx);
                  onClose();
                }}
                className="pt-3 first:pt-0 group flex items-start justify-between gap-4 cursor-pointer hover:bg-stone-50/60 p-2 rounded transition-colors"
              >
                <div className="flex-1">
                  <div className="text-xs text-stone-400 font-mono mb-0.5">
                    Question {q.id}
                  </div>
                  <div className="text-sm text-stone-900 group-hover:text-stone-600 transition-colors">
                    {q.text}
                  </div>

                  {chosenOption ? (
                    <div className="mt-1 text-xs text-stone-600 flex items-center gap-2">
                      <span className="font-mono font-medium px-1.5 py-0.2 bg-stone-100 text-stone-800 rounded">
                        {chosenOption.letter}
                      </span>
                      <span className="truncate max-w-sm">{chosenOption.text}</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-stone-400 italic">
                      Not yet answered
                    </div>
                  )}
                </div>

                <div className="shrink-0 pt-1 text-xs text-stone-400 group-hover:text-stone-800 underline">
                  Edit
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200/80 bg-stone-50/50 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Back to question
          </button>

          <button
            type="button"
            onClick={() => {
              if (isComplete) {
                onClose();
                onSubmit();
              }
            }}
            disabled={!isComplete}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              isComplete
                ? 'bg-stone-900 hover:bg-stone-800 text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Submit Survey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
