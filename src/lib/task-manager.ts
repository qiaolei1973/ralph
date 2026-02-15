import fs from 'fs/promises';
import path from 'path';
import { PRD, UserStory } from './types';

// Get project root directory (works both in dev and production)
const PROJECT_ROOT = process.cwd();
const PRD_PATH = process.env.PRD_FILE_PATH || path.join(PROJECT_ROOT, 'prd.json');

/**
 * Load PRD from file
 */
export async function loadPRD(): Promise<PRD> {
  const content = await fs.readFile(PRD_PATH, 'utf-8');
  return JSON.parse(content) as PRD;
}

/**
 * Save PRD to file with atomic write
 */
export async function savePRD(prd: PRD): Promise<void> {
  const tmpPath = PRD_PATH + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(prd, null, 2), 'utf-8');
  await fs.rename(tmpPath, PRD_PATH);
}

/**
 * Get all user stories from PRD
 */
export async function getTasks(): Promise<UserStory[]> {
  const prd = await loadPRD();
  return prd.userStories;
}

/**
 * Get a specific user story by ID
 */
export async function getTask(id: string): Promise<UserStory | null> {
  const prd = await loadPRD();
  return prd.userStories.find(story => story.id === id) || null;
}

/**
 * Generate next user story ID (US-XXX)
 */
function generateNextId(existingStories: UserStory[]): string {
  const maxId = existingStories.reduce((max, story) => {
    const match = story.id.match(/US-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);

  const nextNum = maxId + 1;
  return `US-${String(nextNum).padStart(3, '0')}`;
}

/**
 * Create a new user story
 */
export async function createTask(task: Omit<UserStory, 'id'>): Promise<UserStory> {
  const prd = await loadPRD();
  const newId = generateNextId(prd.userStories);

  const newTask: UserStory = {
    id: newId,
    ...task
  };

  prd.userStories.push(newTask);
  await savePRD(prd);

  return newTask;
}

/**
 * Update an existing user story
 */
export async function updateTask(id: string, updates: Partial<UserStory>): Promise<UserStory> {
  const prd = await loadPRD();
  const index = prd.userStories.findIndex(story => story.id === id);

  if (index === -1) {
    throw new Error(`Task with ID ${id} not found`);
  }

  prd.userStories[index] = {
    ...prd.userStories[index],
    ...updates
  };

  await savePRD(prd);
  return prd.userStories[index];
}

/**
 * Delete a user story
 */
export async function deleteTask(id: string): Promise<void> {
  const prd = await loadPRD();
  prd.userStories = prd.userStories.filter(story => story.id !== id);
  await savePRD(prd);
}

/**
 * Toggle task completion status
 */
export async function toggleTaskStatus(id: string): Promise<UserStory> {
  const prd = await loadPRD();
  const task = prd.userStories.find(story => story.id === id);

  if (!task) {
    throw new Error(`Task with ID ${id} not found`);
  }

  task.passes = !task.passes;
  await savePRD(prd);

  return task;
}

/**
 * Get PRD metadata (project info, branch, description)
 */
export async function getPRDMetadata(): Promise<{ project: string; branchName: string; description: string }> {
  const prd = await loadPRD();
  return {
    project: prd.project,
    branchName: prd.branchName,
    description: prd.description
  };
}
