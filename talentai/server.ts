import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client initialization
let genAiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set. Real AI features will use fallback mock analysis if API key remains unset.');
    }
    genAiInstance = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiInstance;
}

// ---------------- API ENDPOINTS ----------------

// 1. Resume & Profile Analysis Endpoint
app.post('/api/resume/analyze', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const role = targetRole || 'Senior Frontend Engineer';

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if key is missing
      return res.json({
        candidateName: 'Alex Rivera',
        targetRole: role,
        score: 68,
        summary: `Our Training Agent has reviewed your profile. Here's a quick summary of your skill alignment for the ${role} role.`,
        skillGaps: [
          { title: 'React Hooks Lifecycle', status: 'Gap', description: 'Gap found in advanced React performance optimization techniques and hooks lifecycle.' },
          { title: 'System Design Scalability', status: 'Gap', description: 'Needs deeper experience in distributed client-side caching & data structures.' },
          { title: 'AWS Basic Networking', status: 'Review', description: 'Foundational understanding of Cloud Practitioner networking basics recommended.' }
        ],
        learningPath: [
          {
            id: 'res-1',
            title: 'Modern React Tutorial: Deep Dive into Hooks',
            platform: 'YouTube',
            duration: '45 mins',
            priority: 'Recommended',
            description: 'Understand the intricacies of useEffect, useCallback, and managing complex state in modern applications.',
            url: 'https://youtube.com'
          },
          {
            id: 'res-2',
            title: 'System Design: Array & Strings Challenges',
            platform: 'LeetCode',
            duration: '60 mins',
            priority: 'High Priority',
            description: 'Practical application of data structures to solve foundational scalability and storage problems.',
            url: 'https://leetcode.com'
          },
          {
            id: 'res-3',
            title: 'Cloud Practitioner Essentials',
            platform: 'AWS',
            duration: '90 mins',
            priority: 'Recommended',
            description: 'A foundational overview of AWS Cloud concepts, security, and architecture to round out your system design knowledge.',
            url: 'https://aws.amazon.com'
          }
        ]
      });
    }

    const ai = getGenAI();
    const prompt = `Analyze this candidate's resume/profile for the position of "${role}".
Resume/Profile details:
${resumeText || 'Experienced Senior Frontend Engineer with React, TypeScript, state management, and performance tuning skills.'}

Perform a thorough gap analysis and return a structured JSON evaluation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING },
            targetRole: { type: Type.STRING },
            score: { type: Type.INTEGER, description: 'Match score between 0 and 100' },
            summary: { type: Type.STRING },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'Gap, Review, or Mastered' },
                  description: { type: Type.STRING }
                },
                required: ['title', 'status', 'description']
              }
            },
            learningPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  description: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ['id', 'title', 'platform', 'duration', 'priority', 'description']
              }
            }
          },
          required: ['candidateName', 'targetRole', 'score', 'summary', 'skillGaps', 'learningPath']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze profile' });
  }
});

// 2. Interactive AI Technical Interview Endpoint
app.post('/api/interview/ask', async (req, res) => {
  try {
    const { questionIndex, questionTopic, candidateAnswer, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Mock feedback if key missing
      return res.json({
        feedback: "Excellent explanation of React's render lifecycle! You correctly highlighted component re-renders, hook dependency arrays, and reference equality.",
        score: 9,
        aiAgentState: "Analyzing Response...",
        nextQuestionPrompt: `Could you explain the difference between useMemo and useCallback, and describe a specific scenario where you would choose useMemo over useCallback?`,
        suggestedTopics: ["React Performance Hooks", "Memory Optimization"]
      });
    }

    const ai = getGenAI();
    const prompt = `You are T-AI Agent, an expert AI Technical Interviewer conducting a Senior Frontend Engineering interview.
Current Question (#${(questionIndex || 1) + 1}): "${questionTopic || 'React Performance Hooks'}".
Candidate's Answer:
"${candidateAnswer || 'useMemo caches calculated values while useCallback caches function references across renders.'}"

Interview History context: ${JSON.stringify(history || [])}

Provide feedback on the candidate's answer, assign a rating (1-10), and pose the next follow-up question or technical scenario. Return in structured JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            score: { type: Type.INTEGER, description: 'Question rating 1-10' },
            aiAgentState: { type: Type.STRING },
            nextQuestionPrompt: { type: Type.STRING },
            suggestedTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['feedback', 'score', 'aiAgentState', 'nextQuestionPrompt']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error processing interview answer:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process answer' });
  }
});

// 3. Interview Final Evaluation Report Generator Endpoint
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const { transcript, candidateName, role } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        candidateName: candidateName || 'Alex Rivera',
        role: role || 'Senior Frontend Engineer',
        status: 'SELECT',
        badgeText: 'SELECT - High Potential',
        technicalScore: 9,
        codingScore: 8,
        hrScore: 9,
        durationMinutes: '45m',
        confidence: 'High',
        strengths: [
          'Strong architectural thinking.',
          'Demonstrated excellent understanding of component scalability and state management during the system design phase.'
        ],
        areasForImprovement: [
          'Minor syntax errors in DP coding question. Logic was sound, but required prompting to resolve edge cases in dynamic programming.'
        ],
        summary: 'Alex demonstrated exceptional mastery of frontend system architecture, React internals, and performance optimization.'
      });
    }

    const ai = getGenAI();
    const prompt = `Generate a comprehensive final interview evaluation report for candidate ${candidateName || 'Alex Rivera'}, applying for ${role || 'Senior Frontend Engineer'}.
Transcript & Answers:
${JSON.stringify(transcript || [])}

Return structured evaluation scores and report summary in JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING },
            role: { type: Type.STRING },
            status: { type: Type.STRING, description: 'SELECT, REJECT, or REVIEW' },
            badgeText: { type: Type.STRING },
            technicalScore: { type: Type.INTEGER },
            codingScore: { type: Type.INTEGER },
            hrScore: { type: Type.INTEGER },
            durationMinutes: { type: Type.STRING },
            confidence: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ['candidateName', 'role', 'status', 'badgeText', 'technicalScore', 'codingScore', 'hrScore', 'durationMinutes', 'confidence', 'strengths', 'areasForImprovement', 'summary']
        }
      }
    });

    const report = JSON.parse(response.text || '{}');
    return res.json(report);
  } catch (error: any) {
    console.error('Error generating evaluation report:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate evaluation report' });
  }
});

// ---------------- SERVER INITIALIZATION ----------------

async function startServer() {
  // Vite middleware setup in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TalentAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
