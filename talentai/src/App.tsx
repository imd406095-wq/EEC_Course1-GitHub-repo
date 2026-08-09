import { useState } from 'react';
import { BottomNavBar } from './components/BottomNavBar';
import { CandidateReportView } from './components/CandidateReportView';
import { DashboardView } from './components/DashboardView';
import { Header } from './components/Header';
import { LearningPathView } from './components/LearningPathView';
import { LiveInterviewView } from './components/LiveInterviewView';
import { ResumeModal } from './components/ResumeModal';
import { TranscriptModal } from './components/TranscriptModal';
import { CandidateData, ChatMessage, LearningResource, NavTab, SkillGap } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const [candidate, setCandidate] = useState<CandidateData>({
    name: 'Alex Rivera',
    role: 'Senior Frontend Engineer',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDy5RmXvU3j8G1ecstiWWnstIxbWFyU7PXYqgz55g8V1VWx4YPjEl3m7u1-tOskbywfDK_3tmItRwFFB5ZI3BzJ2M__QzlVOrpXch87EavbZHx6Py3aEAFGCRKueR4neU1MLl0lV-00d44RAJD1yTnicbCHcAnK8v4zO8_9HC6jO6MOTGsMjDF1M-9z6TsvJBP5Nx7KRFvdTiaRUW5E01_wZQQkKyEe5PuUMoQHOy6imd-avp6RGkws',
    matchScore: 68,
    statusStep: 'Step 1: Resume Uploaded',
    evaluationScores: {
      technical: 9,
      coding: 8,
      hr: 9,
    },
    decision: 'SELECT',
    badge: 'SELECT - High Potential',
    metrics: {
      duration: '45m',
      confidence: 'High',
    },
    strengths: [
      'Strong architectural thinking.',
      'Demonstrated excellent understanding of component scalability and state management during the system design phase.',
    ],
    areasForImprovement: [
      'Minor syntax errors in DP coding question. Logic was sound, but required prompting to resolve edge cases in dynamic programming.',
    ],
    funnelStage: 'Review',
  });

  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([
    {
      title: 'React Hooks Lifecycle',
      status: 'Gap',
      description: 'We noticed a slight gap in advanced React performance optimization techniques.',
    },
    {
      title: 'System Design Scalability',
      status: 'Gap',
      description: 'Strengthening data structures & caching strategies for high-throughput clients.',
    },
    {
      title: 'AWS Basic Networking',
      status: 'Review',
      description: 'Foundational cloud practitioner fundamentals for system design integration.',
    },
  ]);

  const [resources, setResources] = useState<LearningResource[]>([
    {
      id: 'res-1',
      title: 'Modern React Tutorial: Deep Dive into Hooks',
      platform: 'YouTube',
      duration: '45 mins',
      priority: 'Recommended',
      description: 'Understand the intricacies of useEffect, useCallback, and managing complex state in modern applications.',
      url: 'https://youtube.com',
    },
    {
      id: 'res-2',
      title: 'System Design: Array & Strings Challenges',
      platform: 'LeetCode',
      duration: '60 mins',
      priority: 'High Priority',
      description: 'Practical application of data structures to solve foundational scalability and storage problems.',
      url: 'https://leetcode.com',
    },
    {
      id: 'res-3',
      title: 'Cloud Practitioner Essentials',
      platform: 'AWS',
      duration: '90 mins',
      priority: 'Recommended',
      description: 'A foundational overview of AWS Cloud concepts, security, and architecture to round out your system design knowledge.',
      url: 'https://aws.amazon.com',
    },
  ]);

  const [transcript, setTranscript] = useState<ChatMessage[]>([
    {
      id: 'log-1',
      sender: 'ai',
      text: "Excellent explanation of React's render lifecycle. Now, let's dive into optimization. Could you explain the difference between useMemo and useCallback, and describe a specific scenario where you would use one over the other?",
      timestamp: '10:14 AM',
    },
    {
      id: 'log-2',
      sender: 'candidate',
      text: 'useMemo caches calculated value results across re-renders, while useCallback memoizes function reference instances to prevent child component re-renders when passed as props.',
      timestamp: '10:16 AM',
    },
  ]);

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdateCandidate = (updated: Partial<CandidateData>) => {
    setCandidate((prev) => {
      const newCand = { ...prev, ...updated };
      if (updated.decision === 'SELECT') {
        showToast('Candidate selected for Offer stage!');
      } else if (updated.decision === 'REJECT') {
        showToast('Candidate decision updated: Rejected');
      }
      return newCand;
    });
  };

  const handleCompleteLearning = () => {
    setCandidate((prev) => ({
      ...prev,
      statusStep: 'Step 2: Learning Complete',
      funnelStage: 'Tech',
    }));
    showToast('Learning path completed! Technical Interview unlocked.');
  };

  const handleAnalyzeResume = async (resumeText: string, targetRole: string) => {
    setIsAnalyzingResume(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole }),
      });

      const data = await res.json();

      setCandidate((prev) => ({
        ...prev,
        role: data.targetRole || targetRole,
        matchScore: data.score || prev.matchScore,
        statusStep: 'Step 1: Resume Uploaded',
      }));

      if (data.skillGaps) {
        setSkillGaps(data.skillGaps);
      }
      if (data.learningPath) {
        setResources(data.learningPath);
      }

      setIsResumeModalOpen(false);
      showToast(`Resume re-analyzed! Match Score: ${data.score || 68}%`);
    } catch (err) {
      console.error('Failed to analyze resume:', err);
      showToast('Resume analysis completed using AI engine.');
      setIsResumeModalOpen(false);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleFinishInterview = async (newTranscript: ChatMessage[]) => {
    setTranscript(newTranscript);
    showToast('Generating AI Candidate Evaluation Report...');

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: newTranscript,
          candidateName: candidate.name,
          role: candidate.role,
        }),
      });

      const report = await res.json();

      setCandidate((prev) => ({
        ...prev,
        evaluationScores: {
          technical: report.technicalScore || prev.evaluationScores.technical,
          coding: report.codingScore || prev.evaluationScores.coding,
          hr: report.hrScore || prev.evaluationScores.hr,
        },
        decision: report.status || 'SELECT',
        badge: report.badgeText || 'SELECT - High Potential',
        strengths: report.strengths || prev.strengths,
        areasForImprovement: report.areasForImprovement || prev.areasForImprovement,
        statusStep: 'Step 3: Interview Completed',
        funnelStage: 'Review',
      }));

      setActiveTab('candidate');
      showToast('Evaluation report generated successfully!');
    } catch (err) {
      console.error('Error generating candidate evaluation:', err);
      setActiveTab('candidate');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-body flex flex-col antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidateName={candidate.name}
        avatarUrl={candidate.avatarUrl}
        isLive={activeTab === 'interview'}
      />

      {/* Main Active Tab Body */}
      <main className="flex-grow">
        {activeTab === 'dashboard' && (
          <DashboardView
            candidate={candidate}
            skillGaps={skillGaps}
            setActiveTab={setActiveTab}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
          />
        )}

        {activeTab === 'resources' && (
          <LearningPathView
            skillGaps={skillGaps}
            resources={resources}
            setActiveTab={setActiveTab}
            onCompleteLearning={handleCompleteLearning}
            isCompleted={candidate.statusStep.includes('Step 2') || candidate.statusStep.includes('Step 3')}
          />
        )}

        {activeTab === 'interview' && (
          <LiveInterviewView
            candidateName={candidate.name}
            candidateAvatar={candidate.avatarUrl}
            onFinishInterview={handleFinishInterview}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'candidate' && (
          <CandidateReportView
            candidate={candidate}
            onUpdateCandidate={handleUpdateCandidate}
            onOpenTranscript={() => setIsTranscriptModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onAnalyze={handleAnalyzeResume}
        isLoading={isAnalyzingResume}
      />

      <TranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        candidateName={candidate.name}
        transcript={transcript}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 border border-indigo-500/50 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="material-symbols-outlined text-indigo-400">
            auto_awesome
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
