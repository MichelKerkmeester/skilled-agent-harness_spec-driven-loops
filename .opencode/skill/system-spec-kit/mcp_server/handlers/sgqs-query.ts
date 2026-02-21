// ------- MODULE: SGQS Query Handler -------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

import * as path from 'path';

import { DEFAULT_BASE_PATH } from '../core';
import { skillGraphCache } from '../lib/search/skill-graph-cache';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

/** Maximum query string length to prevent abuse / accidental huge payloads. */
const MAX_QUERY_LENGTH = 4096;

/** Arguments for the SGQS (Skill Graph Query System) handler. */
export interface SgqsQueryArgs {
  queryString: string;
}

/** Arguments for the skill graph cache invalidation handler. */
export type SgqsInvalidateArgs = Record<string, never>;

/* ---------------------------------------------------------------
   3. HANDLER
--------------------------------------------------------------- */

/** Handle memory_skill_graph_invalidate tool -- force-clears the cached skill graph so the next query rebuilds it. */
export async function handleMemorySkillGraphInvalidate(_args: SgqsInvalidateArgs): Promise<{ content: { type: 'text'; text: string }[]; isError?: boolean }> {
  const startTime = Date.now();
  try {
    const wasWarm = skillGraphCache.isWarm();
    skillGraphCache.invalidate();

    return createMCPSuccessResponse({
      tool: 'memory_skill_graph_invalidate',
      summary: wasWarm
        ? 'Skill graph cache invalidated (was warm, next query will rebuild)'
        : 'Skill graph cache invalidated (was already cold)',
      data: { invalidated: true, wasWarm },
      startTime,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return createMCPErrorResponse({
      tool: 'memory_skill_graph_invalidate',
      error: message,
      startTime,
    });
  }
}

/** Handle memory_skill_graph_query tool -- executes SGQS queries against the cached skill graph. */
export async function handleMemorySkillGraphQuery(args: SgqsQueryArgs): Promise<{ content: { type: 'text'; text: string }[]; isError?: boolean }> {
  const startTime = Date.now();
  try {
    if (args.queryString.length > MAX_QUERY_LENGTH) {
      return createMCPErrorResponse({
        tool: 'memory_skill_graph_query',
        error: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`,
        startTime,
      });
    }

    // Dynamic import to bypass TS rootDir restrictions between workspaces
    const sgqs = await import('../../scripts/dist/sgqs/index.js');

    const skillRoot = path.join(DEFAULT_BASE_PATH, '.opencode', 'skill');

    // T046: Use cached graph instead of rebuilding on every query
    const graph = await skillGraphCache.get(skillRoot);
    const tokens = sgqs.tokenize(args.queryString);
    const ast = sgqs.parse(tokens);
    const result = sgqs.execute(ast, graph);

    return createMCPSuccessResponse({
      tool: 'memory_skill_graph_query',
      summary: `SGQS query returned ${result.rows.length} row(s)`,
      data: {
        columns: result.columns,
        rows: result.rows,
        errors: result.errors,
        rowCount: result.rows.length,
      },
      startTime,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return createMCPErrorResponse({
      tool: 'memory_skill_graph_query',
      error: message,
      startTime,
    });
  }
}
