import React, { useState } from 'react';
import { LearningResource, NavTab, SkillGap } from '../types';

interface LearningPathViewProps {
  skillGaps: SkillGap[];
  resources: LearningResource[];
  setActiveTab: (tab: NavTab) => void;
  onCompleteLearning: () => void;
  isCompleted: boolean;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  skillGaps,
  resources,
  setActiveTab,
  onCompleteLearning,
  isCompleted,
}) => {
  const [activeResourceModal, setActiveResourceModal] = useState<LearningResource | null>(null);
  const [completedResources, setCompletedResources] = useState<Record<string, boolean>>({});

  const toggleResourceComplete = (id: string) => {
    setCompletedResources((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 pb-32 md:pb-24">
      {/* Header Section */}
      <div className="mb-10 max-w-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-indigo-600">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest">
            AI RECOMMENDED CURRICULUM
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-3 tracking-tight">
          Personalized Technical Modules
        </h1>

        <p className="font-body text-slate-600 text-sm md:text-base leading-relaxed">
          Based on initial assessment telemetry, complete these targeted learning paths before advancing to the live AI interview phase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Identified Skill Gaps */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 border-b-4 border-indigo-600 p-6 shadow-sm">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 mb-2">
              Identified Skill Gaps
            </h2>
            <p className="font-body text-xs text-slate-500 mb-6">
              Focus area targets selected for reinforcement.
            </p>

            <div className="space-y-3">
              {skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 hover:border-indigo-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-600 text-lg">
                      {idx === 0 ? 'data_object' : idx === 1 ? 'architecture' : 'cloud'}
                    </span>
                    <span className="font-body text-xs font-bold text-slate-900">
                      {gap.title}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 border uppercase tracking-wider ${
                      gap.status === 'Gap'
                        ? 'text-rose-700 bg-rose-50 border-rose-200'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    {gap.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Progress Card */}
          <div className="hidden md:block bg-slate-900 text-white p-6 shadow-sm">
            <div className="text-center space-y-3">
              <span className="material-symbols-outlined text-3xl text-indigo-400 animate-pulse">
                model_training
              </span>
              <p className="font-mono text-xs text-indigo-300 font-bold uppercase tracking-wider">
                {isCompleted ? 'Learning Complete • Gate Unlocked' : 'Curriculum Progress'}
              </p>
              <div className="text-2xl font-light text-white">
                {isCompleted
                  ? '100%'
                  : `${Math.round(
                      (Object.values(completedResources).filter(Boolean).length / (resources.length || 1)) * 100
                    )}%`}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {Object.values(completedResources).filter(Boolean).length} of {resources.length} modules completed
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Resources Grid */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display font-bold text-lg text-slate-900 uppercase tracking-wider">
              Curriculum Modules
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Modules ({resources.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res, index) => {
              const isDone = completedResources[res.id];

              return (
                <div
                  key={res.id}
                  className={`bg-white border p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 group ${
                    index === 2 ? 'sm:col-span-2' : ''
                  } ${
                    isDone
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-indigo-500'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span
                          className={`material-symbols-outlined ${
                            res.platform === 'YouTube'
                              ? 'text-rose-500'
                              : res.platform === 'LeetCode'
                              ? 'text-amber-500'
                              : 'text-indigo-600'
                          }`}
                        >
                          {res.platform === 'YouTube'
                            ? 'play_circle'
                            : res.platform === 'LeetCode'
                            ? 'code'
                            : 'cloud'}
                        </span>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          {res.platform}
                        </span>
                      </div>

                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border ${
                          res.priority === 'High Priority'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {res.priority === 'High Priority' ? 'High Priority' : res.duration}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </h4>

                    <p className="font-body text-xs text-slate-600 mb-6 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveResourceModal(res)}
                        className={`flex-1 py-2 px-3 font-body text-xs font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-2 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        <span>{isDone ? 'Completed' : 'Start Module'}</span>
                        <span className="material-symbols-outlined text-sm">
                          {isDone ? 'check_circle' : 'arrow_forward'}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleResourceComplete(res.id)}
                        title={isDone ? 'Mark as Pending' : 'Mark as Complete'}
                        className={`p-2 border transition-colors cursor-pointer ${
                          isDone
                            ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                            : 'border-slate-300 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isDone ? 'check' : 'done'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center justify-center text-center">
        <p className="font-body text-xs text-slate-500 uppercase tracking-widest mb-4">
          Assessment Gate Verification
        </p>

        <button
          onClick={() => {
            onCompleteLearning();
            setActiveTab('interview');
          }}
          className={`px-8 py-4 uppercase font-mono font-bold text-sm tracking-widest flex items-center gap-3 w-full sm:w-auto justify-center transition-all cursor-pointer shadow-sm ${
            isCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <span>{isCompleted ? 'Learning Completed • Launch Interview' : 'Mark All Completed & Launch Interview'}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>

      {/* Interactive Resource Viewer Modal */}
      {activeResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-none max-w-2xl w-full p-6 shadow-xl border border-slate-300">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold tracking-widest">
                  {activeResourceModal.platform} • {activeResourceModal.duration}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
                  {activeResourceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveResourceModal(null)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 font-body text-xs text-slate-600 mb-6">
              <p>{activeResourceModal.description}</p>
              <div className="bg-slate-50 p-4 border border-slate-200">
                <h4 className="font-mono font-bold text-slate-900 mb-2 text-[10px] uppercase tracking-widest">
                  AI LEARNING SUMMARY & KEY TAKEAWAYS
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                  <li>Mastering Hook dependency arrays and ref stability in React 18</li>
                  <li>Memoizing expensive calculation results with useMemo vs callback memoization with useCallback</li>
                  <li>Optimizing virtual DOM re-renders in deep component hierarchies</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <a
                href={activeResourceModal.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                EXTERNAL RESOURCE LINK
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>

              <button
                onClick={() => {
                  toggleResourceComplete(activeResourceModal.id);
                  setActiveResourceModal(null);
                }}
                className="px-5 py-2 bg-emerald-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
