import React, { useState } from 'react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (resumeText: string, targetRole: string) => Promise<void>;
  isLoading: boolean;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  isLoading,
}) => {
  const [role, setRole] = useState('Senior Frontend Engineer');
  const [resumeText, setResumeText] = useState(
    `Alex Rivera
Senior Frontend Engineer | 6+ years experience
- Specializing in React 18, TypeScript, Redux Toolkit, and Vite.
- Built scalable web applications with performance monitoring.
- Need deeper optimization on React Hooks lifecycle, useCallback, memoization, and AWS networking.`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(resumeText, role);
  };

  const handleSampleClick = (sampleRole: string, sampleText: string) => {
    setRole(sampleRole);
    setResumeText(sampleText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 border-b-4 border-indigo-600 max-w-xl w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">description</span>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">
              Upload / Analyze Resume with AI
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
              TARGET ROLE
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 font-body text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
              RESUME / SKILLS SUMMARY TEXT
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-3 border border-slate-200 font-body text-xs text-slate-900 focus:border-indigo-600 focus:outline-none resize-none"
              placeholder="Paste candidate resume, key skills, or project experience here..."
              required
            />
          </div>

          <div>
            <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">QUICK SAMPLE PROFILES</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSampleClick(
                    'Senior Frontend Engineer',
                    `Alex Rivera\n6+ years React, TypeScript, Redux, Next.js\nStrong system architecture experience, minor gaps in advanced hook lifecycle profiling and AWS cloud architecture.`
                  )
                }
                className="text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 border border-slate-200 transition-colors cursor-pointer"
              >
                Frontend Senior (Alex Rivera)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSampleClick(
                    'Full Stack AI Engineer',
                    `Jordan Lee\n4+ years Node.js, Python, FastAPI, Gemini API, PyTorch.\nStrong backend & LLM orchestration skills, gaps in React performance hooks and micro-frontend state.`
                  )
                }
                className="text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 border border-slate-200 transition-colors cursor-pointer"
              >
                Full Stack AI (Jordan Lee)
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">
                    auto_awesome
                  </span>
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
