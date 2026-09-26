import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { JevDeps } from '../../application/ask.js';
import { pickOption } from '../../application/pick-option.js';
import { formatDecision } from '../format.js';
import { respond } from '../respond.js';
import { sourcesSchema } from '../schemas.js';

const DESCRIPTION = `Have Jev compare 2-6 implementation options against the code they would live in. Jev answers three separate questions — which option best satisfies the stated requirement, which is least likely to break existing behavior, which adds the least machinery — each as a probability distribution over your labels with confidence, plus a risk score per option.

Use it while planning, or whenever you are choosing between approaches and want the trade-off made visible instead of asserted. When the three answers disagree, that disagreement is the finding.`;

const optionSchema = z.object({
  label: z.string().min(1).describe('Short name for the option'),
  summary: z.string().min(1).describe('What this option does, in one or two sentences'),
});

export function registerPick(server: McpServer, deps: JevDeps): void {
  server.registerTool(
    'jev_pick_option',
    {
      title: 'Compare options with Jev',
      description: DESCRIPTION,
      inputSchema: {
        question: z.string().min(1).describe('What is being decided, in one sentence'),
        requirement: z.string().min(1).describe('The requirement the winning option has to satisfy'),
        options: z.array(optionSchema).min(2).max(6),
        sources: sourcesSchema,
      },
    },
    (args) =>
      respond(async () => {
        const result = await pickOption(deps, {
          decision: {
            question: args.question,
            requirement: args.requirement,
            options: args.options,
          },
          sources: args.sources,
        });
        return formatDecision(result, result);
      }),
  );
}
