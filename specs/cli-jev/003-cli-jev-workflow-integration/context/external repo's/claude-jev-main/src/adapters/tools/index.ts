import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { JevDeps } from '../../application/ask.js';
import { registerAsk } from './ask.js';
import { registerHypotheses } from './hypotheses.js';
import { registerPick } from './pick.js';
import { registerRelevance } from './relevance.js';
import { registerReview } from './review.js';

export function registerJevTools(server: McpServer, deps: JevDeps): void {
  registerAsk(server, deps);
  registerReview(server, deps);
  registerPick(server, deps);
  registerHypotheses(server, deps);
  registerRelevance(server, deps);
}
