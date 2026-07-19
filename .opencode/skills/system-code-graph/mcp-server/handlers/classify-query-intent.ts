// ----------------------------------------------------------------
// MODULE: Query Intent Classification Handler
// ----------------------------------------------------------------
// MCP tool handler for code_graph_classify_query_intent.

import { classifyQueryIntent } from '../lib/query-intent-classifier.js';

export interface ClassifyQueryIntentArgs {
  query: string;
}

export async function handleClassifyQueryIntent(
  args: ClassifyQueryIntentArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const query = typeof args.query === 'string' ? args.query : '';
  const classification = classifyQueryIntent(query);
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'ok',
        data: classification,
      }, null, 2),
    }],
  };
}
