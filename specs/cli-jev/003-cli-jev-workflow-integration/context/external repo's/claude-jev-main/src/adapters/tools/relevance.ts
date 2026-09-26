import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { JevDeps } from '../../application/ask.js';
import { filterRelevance } from '../../application/filter-relevance.js';
import { formatRelevance } from '../format.js';
import { respond } from '../respond.js';
import { idSchema } from '../schemas.js';

const DESCRIPTION = `Have Jev decide which candidates are needed to answer a question. Only the head of each file is read, so a long list stays cheap, and the files never pass through your context.

Returns the candidates worth opening, ordered by need, and the ones to skip. Use it right after a broad grep, glob or directory listing, before reading anything in full.`;

const candidateSchema = z.object({
  id: idSchema,
  path: z.string().min(1).optional().describe('File to peek at; its head is read by the server'),
  text: z.string().min(1).optional().describe('Text supplied directly instead of a path'),
  label: z.string().min(1).optional().describe('Name to report back; defaults to the path'),
});

export function registerRelevance(server: McpServer, deps: JevDeps): void {
  server.registerTool(
    'jev_filter_relevance',
    {
      title: 'Filter candidates with Jev',
      description: DESCRIPTION,
      inputSchema: {
        goal: z.string().min(1).describe('The question the surviving candidates have to help answer'),
        candidates: z.array(candidateSchema).min(1),
        headBytes: z
          .number()
          .int()
          .positive()
          .optional()
          .describe('Bytes read from the start of each file; 1500 by default'),
      },
    },
    (args) =>
      respond(async () => {
        const result = await filterRelevance(deps, {
          goal: args.goal,
          candidates: args.candidates,
          headBytes: args.headBytes,
        });
        return formatRelevance(result.kept, result.dropped, result);
      }),
  );
}
