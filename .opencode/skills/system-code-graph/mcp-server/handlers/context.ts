// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.

import { buildContext, type ContextArgs, type QueryMode } from '../lib/code-graph-context.js';
import type { CodeGraphSeed } from '../lib/seed-resolver.js';
import { ensureCodeGraphReady, type ReadyResult } from '../lib/ensure-ready.js';
import * as graphDb from '../lib/code-graph-db.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';

export interface ContextHandlerArgs {
  input?: string;
  queryMode?: string;
  subject?: string;
  seeds?: Array<{
    filePath?: string;
    file_path?: string;
    startLine?: number;
    start_line?: number;
    endLine?: number;
    end_line?: number;
    query?: string;
    provider?: string;
    source?: string;
    file?: string;
    range?: { start: number; end: number };
    lines?: { start?: number; end?: number };
    score?: number;
    snippet?: string;
    content?: string;
    symbolName?: string;
    kind?: string;
    nodeId?: string;
    symbolId?: string;
  }>;
  budgetTokens?: number;
  profile?: string;
  includeTrace?: boolean;
}

interface NormalizedSeedSource {
  source?: string;
  filePath: string;
  startLine?: number;
  endLine?: number;
  symbolId?: string;
  symbolName?: string;
}

type ContextReadiness = ReadyResult & { error?: string };

interface ContextFallbackDecision {
  nextTool: 'rg' | 'code_graph_scan';
  reason: string;
}

function shouldBlockReadPath(readiness: ReadyResult): boolean {
  // A crashed readiness probe (`freshness: 'error'`) MUST also block before
  // `buildContext()` so the degraded envelope preserves canonical
  // readiness/trustState and emits an `rg` recovery signal — the same shape
  // that `code_graph_query` already ships via `fallbackDecision`.
  // Falling through to `buildContext()` on a crashed probe loses the
  // structured envelope and downgrades the response to a generic 'error'.
  if (readiness.freshness === 'error') {
    return true;
  }
  // False-safe contract: block on ANY non-fresh graph, not just
  // `action === 'full_scan'`. A deleted-files-only `freshness:'stale', action:'none'`
  // result and a FAILED inline selective_reindex both previously fell through
  // to buildContext() and answered over a stale graph. Gate on freshness and a
  // failed gold-verification gate, matching query.ts + detect_changes.
  return readiness.freshness !== 'fresh' || readiness.verificationGate === 'fail';
}

function seedProvider(seed: NonNullable<ContextHandlerArgs['seeds']>[number]): string | undefined {
  return seed.provider;
}

function seedFilePath(seed: NonNullable<ContextHandlerArgs['seeds']>[number]): string {
  return seed.file ?? seed.filePath ?? seed.file_path ?? '';
}

function seedStartLine(seed: NonNullable<ContextHandlerArgs['seeds']>[number]): number | undefined {
  return seed.range?.start ?? seed.lines?.start ?? seed.startLine ?? seed.start_line;
}

function seedEndLine(seed: NonNullable<ContextHandlerArgs['seeds']>[number]): number | undefined {
  return seed.range?.end ?? seed.lines?.end ?? seed.endLine ?? seed.end_line ?? seedStartLine(seed);
}

function buildContextFallbackDecision(readiness: ContextReadiness): ContextFallbackDecision | null {
  // Mirror `code_graph_query.buildFallbackDecision` shape so callers see ONE
  // shared recovery vocabulary across all three handlers.
  // - readiness crash (`freshness: 'error'`) → fall back to `rg`
  // - full_scan required (no inline performed) → run `code_graph_scan`
  if (readiness.freshness === 'error') {
    return {
      nextTool: 'rg',
      reason: typeof readiness.error === 'string' && readiness.error.length > 0
        ? `readiness_check_crashed: ${readiness.error}`
        : 'readiness_check_crashed',
    };
  }

  if (readiness.freshness !== 'fresh') {
    return {
      nextTool: 'code_graph_scan',
      reason: readiness.action === 'selective_reindex' ? 'selective_reindex' : 'full_scan_required',
    };
  }

  return null;
}

function resolveDeadlineMs(profile: ContextArgs['profile']): number {
  switch (profile) {
    case 'quick':
      return 250;
    case 'debug':
      return 700;
    case 'research':
      return 900;
    default:
      return 400;
  }
}

function resolveSeedSource(args: ContextHandlerArgs, anchor: {
  filePath: string;
  startLine: number;
  endLine: number;
  symbolId: string | null;
  fqName: string | null;
}): string | undefined {
  const normalizedSeeds: NormalizedSeedSource[] = (args.seeds ?? []).map((seed) => ({
    source: typeof seed.source === 'string' && seed.source.trim().length > 0
      ? seed.source
      : seedProvider(seed),
    filePath: seedFilePath(seed),
    startLine: seedStartLine(seed),
    endLine: seedEndLine(seed),
    symbolId: seed.symbolId,
    symbolName: seed.symbolName,
  }));

  const match = normalizedSeeds.find((seed) => {
    if (seed.symbolId && anchor.symbolId) {
      return seed.symbolId === anchor.symbolId;
    }
    if (seed.symbolName && anchor.fqName) {
      return seed.symbolName === anchor.fqName || anchor.fqName.endsWith(`.${seed.symbolName}`);
    }
    if (seed.filePath !== anchor.filePath) {
      return false;
    }
    if (typeof seed.startLine === 'number' && seed.startLine !== anchor.startLine) {
      return false;
    }
    if (typeof seed.endLine === 'number' && seed.endLine !== anchor.endLine) {
      return false;
    }
    return true;
  });

  return match?.source;
}

