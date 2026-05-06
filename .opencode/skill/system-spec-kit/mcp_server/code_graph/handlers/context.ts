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
    // ── Q-OPP / packet 015 — CocoIndex fork telemetry passthrough ──
    // Both snake_case (wire) and camelCase (internal) variants accepted.
    // Normalized to camelCase by the CocoIndex seed branch below before
    // delegating to seed-resolver. Pure metadata — never alters scoring.
    rawScore?: number;
    raw_score?: number;
    pathClass?: string;
    path_class?: string;
    rankingSignals?: string[];
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
  // Packet 016 / F-001: a crashed readiness probe (`freshness: 'error'`) MUST
  // also block before `buildContext()` so the degraded envelope preserves
  // canonical readiness/trustState and emits an `rg` recovery signal — the
  // same shape that `code_graph_query` already ships via `fallbackDecision`.
  // Falling through to `buildContext()` on a crashed probe loses the
  // structured envelope and downgrades the response to a generic 'error'.
  if (readiness.freshness === 'error') {
    return true;
  }
  return readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true;
}

function seedProvider(seed: NonNullable<ContextHandlerArgs['seeds']>[number]): string | undefined {
  return seed.provider ?? (typeof seed.file_path === 'string' ? 'cocoindex' : undefined);
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
  // Packet 016 / F-001: mirror `code_graph_query.buildFallbackDecision` shape
  // so callers see ONE shared recovery vocabulary across all three handlers.
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

  if (readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true) {
    return {
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
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
      // PR 4 / F71 step 5: surface as canonical 'error' freshness so
      // buildReadinessBlock() maps it to canonicalReadiness='missing' +
      // trustState='unavailable' automatically. Removes the manual
      // trustState injection that previously lived at the response site.
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
      // Packet 016 / F-001: differentiate the crash-on-probe envelope from
      // the standard full_scan-required envelope so operators see WHY graph
      // answers were omitted. The `rg` fallback is the same recovery the
      // query handler already ships; this aligns the three handlers on one
      // shared degraded-readiness vocabulary (see decision-record.md ADR-001).
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
              // F-007: surface scope + manifest diagnostics
              // directly on the blocked payload's `data` object
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
      const cocoindexFile = seedFilePath(seed);

      if (provider === 'cocoindex' && cocoindexFile) {
        // ── Q-OPP / packet 015 — wire-name normalization for CocoIndex fork ──
        // Fork emits snake_case (`raw_score`, `path_class`); internal
        // ArtifactRef + downstream code uses camelCase. Accept both, prefer
        // camelCase if both are present (camelCase = explicit caller intent).
        // Pure passthrough — no scoring / ordering change.
        const rawScore = typeof seed.rawScore === 'number'
          ? seed.rawScore
          : (typeof seed.raw_score === 'number' ? seed.raw_score : undefined);
        const pathClass = typeof seed.pathClass === 'string' && seed.pathClass.length > 0
          ? seed.pathClass
          : (typeof seed.path_class === 'string' && seed.path_class.length > 0 ? seed.path_class : undefined);
        const rankingSignals = Array.isArray(seed.rankingSignals)
          ? seed.rankingSignals
          : undefined;

        const rangeStart = seedStartLine(seed) ?? 1;
        const rangeEnd = seedEndLine(seed) ?? rangeStart;
        const cocoSeed: Record<string, unknown> = {
          provider: 'cocoindex' as const,
          file: cocoindexFile,
          range: { start: rangeStart, end: rangeEnd },
          score: seed.score ?? 0,
          snippet: seed.snippet ?? seed.content,
          source,
        };
        if (rawScore !== undefined) cocoSeed.rawScore = rawScore;
        if (pathClass !== undefined) cocoSeed.pathClass = pathClass;
        if (rankingSignals !== undefined) cocoSeed.rankingSignals = rankingSignals;
        return cocoSeed;
      }

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

    const result = buildContext(contextArgs);
    // PR 4 / F71 step 5: trustState is now derived canonically by
    // buildReadinessBlock() through the V2-widened freshness union
    // ('error' → trustState 'unavailable'). No manual injection needed.
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
              // ── Q-OPP / packet 015 — CocoIndex fork telemetry passthrough ──
              // Emit rawScore / pathClass / rankingSignals ONLY when the
              // resolved anchor carries them (i.e., when the upstream seed
              // was a CocoIndex seed with fork telemetry). Omit absent
              // fields entirely; never serialize null placeholders. This
              // preserves backward compatibility for callers that never
              // sent telemetry. Additive metadata — no scoring change.
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
              if (typeof a.rawScore === 'number') anchor.rawScore = a.rawScore;
              if (typeof a.pathClass === 'string' && a.pathClass.length > 0) anchor.pathClass = a.pathClass;
              if (Array.isArray(a.rankingSignals)) anchor.rankingSignals = a.rankingSignals;
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
