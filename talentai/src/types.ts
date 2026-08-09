export type NavTab = 'dashboard' | 'interview' | 'resources' | 'candidate';

export interface SkillGap {
  title: string;
  status: 'Gap' | 'Review' | 'Mastered';
  description: string;
}

export interface LearningResource {
  id: string;
  title: string;
  platform: 'YouTube' | 'LeetCode' | 'AWS' | 'Documentation';
  duration: string;
  priority: string;
  description: string;
  url: string;
  completed?: boolean;
}

export interface CandidateData {
  name: string;
  role: string;
  avatarUrl: string;
  matchScore: number;
  statusStep: string;
  evaluationScores: {
    technical: number;
    coding: number;
    hr: number;
  };
  decision: 'SELECT' | 'REJECT' | 'PENDING';
  badge: string;
  metrics: {
    duration: string;
    confidence: string;
  };
  strengths: string[];
  areasForImprovement: string[];
  funnelStage: 'Screen' | 'Tech' | 'Review' | 'Offer';
}

export interface InterviewQuestion {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'upcoming';
  topic: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  code?: string;
  timestamp: string;
  isAiGlow?: boolean;
}
