/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { WelcomeView } from './components/WelcomeView.tsx';
import { QuestionCard } from './components/QuestionCard.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { InfoModals } from './components/InfoModals.tsx';
import { SURVEY_QUESTIONS } from './data/questions.ts';
import { ChoiceLetter, Demographics, SurveySubmission } from './types/survey.ts';
import { calculateScoreAndBreakdown } from './utils/scoring.ts';
import { submitSurvey } from './services/api.ts';

type ViewMode = 'welcome' | 'survey' | 'results' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
      return 'admin';
    }
    return 'welcome';
  });

  const [demographics, setDemographics] = useState<Demographics>({});
  const [answers, setAnswers] = useState<Record<number, ChoiceLetter>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [submission, setSubmission] = useState<SurveySubmission | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Methodology modal
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Synchronize browser history and URL hash/path/search
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView('welcome');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentView]);

  const navigateTo = (view: ViewMode) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTest = (demo: Demographics) => {
    setDemographics(demo);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setStartTime(Date.now());
    navigateTo('survey');
  };

  const handleSelectChoice = (questionId: number, choice: ChoiceLetter) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsReviewOpen(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitSurvey = async () => {
    const { totalScore, pointsBreakdown, profile } = calculateScoreAndBreakdown(answers);
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 180;
    const participantId = demographics.participantAlias || `P-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSubmission: SurveySubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      participantId,
      timestamp: new Date().toISOString(),
      demographics,
      answers,
      pointsBreakdown,
      totalScore,
      profile,
      durationSeconds,
    };

    try {
      await submitSurvey(newSubmission);
    } catch (err) {
      console.warn('Submission notice:', err);
    }

    setSubmission(newSubmission);
    navigateTo('results');
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSubmission(null);
    navigateTo('welcome');
  };

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col text-stone-800">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenMethodologyModal={() => setIsMethodologyOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'welcome' && (
          <WelcomeView onStartTest={handleStartTest} />
        )}

        {currentView === 'survey' && (
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={SURVEY_QUESTIONS.length}
            selectedChoice={answers[currentQuestion.id]}
            onSelectChoice={handleSelectChoice}
            onNext={handleNextQuestion}
            onPrev={handlePrevQuestion}
            answers={answers}
            onOpenReview={() => setIsReviewOpen(true)}
            isLastQuestion={currentQuestionIndex === SURVEY_QUESTIONS.length - 1}
          />
        )}

        {currentView === 'results' && submission && (
          <ResultsView
            submission={submission}
            onRetake={handleRetake}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortal onBackToSurvey={() => navigateTo('welcome')} />
        )}
      </main>

      {/* Review Modal before submission */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        answers={answers}
        onJumpToQuestion={handleJumpToQuestion}
        onSubmit={handleSubmitSurvey}
      />

      {/* Methodology Info Modal */}
      <InfoModals
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Minimalist Academic Footer - NO ADMIN LINKS */}
      <footer className="border-t border-stone-200/70 py-6 px-5 text-xs text-stone-500 mt-auto">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-stone-500">
            Sexual Desire Assessment Survey · Behavioral Research
          </div>

          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            Methodology & Background
          </button>
        </div>
      </footer>
    </div>
  );
}
