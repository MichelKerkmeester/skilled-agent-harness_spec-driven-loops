import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { JevDeps } from '../../application/ask.js';
import { rankHypotheses } from '../../application/rank-hypotheses.js';
import { formatHypotheses } from '../format.js';
import { respond } from '../respond.js';
import { idSchema, sourcesSchema } from '../schemas.js';

const DESCRIPTION = `Have Jev rank debugging hypotheses against a symptom and the code. For every hypothesis Jev rates whether it would produce the whole symptom rather than part of it, whether the code and evidence shown support it, and which kind of check would settle it most cheaply.

Returns the hypotheses ordered by 0.6 * explains + 0.4 * supported. Use it when a failure has more than one plausible cause, before spending time on the first one that came to mind.`;

const hypothesisSchema = z.object({
  id: idSchema,
  claim: z.string().min(1).describe('One sentence: the cause this hypothesis proposes'),
});

export function registerHypotheses(server: McpServer, deps: JevDeps): void {
  server.registerTool(
    'jev_rank_hypotheses',
    {
      title: 'Rank hypotheses with Jev',
      description: DESCRIPTION,
      inputSchema: {
        symptom: z.string().min(1).describe('The failure as observed'),
        evidence: z.string().optional().describe('Logs, stack traces or measurements already collected'),
        hypotheses: z.array(hypothesisSchema).min(2),
        sources: sourcesSchema,
      },
    },
    (args) =>
      respond(async () => {
        const result = await rankHypotheses(deps, {
          symptom: args.symptom,
          evidence: args.evidence,
          hypotheses: args.hypotheses,
          sources: args.sources,
        });
        return formatHypotheses(result.hypotheses, result);
      }),
  );
}
