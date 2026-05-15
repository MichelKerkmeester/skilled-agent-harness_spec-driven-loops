// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Feedback Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for ccc_feedback — accepts search result quality feedback.

import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import * as graphDb from '../lib/code-graph-db.js';
import { probeCocoIndexReadiness } from '../lib/ccc-readiness-probe.js';

export interface FeedbackArgs {
  query: string;
  resultFile?: string;
  rating: 'helpful' | 'not_helpful' | 'partial';
  comment?: string;
}

/** Handle ccc_feedback tool call */
export async function handleCccFeedback(args: FeedbackArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.query || !args.rating) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: 'Missing required fields: query, rating',
          }),
        }],
      };
    }

    const validRatings = ['helpful', 'not_helpful', 'partial'] as const;
    if (!validRatings.includes(args.rating)) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: `Invalid rating: "${args.rating}". Must be one of: ${validRatings.join(', ')}`,
          }),
        }],
      };
    }

    const projectRoot = process.cwd();
    const feedbackPath = resolve(projectRoot, '.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl');

    // Ensure feedback directory exists
    mkdirSync(dirname(feedbackPath), { recursive: true });

    const entry = {
      timestamp: new Date().toISOString(),
      query: args.query,
      resultFile: args.resultFile ?? null,
      rating: args.rating,
      comment: args.comment ?? null,
    };
    const readiness = await probeCocoIndexReadiness(projectRoot);
    const lastPersistedAt = graphDb.getStats().lastScanTimestamp;

    try {
      appendFileSync(feedbackPath, JSON.stringify(entry) + '\n', 'utf-8');
    } catch (writeErr: unknown) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: `Failed to write feedback: ${writeErr instanceof Error ? writeErr.message : String(writeErr)}`,
          }),
        }],
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            recorded: true,
            feedbackFile: feedbackPath,
            entry,
            readiness,
            canonicalReadiness: readiness.canonicalReadiness,
            trustState: readiness.trustState,
            lastPersistedAt,
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `ccc_feedback failed: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}