/** Handle code_graph_context tool call */
export async function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  let readiness: ContextReadiness = {
    freshness: 'empty' as const,
    action: 'none' as const,
    inlineIndexPerformed: false,
    reason: 'readiness check not run',
  };

  try {
    // Auto-trigger: ensure graph is fresh before querying
    try {
      readiness = await ensureCodeGraphReady(process.cwd(), {
        allowInlineIndex: true,
        allowInlineFullScan: false,
        allowGuardedInlineFullScan: true,
      });
    } catch (err: unknown) {
      // Surface as canonical 'error' freshness so buildReadinessBlock() maps
      // it to canonicalReadiness='missing' + trustState='unavailable'
      // automatically. Removes the manual trustState injection that previously
      // lived at the response site.
      readiness = {
        freshness: 'error' as const,
        action: 'none' as const,
        inlineIndexPerformed: false,
        reason: 'readiness_check_crashed',
        error: err instanceof Error ? err.message : String(err),
      };
    }

    if (shouldBlockReadPath(readiness)) {
      const readinessBlock = buildReadinessBlock(readiness);
      const fallbackDecision = buildContextFallbackDecision(readiness);
      // Differentiate the crash-on-probe envelope from the standard
      // full_scan-required envelope so operators see WHY graph answers were
      // omitted. The `rg` fallback is the same recovery the query handler
      // already ships; this aligns the three handlers on one shared
      // degraded-readiness vocabulary.
      const isCrash = readiness.freshness === 'error';
      const message = isCrash
        ? `code_graph_not_ready: ${readiness.reason}`
        : `code_graph_full_scan_required: ${readiness.reason}`;
      const requiredAction = isCrash ? 'rg' : 'code_graph_scan';
      const blockReason = isCrash ? 'readiness_check_crashed' : 'full_scan_required';

      // graphDb.getStats() can throw if the DB itself is unavailable. Isolate
      // the call so the degraded envelope still ships even when stats fail.
      let lastPersistedAt: string | null = null;
      try {
        lastPersistedAt = graphDb.getStats().lastScanTimestamp;
      } catch {
        lastPersistedAt = null;
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'blocked',
            message,
            data: {
              queryMode: args.queryMode ?? 'neighborhood',
              blocked: true,
              degraded: true,
              graphAnswersOmitted: true,
              requiredAction,
              blockReason,
              // Surface scope + manifest diagnostics directly on
              // the blocked payload's `data` object
              // so operators can route on them without parsing
              // `data.readiness`. Backward compatible: legacy
              // callers reading `status` + `data.blockReason`
              // continue to work; nested `data.readiness` still
              // carries the same fields.
              reason: readiness.reason,
              activeScope: readiness.activeScope ?? null,
              storedScope: readiness.storedScope ?? null,
              manifestCount: readiness.manifestCount ?? null,
              manifestDigest: readiness.manifestDigest ?? null,
              readiness: readinessBlock,
              canonicalReadiness: readinessBlock.canonicalReadiness,
              trustState: readinessBlock.trustState,
              ...(fallbackDecision ? { fallbackDecision } : {}),
              lastPersistedAt,
            },
          }, null, 2),
        }],
      };
    }

    const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
      ? args.queryMode as QueryMode
      : 'neighborhood');

    const seeds = (args.seeds ?? []).map((seed) => {
      const source = typeof seed.source === 'string' && seed.source.trim().length > 0
        ? seed.source
        : seedProvider(seed);
      const provider = seedProvider(seed);

      if (provider === 'manual' && seed.symbolName) {
        return {
          provider: 'manual' as const,
          symbolName: seed.symbolName,
          filePath: seed.filePath,
          kind: seed.kind,
          source,
        };
      }

      if (provider === 'graph' && seed.symbolId) {
        return {
          provider: 'graph' as const,
          nodeId: seed.nodeId ?? seed.symbolId,
          symbolId: seed.symbolId,
          source,
        };
      }

      return {
        filePath: seedFilePath(seed),
        startLine: seedStartLine(seed),
        endLine: seedEndLine(seed),
        query: seed.query,
        source,
      };
    }) as unknown as CodeGraphSeed[];

    const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];
    const deadlineMs = resolveDeadlineMs(profile);

    const contextArgs: ContextArgs = {
      input: args.input,
      queryMode,
      subject: args.subject,
      seeds,
      budgetTokens: args.budgetTokens ?? 1200,
      deadlineMs,
      profile,
      includeTrace: args.includeTrace,
    };

    const result = await buildContext(contextArgs);
    // trustState is now derived canonically by buildReadinessBlock() through
    // the widened freshness union ('error' → trustState 'unavailable'). No
    // manual injection needed.
    const readinessBlock = buildReadinessBlock(readiness);
    const lastPersistedAt = graphDb.getStats().lastScanTimestamp;

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            queryMode: result.queryMode,
            combinedSummary: result.combinedSummary,
            nextActions: result.nextActions,
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            lastPersistedAt,
            anchors: result.resolvedAnchors.map(a => {
              const anchor: Record<string, unknown> = {
                file: a.filePath,
                line: a.startLine,
                symbol: a.fqName,
                resolution: a.resolution,
                confidence: a.confidence,
                source: resolveSeedSource(args, a) ?? a.source,
                provider: a.provider,
                score: a.score,
                snippet: a.snippet,
                range: a.range,
              };
              return anchor;
            }),
            graphContext: result.graphContext,
            textBrief: result.textBrief,
            metadata: result.metadata,
            graphMetadata: {
              detectorProvenance: graphDb.getLastDetectorProvenance() ?? 'unknown',
            },
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    console.error('[code-graph-context] Unexpected failure:', err);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: 'code_graph_context failed',
        }),
      }],
    };
  }
}
