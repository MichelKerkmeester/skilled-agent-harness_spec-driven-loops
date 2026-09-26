import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { askJev, type JevDeps } from '../../application/ask.js';
import { formatAnswers } from '../format.js';
import { respond } from '../respond.js';
import { questionsSchema, sourcesSchema, stateSchema } from '../schemas.js';

const DESCRIPTION = `Ask Jev (TypeSafe System One) your own typed questions about code or text. Jev judges, it never writes: a "noul" question returns the probability that the answer is yes, "choice" returns a distribution over your labels plus confidence, "score" returns a weighted position on your ordered levels plus confidence.

Use it at any point where a second, calibrated judgement helps and no other jev_* tool fits: is this invariant actually held, does this refactor preserve behavior, is this error message reachable, which of these two readings of the spec matches the code.

Write each question as one literal judgement in English and put boundary cases in the criteria. Never ask Jev to count, do arithmetic, compare dates, or produce text.`;

export function registerAsk(server: McpServer, deps: JevDeps): void {
  server.registerTool(
    'jev_ask',
    {
      title: 'Ask Jev a typed question',
      description: DESCRIPTION,
      inputSchema: {
        state: stateSchema.optional().describe('Text or JSON to evaluate; combine with sources or use either alone'),
        sources: sourcesSchema.optional(),
        questions: questionsSchema,
      },
    },
    (args) =>
      respond(async () => {
        const result = await askJev(deps, {
          state: args.state,
          sources: args.sources,
          questions: args.questions,
        });
        return formatAnswers(result.answers, result);
      }),
  );
}
