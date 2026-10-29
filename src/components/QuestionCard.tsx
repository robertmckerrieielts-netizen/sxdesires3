import React, { useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ChoiceLetter, SurveyQuestion } from '../types/survey.ts';

interface QuestionCardProps {
  question: SurveyQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedChoice?: ChoiceLetter;
  onSelectChoice: (questionId: number, choice: ChoiceLetter) => void;
  onNext: () => void;
  onPrev: () => void;
  answers: Record<number, ChoiceLetter>;
  onOpenReview: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedChoice,
  onSelectChoice,
  onNext,
  onPrev,
  onOpenReview,
  isLastQuestion,
}) => {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') {
        e.preventDefault();
        onSelectChoice(question.id, 'A');
      } else if (key === 'B' || key === '2') {
        e.preventDefault();
        onSelectChoice(question.id, 'B');
      } else if (key === 'C' || key === '3') {
        e.preventDefault();
        onSelectChoice(question.id, 'C');
      } else if (key === 'D' || key === '4') {
        e.preventDefault();
        onSelectChoice(question.id, 'D');
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (selectedChoice) {
          e.preventDefault();
          onNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault();
          onPrev();
        }
      }
    },
    [question.id, onSelectChoice, selectedChoice, onNext, onPrev, currentIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
      {/* Progress line */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-stone-500 font-sans mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <button
            onClick={onOpenReview}
            className="hover:text-stone-900 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Review all
          </button>
        </div>
        <div className="w-full bg-stone-200/60 h-1 rounded-full overflow-hidden">
          <div
            className="bg-stone-800 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main question presentation */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-7 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-8">
        <div className="text-xs text-stone-500 mb-2 italic">
          Over the past 3 to 6 months:
        </div>

        <h2 className="font-editorial text-2xl sm:text-[28px] font-normal text-stone-900 leading-snug mb-8">
          {question.text}
        </h2>

        {/* Choices - NO POINTS SHOWN */}
        <div className="space-y-3">
          {question.choices.map((choice) => {
            const isSelected = selectedChoice === choice.letter;
            return (
              <button
                key={choice.letter}
                type="button"
                onClick={() => onSelectChoice(question.id, choice.letter)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-lg border transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50/70 shadow-2xs'
                    : 'border-stone-200/80 hover:border-stone-300 bg-white hover:bg-stone-50/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-stone-900 text-white font-medium'
                        : 'bg-stone-100 text-stone-600 border border-stone-200/70'
                    }`}
                  >
                    {choice.letter}
                  </span>
                  <span className="text-sm sm:text-[15px] text-stone-800 font-normal leading-relaxed">
                    {choice.text}
                  </span>
                </div>

                {/* Subtle radio indicator */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer py-2 px-3 rounded ${
            currentIndex === 0
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={onOpenReview}
            disabled={!selectedChoice}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              selectedChoice
                ? 'bg-stone-900 hover:bg-stone-800 text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Review & Complete</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedChoice}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              selectedChoice
                ? 'bg-stone-900 hover:bg-stone-800 text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="text-[11px] text-stone-400 text-center mt-6 font-sans">
        Keys <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px]">A</kbd>–<kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px]">D</kbd> or <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px]">1</kbd>–<kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px]">4</kbd> to select · <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px]">Enter</kbd> to advance
      </div>
    </div>
  );
};
