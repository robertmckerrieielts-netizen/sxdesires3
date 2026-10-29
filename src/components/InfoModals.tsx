import React from 'react';
import { X } from 'lucide-react';
import { RESEARCH_DISCLAIMER, RESEARCH_PURPOSE_TEXT } from '../data/questions.ts';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <h3 className="font-editorial text-lg text-stone-900">
            About the Research
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div>
            <h4 className="font-semibold text-stone-900 mb-1">
              Theoretical Foundation
            </h4>
            <p className="text-stone-600 mb-3">
              {RESEARCH_PURPOSE_TEXT}
            </p>
            <p className="text-stone-600">
              Contemporary sexology demonstrates that sexual desire operates within a circular, contextual feedback loop (Rosemary Basson) and the Dual-Control Model (Bancroft & Janssen), balancing sexual excitation and inhibition systems.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-lg border border-stone-200/70 text-xs space-y-1.5">
            <div className="font-semibold text-stone-900">Dimensions Assessed:</div>
            <ul className="space-y-1 text-stone-600 list-disc pl-4">
              <li>Spontaneous thoughts, internal cues, and fantasies</li>
              <li>Responsive arousal triggered by foreplay and partner touch</li>
              <li>Stress resilience, fatigue, and physical vitality</li>
              <li>Emotional safety and communicative comfort</li>
              <li>Somatic awareness and satisfaction stability</li>
            </ul>
          </div>

          <div className="border-t border-stone-100 pt-3 text-xs text-stone-500 italic">
            {RESEARCH_DISCLAIMER}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200/80 bg-stone-50/50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
