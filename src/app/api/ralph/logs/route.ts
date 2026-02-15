import { NextRequest } from 'next/server';
import { readProgressFile } from '@/lib/ralph-executor';

/**
 * GET /api/ralph/logs - SSE stream for real-time logs
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      let lastContent = '';
      let intervalId: NodeJS.Timeout | null = null;

      const sendEvent = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      const sendHeartbeat = () => {
        controller.enqueue(encoder.encode(': heartbeat\n\n'));
      };

      // Check for updates to progress file
      const checkForUpdates = async () => {
        try {
          const content = await readProgressFile();

          if (content !== lastContent) {
            // Get new lines only
            const newLines = content.slice(lastContent.length).split('\n').filter(l => l.trim());

            for (const line of newLines) {
              // Determine log level
              let level: 'info' | 'warn' | 'error' = 'info';
              const lowerLine = line.toLowerCase();

              if (lowerLine.includes('error') || lowerLine.includes('failed')) {
                level = 'error';
              } else if (lowerLine.includes('warn')) {
                level = 'warn';
              }

              sendEvent({
                timestamp: new Date().toISOString(),
                level,
                message: line
              });
            }

            lastContent = content;
          }
        } catch (error) {
          console.error('Error reading progress file:', error);
        }
      };

      // Initial read
      await checkForUpdates();

      // Set up polling interval (check every 2 seconds)
      intervalId = setInterval(checkForUpdates, 2000);

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(sendHeartbeat, 30000);

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        if (intervalId) clearInterval(intervalId);
        clearInterval(heartbeatInterval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable nginx buffering
    }
  });
}
