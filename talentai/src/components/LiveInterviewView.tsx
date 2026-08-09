import React, { useState, useEffect } from 'react';
import { ChatMessage, InterviewQuestion, NavTab } from '../types';

interface LiveInterviewViewProps {
  candidateName: string;
  candidateAvatar: string;
  onFinishInterview: (newTranscript: ChatMessage[]) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const LiveInterviewView: React.FC<LiveInterviewViewProps> = ({
  candidateName,
  candidateAvatar,
  onFinishInterview,
  setActiveTab,
}) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([
    { id: 1, title: '1. System Architecture Basics', status: 'completed', topic: 'System Architecture' },
    { id: 2, title: '2. React Performance Hooks', status: 'active', topic: 'React Performance Hooks' },
    { id: 3, title: '3. Data Structure Manipulation', status: 'upcoming', topic: 'Data Structures & Dynamic Programming' },
    { id: 4, title: '4. Async Operations', status: 'upcoming', topic: 'Async & Promise Handling' },
    { id: 5, title: '5. Debugging Scenario', status: 'upcoming', topic: 'Performance Profiling & Debugging' },
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(1);
  const [inputMode, setInputMode] = useState<'text' | 'code'>('text');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState(
    `// Write your React Hook optimization snippet here\nimport { useMemo, useCallback, useState } from 'react';\n\nexport function OptimizedList({ items, onItemSelect }) {\n  // Implement memoized calculation and handler reference...\n}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Excellent explanation of React's render lifecycle. Now, let's dive into optimization. Could you explain the difference between useMemo and useCallback, and describe a specific scenario where you would use one over the other?",
      timestamp: '10:14 AM',
      isAiGlow: true,
    },
  ]);

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isVoiceActive && chatMessages.length > 0) {
      const latestAiMsg = [...chatMessages].reverse().find((m) => m.sender === 'ai');
      if (latestAiMsg && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(latestAiMsg.text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isVoiceActive, chatMessages]);

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not natively supported in this browser tab, but Voice Mode TTS is enabled!');
      setIsVoiceActive(!isVoiceActive);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTextAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsVoiceActive(!isVoiceActive);
    }
  };

  const handleSubmitAnswer = async () => {
    const currentInput = inputMode === 'text' ? textAnswer : codeAnswer;
    if (!currentInput.trim()) return;

    setIsSubmitting(true);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCandidateMsg: ChatMessage = {
      id: `msg-cand-${Date.now()}`,
      sender: 'candidate',
      text: inputMode === 'text' ? currentInput : 'Submitted code solution:',
      code: inputMode === 'code' ? currentInput : undefined,
      timestamp: timeStr,
    };

    const updatedMessages = [...chatMessages, newCandidateMsg];
    setChatMessages(updatedMessages);

    try {
      const currentQ = questions[activeQuestionIndex];

      const res = await fetch('/api/interview/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: activeQuestionIndex,
          questionTopic: currentQ?.topic || 'React Hooks',
          candidateAnswer: currentInput,
          history: updatedMessages.map((m) => `${m.sender}: ${m.text}`),
        }),
      });

      const data = await res.json();

      const aiReply: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `${data.feedback || 'Good analysis!'} \n\n${data.nextQuestionPrompt || 'Let\'s proceed to the next technical topic.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGlow: true,
      };

      const finalMessages = [...updatedMessages, aiReply];
      setChatMessages(finalMessages);

      if (activeQuestionIndex < questions.length - 1) {
        const nextIdx = activeQuestionIndex + 1;
        setQuestions((prev) =>
          prev.map((q, idx) => {
            if (idx === activeQuestionIndex) return { ...q, status: 'completed' };
            if (idx === nextIdx) return { ...q, status: 'active' };
            return q;
          })
        );
        setActiveQuestionIndex(nextIdx);
      } else {
        onFinishInterview(finalMessages);
      }

      setTextAnswer('');
    } catch (err) {
      console.error('Error sending interview answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeQuestion = questions[activeQuestionIndex];

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 w-full relative pb-28 md:pb-12">
      {/* Left Sidebar: Progress Tracker & Candidate Card */}
      <div className="w-full md:w-1/4 flex flex-col gap-6 shrink-0">
        {/* Progress Tracker */}
        <div className="bg-white border border-slate-200 border-b-4 border-indigo-600 p-6 shadow-sm">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 mb-2">
            Technical Assessment Gate
          </h2>

          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs text-indigo-600 font-bold uppercase tracking-widest">
              Question {activeQuestionIndex + 1} of 5
            </span>

            <span className="h-1 flex-grow bg-slate-200 overflow-hidden">
              <span
                className="h-full bg-indigo-600 block transition-all duration-500"
                style={{ width: `${((activeQuestionIndex + 1) / 5) * 100}%` }}
              ></span>
            </span>
          </div>

          <div className="space-y-2 font-body text-xs text-slate-600">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestionIndex(idx);
                  setQuestions((prev) =>
                    prev.map((item, i) => ({
                      ...item,
                      status: i < idx ? 'completed' : i === idx ? 'active' : 'upcoming',
                    }))
                  );
                }}
                className={`w-full text-left flex items-center gap-3 p-2.5 transition-colors cursor-pointer border ${
                  q.status === 'active'
                    ? 'font-bold text-slate-900 bg-indigo-50 border-indigo-300'
                    : q.status === 'completed'
                    ? 'text-slate-700 bg-slate-50 border-slate-200'
                    : 'text-slate-400 bg-white border-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {q.status === 'completed' ? (
                    <span className="text-emerald-600">check_circle</span>
                  ) : q.status === 'active' ? (
                    <span className="text-indigo-600 animate-pulse">radio_button_checked</span>
                  ) : (
                    <span className="text-slate-300">radio_button_unchecked</span>
                  )}
                </span>
                <span className="truncate font-mono text-[11px]">{q.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                onFinishInterview(chatMessages);
                setActiveTab('candidate');
              }}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">assessment</span>
              End Round & View Report
            </button>
          </div>
        </div>

        {/* Candidate Info Card */}
        <div className="bg-white border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
          <img
            src={candidateAvatar}
            alt={candidateName}
            className="w-10 h-10 object-cover border border-slate-200"
          />
          <div className="flex-grow min-w-0">
            <div className="font-body text-xs font-bold truncate text-slate-900">
              {candidateName}
            </div>
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest truncate">
              Senior Frontend Candidate
            </div>
          </div>
          <button
            onClick={toggleMic}
            className={`p-2 transition-colors cursor-pointer border ${
              isListening
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </button>
        </div>
      </div>

      {/* Main Column: AI Evaluator Chat & Response Canvas */}
      <div className="w-full md:w-3/4 flex flex-col gap-6">
        {/* T-AI Agent Chat Box */}
        <div className="bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-12 border-b border-slate-200 flex items-center px-6 justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-900 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-900">
                AI Evaluator System
              </span>
            </div>

            <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              Live Session Active
            </div>
          </div>

          {/* Chat History Container */}
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[340px] min-h-[220px]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${
                  msg.sender === 'candidate' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                    msg.sender === 'ai' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {msg.sender === 'ai' ? 'AI' : 'YOU'}
                </div>

                <div
                  className={`p-4 border ${
                    msg.sender === 'candidate'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                >
                  <p className="font-body text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {msg.code && (
                    <div className="mt-3 bg-slate-950 text-indigo-300 p-3 font-mono text-[11px] overflow-x-auto border border-slate-800">
                      <pre>{msg.code}</pre>
                    </div>
                  )}

                  <div
                    className={`font-mono text-[9px] mt-2 text-right uppercase tracking-wider ${
                      msg.sender === 'candidate' ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area Controls & Editor */}
        <div className="flex-grow flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Input Mode Selector */}
            <div className="flex bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setInputMode('text')}
                className={`px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inputMode === 'text'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Text Answer
              </button>

              <button
                onClick={() => setInputMode('code')}
                className={`px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  inputMode === 'code'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">code</span>
                Code Canvas
              </button>
            </div>

            {/* Voice Toggle */}
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`flex items-center gap-2 px-3.5 py-1.5 border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isVoiceActive
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isVoiceActive ? 'volume_up' : 'keyboard_voice'}
              </span>
              {isVoiceActive ? 'Voice Active (TTS)' : 'Voice Mode'}
            </button>
          </div>

          {/* Active Canvas */}
          {inputMode === 'text' ? (
            <div className="relative min-h-[180px] flex-grow">
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type technical response... (e.g. useMemo caches evaluated values while useCallback memoizes function references across re-renders)"
                className="w-full h-full min-h-[180px] p-4 bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none font-body text-xs text-slate-900 placeholder-slate-400 transition-all"
              />
              <div className="absolute bottom-3 right-4 text-slate-400 font-mono text-[10px] tracking-widest uppercase">
                PLAIN TEXT / MARKDOWN
              </div>
            </div>
          ) : (
            <div className="relative bg-slate-900 p-4 text-indigo-300 font-mono text-xs border border-slate-800">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-widest">
                <span>OptimizedList.tsx</span>
                <span>TypeScript / React</span>
              </div>
              <textarea
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                rows={9}
                className="w-full bg-transparent text-indigo-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Topic: {activeQuestion?.topic}
            </span>

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || (inputMode === 'text' ? !textAnswer.trim() : !codeAnswer.trim())}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Processing...
                </>
              ) : (
                <>
                  Submit Answer
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
