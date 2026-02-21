// ---------------------------------------------------------------
// MODULE: SGQS Query Handler
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

import * as path from 'path';

import { DEFAULT_BASE_PATH } from '../core';
import { skillGraphCache } from '../lib/search/skill-graph-cache';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

/** Maximum query string length to prevent abuse / accidental huge payloads. */
const MAX_QUERY_LENGTH = 4096;

export interface SgqsQueryArgs {
  queryString: string;
}

/* ---------------------------------------------------------------
   3. HANDLER
--------------------------------------------------------------- */

export async function handleMemorySkillGraphQuery(args: SgqsQueryArgs) {
  try {
    if (args.queryString.length > MAX_QUERY_LENGTH) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ error: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters` }, null, 2)
        }],
        isError: true
      };
    }

    // Dynamic require to bypass TS rootDir restrictions between workspaces
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sgqs = require('../../scripts/dist/sgqs/index.js');

    const skillRoot = path.join(DEFAULT_BASE_PATH, '.opencode', 'skill');

    // Use cached graph instead of rebuilding on every query (P1-8 fix)
    const graph = await skillGraphCache.get(skillRoot);
    const tokens = sgqs.tokenize(args.queryString);
    const ast = sgqs.parse(tokens);
    const result = sgqs.execute(ast, graph);

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          columns: result.columns,
          rows: result.rows,
          errors: result.errors,
          rowCount: result.rows.length
        }, null, 2)
      }]
    };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ error: err.message }, null, 2)
      }],
      isError: true
    };
  }
}
