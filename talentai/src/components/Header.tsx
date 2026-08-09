import React from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  candidateName: string;
  avatarUrl: string;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  candidateName,
  avatarUrl,
  isLive = false,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 h-16 sticky top-0 z-50 flex justify-between items-center w-full">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-8 h-8 bg-indigo-950 text-white font-bold flex items-center justify-center text-lg shadow-sm">
          T
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg tracking-tight text-slate-900">
            TalentAI
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 uppercase tracking-widest">
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`font-body text-xs font-bold uppercase tracking-wider transition-colors py-1 ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`font-body text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 py-1 ${
            activeTab === 'interview'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Interview
          {isLive && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`font-body text-xs font-bold uppercase tracking-wider transition-colors py-1 ${
            activeTab === 'resources'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Resources
        </button>

        <button
          onClick={() => setActiveTab('candidate')}
          className={`font-body text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 py-1 ${
            activeTab === 'candidate'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">person</span>
          Candidates
        </button>
      </nav>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-3">
        {isLive && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE SESSION
          </div>
        )}

        <button
          onClick={() => setActiveTab('candidate')}
          title={`Candidate Profile: ${candidateName}`}
          className="w-8 h-8 rounded-none overflow-hidden border border-slate-300 hover:border-indigo-600 transition-all cursor-pointer"
        >
          <img
            src={avatarUrl}
            alt={candidateName}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
