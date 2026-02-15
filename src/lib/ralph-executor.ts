import { spawn } from 'child_process';
import fs from 'fs/promises';
import { RalphProcessStatus } from './types';

const PID_FILE = '/tmp/ralph.pid';
const PROGRESS_FILE = process.env.PROGRESS_FILE_PATH || '/home/ubuntu/workspace/ralph/scripts/ralph/progress.txt';

/**
 * Start Ralph agent
 */
export async function startRalph(
  tool: 'amp' | 'claude' = 'claude',
  maxIterations: number = 10
): Promise<number> {
  // Check if already running
  const existingStatus = await getRalphStatus();
  if (existingStatus.isRunning) {
    throw new Error('Ralph is already running');
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [
      './scripts/ralph/ralph.sh',
      '--tool', tool,
      String(maxIterations)
    ], {
      cwd: '/home/ubuntu/workspace/ralph',
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Store PID for management
    const pid = proc.pid;
    if (!pid) {
      reject(new Error('Failed to get process ID'));
      return;
    }

    fs.writeFile(PID_FILE, String(pid))
      .then(() => resolve(pid))
      .catch(err => {
        console.error('Failed to write PID file:', err);
        reject(err);
      });

    // Unref to allow parent to exit
    proc.unref();

    // Handle process events
    proc.on('error', (err) => {
      console.error('Failed to start Ralph process:', err);
      reject(err);
    });

    proc.on('exit', (code) => {
      console.log(`Ralph process exited with code ${code}`);
      // Clean up PID file
      fs.unlink(PID_FILE).catch(() => {});
    });
  });
}

/**
 * Stop Ralph agent
 */
export async function stopRalph(): Promise<void> {
  const status = await getRalphStatus();

  if (!status.isRunning || !status.pid) {
    throw new Error('Ralph is not running');
  }

  const pid = status.pid;

  return new Promise((resolve, reject) => {
    try {
      // Kill the process group
      process.kill(-pid, 'SIGTERM');

      // Clean up PID file
      fs.unlink(PID_FILE)
        .then(() => resolve())
        .catch(() => resolve());
    } catch (err) {
      // If process doesn't exist, just clean up PID file
      fs.unlink(PID_FILE).catch(() => {});
      reject(err);
    }
  });
}

/**
 * Get Ralph process status
 */
export async function getRalphStatus(): Promise<RalphProcessStatus> {
  try {
    const pidContent = await fs.readFile(PID_FILE, 'utf-8');
    const pid = parseInt(pidContent.trim(), 10);

    if (isNaN(pid)) {
      return { isRunning: false };
    }

    // Check if process is running
    try {
      process.kill(pid, 0); // Signal 0 checks if process exists

      // Read progress file for more details
      const progressContent = await readProgressFile();
      const lines = progressContent.split('\n');

      // Try to extract iteration info from progress
      const currentIteration = extractIteration(lines);
      const tool = extractTool(lines);

      return {
        isRunning: true,
        pid,
        currentIteration,
        maxIterations: 10,
        tool,
        startTime: undefined
      };
    } catch {
      // Process doesn't exist, clean up PID file
      fs.unlink(PID_FILE).catch(() => {});
      return { isRunning: false };
    }
  } catch {
    return { isRunning: false };
  }
}

/**
 * Read progress file content
 */
export async function readProgressFile(): Promise<string> {
  try {
    return await fs.readFile(PROGRESS_FILE, 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Extract current iteration from progress lines
 */
function extractIteration(lines: string[]): number | undefined {
  for (const line of lines) {
    const match = line.match(/Iteration[:\s]+(\d+)/i);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return undefined;
}

/**
 * Extract tool type from progress lines
 */
function extractTool(lines: string[]): 'amp' | 'claude' | undefined {
  for (const line of lines) {
    if (line.toLowerCase().includes('claude')) return 'claude';
    if (line.toLowerCase().includes('amp')) return 'amp';
  }
  return undefined;
}

/**
 * Parse progress file for structured data
 */
export interface ProgressEntry {
  timestamp: string;
  type: 'iteration' | 'task' | 'error' | 'info';
  content: string;
}

export async function parseProgressFile(): Promise<ProgressEntry[]> {
  const content = await readProgressFile();
  const lines = content.split('\n').filter(l => l.trim());

  return lines.map(line => {
    // Try to extract timestamp
    const timestampMatch = line.match(/\[?(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2})\]?/);
    const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString();

    // Determine type
    let type: ProgressEntry['type'] = 'info';
    if (line.toLowerCase().includes('iteration')) type = 'iteration';
    if (line.toLowerCase().includes('error')) type = 'error';
    if (line.toLowerCase().includes('task')) type = 'task';

    return {
      timestamp,
      type,
      content: line
    };
  });
}
