import React, { useState } from 'react';
import { CandidateData } from '../types';

interface CandidateReportViewProps {
  candidate: CandidateData;
  onUpdateCandidate: (updated: Partial<CandidateData>) => void;
  onOpenTranscript: () => void;
}

export const CandidateReportView: React.FC<CandidateReportViewProps> = ({
  candidate,
  onUpdateCandidate,
  onOpenTranscript,
}) => {
  const [isEditingScores, setIsEditingScores] = useState(false);

  const handleScoreChange = (type: 'technical' | 'coding' | 'hr', value: number) => {
    onUpdateCandidate({
      evaluationScores: {
        ...candidate.evaluationScores,
        [type]: value,
      },
    });
  };

  const handleDecision = (decision: 'SELECT' | 'REJECT') => {
    if (decision === 'SELECT') {
      onUpdateCandidate({
        decision: 'SELECT',
        badge: 'SELECT - High Potential',
        funnelStage: 'Offer',
      });
    } else {
      onUpdateCandidate({
        decision: 'REJECT',
        badge: 'REJECTED - Archived',
      });
    }
  };

  const setStage = (stage: 'Screen' | 'Tech' | 'Review' | 'Offer') => {
    onUpdateCandidate({ funnelStage: stage });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 mb-20 md:mb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 bg-white border border-slate-200 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
              Candidate Evaluation: {candidate.name}
            </h1>

            <span
              className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                candidate.decision === 'SELECT'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : candidate.decision === 'REJECT'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {candidate.decision === 'SELECT' ? 'stars' : candidate.decision === 'REJECT' ? 'cancel' : 'pending'}
              </span>
              {candidate.badge}
            </span>
          </div>

          <p className="font-body text-xs text-slate-500 uppercase tracking-widest font-mono">
            Target Role: {candidate.role}
          </p>
        </div>

        {/* Action Decision Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleDecision('REJECT')}
            className={`px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border cursor-pointer ${
              candidate.decision === 'REJECT'
                ? 'bg-rose-700 text-white border-rose-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            Reject Candidate
          </button>

          <button
            onClick={() => handleDecision('SELECT')}
            className={`px-6 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              candidate.decision === 'SELECT'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Select Candidate
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Assessment Scores (Left Column) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Score Card */}
          <div className="bg-white border border-slate-200 border-b-4 border-indigo-600 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">bar_chart</span>
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">
                  Evaluation Metrics
                </h2>
              </div>

              <button
                onClick={() => setIsEditingScores(!isEditingScores)}
                className="text-[10px] font-mono font-bold uppercase text-indigo-600 hover:underline cursor-pointer"
              >
                {isEditingScores ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Technical */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-body text-xs text-slate-700 font-bold uppercase tracking-wider">Technical</span>
                  <span className="font-mono font-bold text-xs text-indigo-600">
                    {candidate.evaluationScores.technical}/10
                  </span>
                </div>
                {isEditingScores ? (
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={candidate.evaluationScores.technical}
                    onChange={(e) => handleScoreChange('technical', parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                ) : (
                  <div className="h-2 w-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-700"
                      style={{ width: `${candidate.evaluationScores.technical * 10}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Coding */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-body text-xs text-slate-700 font-bold uppercase tracking-wider">Coding</span>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {candidate.evaluationScores.coding}/10
                  </span>
                </div>
                {isEditingScores ? (
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={candidate.evaluationScores.coding}
                    onChange={(e) => handleScoreChange('coding', parseInt(e.target.value))}
                    className="w-full accent-slate-900"
                  />
                ) : (
                  <div className="h-2 w-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-slate-900 transition-all duration-700"
                      style={{ width: `${candidate.evaluationScores.coding * 10}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* HR / Soft Skills */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-body text-xs text-slate-700 font-bold uppercase tracking-wider">Soft Skills</span>
                  <span className="font-mono font-bold text-xs text-emerald-600">
                    {candidate.evaluationScores.hr}/10
                  </span>
                </div>
                {isEditingScores ? (
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={candidate.evaluationScores.hr}
                    onChange={(e) => handleScoreChange('hr', parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                ) : (
                  <div className="h-2 w-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-700"
                      style={{ width: `${candidate.evaluationScores.hr * 10}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 border-b-4 border-slate-700 p-6 shadow-sm">
            <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              SESSION METRICS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Duration</p>
                <p className="font-display font-light text-2xl text-slate-900 mt-1">
                  {candidate.metrics.duration}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Confidence Score</p>
                <p className="font-display font-light text-2xl text-emerald-600 mt-1">
                  {candidate.metrics.confidence}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Report (Right Column) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* AI Summary Card */}
          <div className="bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  smart_toy
                </span>
              </div>
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">
                AI Evaluator Report Analysis
              </h2>
            </div>

            {/* Strengths */}
            <div className="bg-emerald-50/40 border border-emerald-200 p-5 mb-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">add_circle</span>
                <div>
                  <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Verified Competencies & Strengths
                  </h4>
                  <ul className="list-disc list-inside space-y-1 font-body text-xs text-slate-700">
                    {candidate.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-rose-50/40 border border-rose-200 p-5 mb-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-rose-600 mt-0.5">remove_circle</span>
                <div>
                  <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Target Development Opportunities
                  </h4>
                  <ul className="list-disc list-inside space-y-1 font-body text-xs text-slate-700">
                    {candidate.areasForImprovement.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onOpenTranscript}
                className="font-mono text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider"
              >
                View Full Interview Transcript & Logs
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Funnel Progress */}
          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              HIRING FUNNEL PIPELINE
            </h3>

            <div className="relative flex justify-between items-center w-full px-4">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -z-10 -translate-y-1/2"></div>
              <div
                className={`absolute top-1/2 left-0 h-[2px] bg-indigo-600 -z-10 -translate-y-1/2 transition-all duration-700 ${
                  candidate.funnelStage === 'Screen'
                    ? 'w-1/4'
                    : candidate.funnelStage === 'Tech'
                    ? 'w-2/4'
                    : candidate.funnelStage === 'Review'
                    ? 'w-3/4'
                    : 'w-full'
                }`}
              ></div>

              {(['Screen', 'Tech', 'Review', 'Offer'] as const).map((stage, idx) => {
                const isPassed =
                  (stage === 'Screen' && candidate.funnelStage !== 'Screen') ||
                  (stage === 'Tech' && (candidate.funnelStage === 'Review' || candidate.funnelStage === 'Offer')) ||
                  (stage === 'Review' && candidate.funnelStage === 'Offer') ||
                  (stage === 'Offer' && candidate.decision === 'SELECT');

                const isActive = candidate.funnelStage === stage;

                return (
                  <button
                    key={stage}
                    onClick={() => setStage(stage)}
                    className="flex flex-col items-center gap-2 bg-white px-2 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center transition-all border ${
                        isPassed
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isActive
                          ? 'bg-slate-900 border-2 border-indigo-600 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : isActive ? (
                        <div className="w-2 h-2 bg-indigo-400"></div>
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {stage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
