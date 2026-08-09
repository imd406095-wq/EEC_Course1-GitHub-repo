import React from 'react';
import { CandidateData, NavTab, SkillGap } from '../types';

interface DashboardViewProps {
  candidate: CandidateData;
  skillGaps: SkillGap[];
  setActiveTab: (tab: NavTab) => void;
  onOpenResumeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  candidate,
  skillGaps,
  setActiveTab,
  onOpenResumeModal,
}) => {
  const isLearningCompleted = candidate.statusStep.includes('Step 2') || candidate.statusStep.includes('Step 3');

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 pb-28 md:pb-12">
      {/* Geometric Metric Cards Top Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="geometric-card p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            Candidate Match Rating
          </span>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-4xl font-light text-slate-900">{candidate.matchScore}%</span>
            <span className="text-emerald-600 text-xs font-bold mb-1 uppercase tracking-wider">
              HIGH POTENTIAL
            </span>
          </div>
        </div>

        <div className="geometric-card-slate p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            Evaluation Funnel
          </span>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-2xl font-semibold text-slate-900">{candidate.funnelStage}</span>
            <span className="text-indigo-600 text-xs font-bold mb-1 uppercase tracking-wider">
              {candidate.statusStep.split(':')[0]}
            </span>
          </div>
        </div>

        <div className="geometric-card-emerald p-6 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            System Status
          </span>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-2xl font-semibold text-slate-900">ACTIVE</span>
            <span className="text-emerald-600 text-xs font-bold mb-1 uppercase tracking-wider">
              100% OPERATIONAL
            </span>
          </div>
        </div>
      </section>

      {/* Header & Action Bar */}
      <section className="mb-8 bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Assessment Dashboard: {candidate.name}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 font-body text-xs mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-700 uppercase tracking-wider">{candidate.statusStep}</span>
            <span>•</span>
            <span>{candidate.role}</span>
          </div>
        </div>

        <button
          onClick={onOpenResumeModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-slate-900 hover:bg-indigo-950 text-white font-body text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border border-slate-800 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          Re-analyze Resume
        </button>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Resume Analysis Card (AI Agent) */}
        <div className="md:col-span-8 bg-white border border-slate-200 p-6 md:p-8 relative flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600"></div>
                <h2 className="font-display font-bold uppercase tracking-wider text-sm text-slate-900">
                  AI Resume Analysis & Competencies
                </h2>
              </div>
              <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">
                AUTOMATED VERIFICATION
              </span>
            </div>

            <p className="font-body text-slate-600 text-sm mb-6 leading-relaxed">
              TalentAI has parsed candidate credentials against the target specification for{' '}
              <strong className="text-slate-900">{candidate.role}</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Skill Match Score Box */}
              <div className="sm:col-span-4 bg-slate-900 text-white p-6 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mb-2">
                  Match Rating
                </span>
                <div className="font-display font-light text-5xl text-white mb-2">
                  {candidate.matchScore}%
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Target threshold: 65%
                </span>
              </div>

              {/* Insight Box */}
              <div className="sm:col-span-8 space-y-4">
                <div className="bg-slate-50 border-l-4 border-amber-500 p-4">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                    <div>
                      <h3 className="font-body font-bold text-xs uppercase tracking-wider text-slate-900">
                        Target Skill Gap Detected
                      </h3>
                      <p className="font-body text-xs text-slate-600 mt-1 leading-relaxed">
                        {skillGaps[0]?.description ||
                          'Gap identified in advanced React performance optimization techniques.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('resources')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-body text-xs font-bold uppercase tracking-widest py-3 px-6 w-full flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-white text-[18px]">
                    school
                  </span>
                  Open Learning Path
                </button>
              </div>
            </div>
          </div>

          {/* Identified Competencies */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-body">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Competency Breakdown:
            </span>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold border uppercase tracking-wider ${
                    gap.status === 'Gap'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {gap.title} [{gap.status}]
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Interview Gate Card */}
        <div
          className={`md:col-span-4 p-6 md:p-8 flex flex-col justify-between items-center text-center transition-all ${
            isLearningCompleted
              ? 'bg-indigo-950 text-white border border-indigo-900'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center mb-4 border ${
                isLearningCompleted
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-slate-100 text-slate-400 border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isLearningCompleted ? 'lock_open' : 'lock'}
              </span>
            </div>

            <h3 className={`font-display font-bold text-lg uppercase tracking-wider mb-2 ${isLearningCompleted ? 'text-white' : 'text-slate-900'}`}>
              Technical Interview
            </h3>

            <p className={`font-body text-xs mb-6 leading-relaxed ${isLearningCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
              {isLearningCompleted
                ? 'Learning path complete. Proceed to live AI interview simulation.'
                : 'Complete recommended learning path modules to unlock stage 2.'}
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isLearningCompleted ? 'w-full bg-emerald-400' : 'w-1/3 bg-slate-400'
                }`}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest uppercase">
              <span className={isLearningCompleted ? 'text-slate-400' : 'text-slate-400'}>STAGE 2 GATE</span>
              <span className={isLearningCompleted ? 'text-emerald-400' : 'text-slate-500'}>
                {isLearningCompleted ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('interview')}
              className={`w-full py-3 px-4 font-body text-xs font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-2 cursor-pointer ${
                isLearningCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              {isLearningCompleted ? 'Start Technical Round' : 'Preview Simulator'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('resources')}
          className="p-5 bg-white border border-slate-200 hover:border-indigo-600 text-left transition-all group flex items-center justify-between shadow-sm cursor-pointer"
        >
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              MODULE 01
            </div>
            <div className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
              Personalized Learning Path
            </div>
          </div>
          <span className="material-symbols-outlined text-indigo-600 group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className="p-5 bg-white border border-slate-200 hover:border-indigo-600 text-left transition-all group flex items-center justify-between shadow-sm cursor-pointer"
        >
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              MODULE 02
            </div>
            <div className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
              Live Interview Simulator
            </div>
          </div>
          <span className="material-symbols-outlined text-indigo-600 group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>

        <button
          onClick={() => setActiveTab('candidate')}
          className="p-5 bg-white border border-slate-200 hover:border-indigo-600 text-left transition-all group flex items-center justify-between shadow-sm cursor-pointer"
        >
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              MODULE 03
            </div>
            <div className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
              Candidate Evaluation Report
            </div>
          </div>
          <span className="material-symbols-outlined text-indigo-600 group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
