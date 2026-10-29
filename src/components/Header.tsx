import React from 'react';

interface HeaderProps {
  currentView: 'welcome' | 'survey' | 'results' | 'admin';
  onNavigate: (view: 'welcome' | 'survey' | 'results' | 'admin') => void;
  onOpenMethodologyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenMethodologyModal,
}) => {
  return (
    <header className="border-b border-stone-200/70 bg-[#FAF9F5]/90 backdrop-blur-xs sticky top-0 z-30">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-5 sm:px-6 py-4">
        {/* Brand: Single understated editorial text */}
        <button
          onClick={() => onNavigate('welcome')}
          className="text-left cursor-pointer group focus:outline-none"
        >
          <span className="font-editorial text-lg sm:text-xl font-medium tracking-tight text-stone-900 group-hover:text-stone-600 transition-colors">
            Sexual Desire Assessment
          </span>
        </button>

        {/* Minimalist human navigation links - NO admin links */}
        <nav className="flex items-center gap-5 text-xs text-stone-500 font-medium">
          {currentView === 'admin' ? (
            <button
              onClick={() => onNavigate('welcome')}
              className="text-stone-900 hover:text-stone-600 transition-colors cursor-pointer"
            >
              ← Return to Survey
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('welcome')}
                className={`transition-colors cursor-pointer ${
                  currentView === 'welcome' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={onOpenMethodologyModal}
                className="hover:text-stone-900 transition-colors cursor-pointer"
              >
                About the Research
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
