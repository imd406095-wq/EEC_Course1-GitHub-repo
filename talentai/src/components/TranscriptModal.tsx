import React from 'react';
import { ChatMessage } from '../types';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  transcript: ChatMessage[];
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  transcript,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 border-b-4 border-indigo-600 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">chat_bubble</span>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">
                Interview Transcript & Agent Session Logs
              </h3>
            </div>
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Candidate: {candidateName} • Senior Frontend Technical Evaluation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-grow bg-slate-50/50">
          {transcript.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              No transcript entries logged yet. Complete interview questions to view real-time logs.
            </div>
          ) : (
            transcript.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'candidate' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 bg-slate-900 text-white flex-shrink-0 flex items-center justify-center font-mono font-bold text-[10px]">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 text-xs font-body border ${
                    msg.sender === 'candidate'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-900 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    <span>{msg.sender === 'ai' ? 'AI Evaluator' : candidateName}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {msg.code && (
                    <div className="mt-3 bg-slate-950 text-indigo-300 p-3 font-mono text-[11px] overflow-x-auto border border-slate-800">
                      <pre>{msg.code}</pre>
                    </div>
                  )}
                </div>

                {msg.sender === 'candidate' && (
                  <div className="w-7 h-7 bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center font-mono font-bold text-[10px]">
                    YOU
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            Verified by Gemini AI Assessment Engine
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
