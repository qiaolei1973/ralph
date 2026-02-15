import Anthropic from '@anthropic-ai/sdk';
import { PRD, UserStory } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

const SYSTEM_PROMPT = `You are Ralph, an intelligent task management assistant.

Your role:
1. Convert natural language requirements into structured user stories
2. Follow the exact PRD format: id, title, description, acceptanceCriteria, priority, passes, notes
3. Suggest acceptance criteria that are specific and testable
4. Assign priority (1-5, 1=highest)
5. Ask clarifying questions when requirements are ambiguous

Response format:
- Conversational reply to the user
- Optional: Suggested user story in JSON format

When suggesting a user story, format it as:
\`\`\`json
{
  "title": "...",
  "description": "...",
  "acceptanceCriteria": ["...", "..."],
  "priority": 1-5,
  "notes": "..."
}
\`\`\``;

interface ChatResponse {
  reply: string;
  suggestedTask?: UserStory;
}

/**
 * Generate task from chat message using Claude
 */
export async function generateTaskFromChat(
  userMessage: string,
  context: PRD
): Promise<ChatResponse> {
  try {
    // Build context about current project
    const contextInfo = `
Current Project: ${context.project}
Branch: ${context.branchName}
Description: ${context.description}

Existing Tasks: ${context.userStories.length}
Completed: ${context.userStories.filter(t => t.passes).length}
Pending: ${context.userStories.filter(t => !t.passes).length}

User Message: ${userMessage}
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: contextInfo
        }
      ]
    });

    // Extract the text response
    const reply = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Try to extract JSON task suggestion
    let suggestedTask: UserStory | undefined;

    const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const taskData = JSON.parse(jsonMatch[1]);

        // Validate required fields
        if (taskData.title && taskData.description) {
          suggestedTask = {
            id: 'US-XXX', // Will be assigned when created
            title: taskData.title,
            description: taskData.description,
            acceptanceCriteria: taskData.acceptanceCriteria || [],
            priority: taskData.priority ?? 5,
            passes: taskData.passes ?? false,
            notes: taskData.notes ?? ''
          };
        }
      } catch (e) {
        console.error('Failed to parse suggested task:', e);
      }
    }

    return {
      reply: reply.replace(/```json\s*[\s\S]*?\s*```/g, '').trim(),
      suggestedTask
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate response from Claude');
  }
}
