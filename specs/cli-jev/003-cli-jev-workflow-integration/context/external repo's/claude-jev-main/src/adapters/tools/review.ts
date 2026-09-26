import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { JevDeps } from '../../application/ask.js';
import { reviewFindings } from '../../application/review-findings.js';
import { formatReview } from '../format.js';
import { respond } from '../respond.js';
import { idSchema, sourcesSchema } from '../schemas.js';

const DESCRIPTION = `Have Jev judge candidate code-review findings before you report them. For every finding Jev rates whether the defect is really present in the code shown, whether a caller can reach it, whether an existing guard already covers it, and how bad the worst consequence would be.

Returns a keep / keep_low / drop verdict per finding with the probabilities behind it, worst consequence first. Run it on your own candidate findings before presenting a review, and report only what survives, naming the numbers.`;

const findingSchema = z.object({
  id: idSchema,
  file: z.string().min(1),
  line: z.number().int().positive().optional(),
  claim: z.string().min(1).describe('One sentence naming the defect'),
  failure: z.string().min(1).describe('Concrete inputs or state leading to the wrong result'),
});

export function registerReview(server: McpServer, deps: JevDeps): void {
  server.registerTool(
    'jev_review_findings',
    {
      title: 'Filter review findings with Jev',
      description: DESCRIPTION,
      inputSchema: {
        findings: z.array(findingSchema).min(1),
        sources: sourcesSchema,
        intent: z.string().optional().describe('What the change under review is meant to do'),
      },
    },
    (args) =>
      respond(async () => {
        const result = await reviewFindings(deps, {
          findings: args.findings,
          sources: args.sources,
          intent: args.intent,
        });
        return formatReview(result.judgements, result);
      }),
  );
}
