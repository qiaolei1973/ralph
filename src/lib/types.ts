// User Story structure matching prd.json format
export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: number;
  passes: boolean;
  notes: string;
}

// PRD structure matching prd.json format
export interface PRD {
  project: string;
  branchName: string;
  description: string;
  userStories: UserStory[];
}

// Chat message for Claude interaction
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// Log entry for streaming
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

// Ralph process status
export interface RalphProcessStatus {
  isRunning: boolean;
  pid?: number;
  currentIteration?: number;
  maxIterations?: number;
  tool?: 'amp' | 'claude';
  startTime?: string;
}
