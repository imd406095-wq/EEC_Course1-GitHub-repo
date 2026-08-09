import React from 'react';
import { NavTab } from '../types';

interface BottomNavBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 shadow-sm">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all ${
          activeTab === 'dashboard'
            ? 'text-indigo-600 font-bold border-t-2 border-indigo-600 -mt-[2px]'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">dashboard</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Dashboard</span>
      </button>

      <button
        onClick={() => setActiveTab('interview')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all ${
          activeTab === 'interview'
            ? 'text-indigo-600 font-bold border-t-2 border-indigo-600 -mt-[2px]'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">forum</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Interview</span>
      </button>

      <button
        onClick={() => setActiveTab('resources')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all ${
          activeTab === 'resources'
            ? 'text-indigo-600 font-bold border-t-2 border-indigo-600 -mt-[2px]'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">library_books</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Resources</span>
      </button>

      <button
        onClick={() => setActiveTab('candidate')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all ${
          activeTab === 'candidate'
            ? 'text-indigo-600 font-bold border-t-2 border-indigo-600 -mt-[2px]'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">person</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Candidate</span>
      </button>
    </nav>
  );
};
