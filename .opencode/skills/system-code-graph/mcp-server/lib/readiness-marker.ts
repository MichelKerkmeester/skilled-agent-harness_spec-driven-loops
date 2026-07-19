// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Readiness Marker
// ───────────────────────────────────────────────────────────────
// Publishes a file-based readiness snapshot for startup-critical spec-kit
// consumers without in-process imports.

import { mkdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import path, { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStats, queryStartupHighlights } from './code-graph-db.js';
import { getGraphReadinessSnapshot } from './ensure-ready.js';
import type {
  CodeGraphReadinessMarker,
  CodeGraphStatsSnapshot,
  StartupBriefResult,
  StartupGraphQualitySummary,
} from './shared/code-graph-contracts.js';

// Anchor the marker to the same skill-local DB location as core/config.ts DATABASE_DIR so the
// readiness snapshot always lands beside the SQLite DB, independent of the process CWD. We derive
// the workspace root from THIS file's own path (mirroring core/config.ts resolveWorkspaceRoot)
// rather than importing DATABASE_DIR directly: that import would run resolveCanonicalDbDir at module
// load (mkdirSync + realpathSync.native), which breaks consumers that mock node:fs without those.
// The walk below touches no fs APIs, so it is safe under those mocks. An absolute
// SPECKIT_CODE_GRAPH_DB_DIR still wins because resolve() ignores its base when the second arg is absolute.
function resolveMarkerWorkspaceRoot(): string {
  const fromUrl = (() => {
    try {
      return dirname(fileURLToPath(import.meta.url));
    } catch {
      return process.cwd();
    }
  })();
  let current = fromUrl;
  for (let i = 0; i < 12; i++) {
    if (basename(current) === '.opencode') {
      return dirname(current);
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

export const CODE_GRAPH_READINESS_MARKER_BASE_DIR = resolve(
  resolveMarkerWorkspaceRoot(),
  process.env.SPECKIT_CODE_GRAPH_DB_DIR || '.opencode/skills/system-code-graph/mcp-server/database',
);
export const CODE_GRAPH_READINESS_MARKER_PATH = resolve(CODE_GRAPH_READINESS_MARKER_BASE_DIR, '.code-graph-readiness.json');

export function validateMarkerPath(resolved: string, baseDir: string): void {
  const normalizedResolved = path.resolve(resolved);
  const normalizedBase = path.resolve(baseDir);
  if (!normalizedResolved.startsWith(normalizedBase + path.sep) && normalizedResolved !== normalizedBase) {
    throw new Error(`Marker path traversal rejected: ${resolved} outside ${baseDir}`);
  }
}

export function writeMarkerFileAtomic(
  markerPath: string,
  content: string,
  baseDir: string = CODE_GRAPH_READINESS_MARKER_BASE_DIR,
): boolean {
  try {
    validateMarkerPath(markerPath, baseDir);
    mkdirSync(dirname(markerPath), { recursive: true });
    const tmpPath = `${markerPath}.tmp.${process.pid}`;
    try {
      writeFileSync(tmpPath, content);
      renameSync(tmpPath, markerPath);
      return true;
    } catch (error: unknown) {
      try {
        unlinkSync(tmpPath);
      } catch {
        // Best-effort cleanup for failed atomic marker writes.
      }
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[code-graph-readiness] marker write skipped: ${message}`);
      return false;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[code-graph-readiness] ${message}`);
    return false;
  }
}

function compactPath(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/').filter(Boolean);
  return parts.length <= 3 ? parts.join('/') : parts.slice(-3).join('/');
}

function formatHighlight(highlight: { name: string; kind: string; filePath: string; callCount: number }): string {
  const callSuffix = highlight.callCount > 0 ? ` [calls: ${highlight.callCount}]` : '';
  return `- ${highlight.name} (${highlight.kind}) - ${compactPath(highlight.filePath)}${callSuffix}`;
}

function trustStateFromFreshness(freshness: CodeGraphReadinessMarker['graphFreshness']): string {
  if (freshness === 'fresh') return 'live';
  if (freshness === 'stale') return 'stale';
  if (freshness === 'empty') return 'absent';
  return 'unavailable';
}

function graphStateFromFreshness(freshness: CodeGraphReadinessMarker['graphFreshness']): CodeGraphReadinessMarker['graphState'] {
  if (freshness === 'fresh') return 'ready';
  if (freshness === 'stale') return 'stale';
  if (freshness === 'empty') return 'empty';
  return 'missing';
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function describeLastScan(lastScan: string | null): string {
  if (!lastScan) return 'last scan unknown';
  const scanDate = new Date(lastScan);
  if (Number.isNaN(scanDate.getTime())) return 'last scan unknown';
  const now = new Date();
  return scanDate.getFullYear() === now.getFullYear()
    && scanDate.getMonth() === now.getMonth()
    && scanDate.getDate() === now.getDate()
    ? 'scanned today'
    : `last scan ${scanDate.toISOString().slice(0, 10)}`;
}

function formatGraphQualitySummary(graphQualitySummary: StartupGraphQualitySummary | null): string | null {
  if (!graphQualitySummary) return null;
  const parts: string[] = [];
  const detector = graphQualitySummary.detectorProvenanceSummary;
  if (detector?.dominant) {
    const counts = Object.entries(detector.counts ?? {}).map(([key, value]) => `${key}:${value}`).join(', ');
    parts.push(`detector=${detector.dominant}${counts ? ` (${counts})` : ''}`);
  }
  const enrichment = graphQualitySummary.graphEdgeEnrichmentSummary;
  if (enrichment) {
    parts.push(`edge-enrichment=${enrichment.edgeEvidenceClass} (${enrichment.numericConfidence.toFixed(2)})`);
  }
  return parts.length > 0 ? parts.join('; ') : null;
}

function buildStartupSurface(args: {
  stats: CodeGraphStatsSnapshot | null;
  graphState: StartupBriefResult['graphState'];
}): string {
  let codeGraphLine = 'unavailable';
  if (args.stats && (args.graphState === 'ready' || args.graphState === 'stale')) {
    codeGraphLine = [
      args.graphState === 'ready' ? 'healthy' : 'stale',
      `${args.stats.totalFiles.toLocaleString('en-US')} files`,
      `${formatCompactNumber(args.stats.totalNodes)} nodes`,
      `${formatCompactNumber(args.stats.totalEdges)} edges`,
      `(${describeLastScan(args.stats.lastScanTimestamp)}${args.graphState === 'stale' ? '; first structural read may refresh inline' : ''})`,
    ].join(' -- ').replace(' -- (', ' (');
  } else if (args.graphState === 'empty') {
    codeGraphLine = 'empty -- run `code_graph_scan`';
  }

  return [
    'Session context received. Current state:',
    '',
    '- Memory: startup summary only (resume on demand)',
    `- Code Graph: ${codeGraphLine}`,
    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
    '',
    'What would you like to work on?',
  ].join('\n');
}

function buildStartupBrief(
  stats: CodeGraphStatsSnapshot | null,
  markerBase: Pick<CodeGraphReadinessMarker, 'graphFreshness' | 'graphState' | 'readiness'>,
): StartupBriefResult {
  const graphQualitySummary = stats?.graphQualitySummary
    ? stats.graphQualitySummary as unknown as StartupGraphQualitySummary
    : null;
  const graphSummary = stats
    ? {
      files: stats.totalFiles,
      nodes: stats.totalNodes,
      edges: stats.totalEdges,
      lastScan: stats.lastScanTimestamp,
    }
    : null;
  const lines: string[] = [];
  if (stats && (markerBase.graphState === 'ready' || markerBase.graphState === 'stale')) {
    lines.push(`${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges.`);
    lines.push(`Last scan: ${stats.lastScanTimestamp ?? 'unknown'}`);
    if (markerBase.graphFreshness === 'stale') {
      lines.push(`Freshness: stale - ${markerBase.readiness.reason}`);
    }
    const qualityLine = formatGraphQualitySummary(graphQualitySummary);
    if (qualityLine) {
      lines.push(`Graph quality: ${qualityLine}`);
    }
    const highlights = queryStartupHighlights(5);
    if (highlights.length > 0) {
      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use Grep for concept discovery when the symbol or file is still unknown.');
      lines.push('Highlights:');
      lines.push(...highlights.map(formatHighlight));
    }
  }

  const startupSurface = buildStartupSurface({
    stats,
    graphState: markerBase.graphState,
  });
  const sharedPayload = {
    kind: 'startup',
    summary: `Startup brief with ${markerBase.graphState} structural context`,
    provenance: {
      producer: 'startup_brief',
      sourceSurface: 'startup',
      trustState: trustStateFromFreshness(markerBase.graphFreshness),
      generatedAt: new Date().toISOString(),
      lastUpdated: stats?.lastScanTimestamp ?? null,
      sourceRefs: ['code-graph-readiness-marker'],
    },
    sections: lines.length > 0
      ? [{ key: 'structural-context', title: 'Structural Context', content: lines.join('\n'), source: 'code-graph' }]
      : [],
  };

  return {
    graphOutline: lines.length > 0 ? lines.join('\n') : null,
    sessionContinuity: null,
    graphSummary,
    graphQualitySummary,
    graphState: markerBase.graphState,
    graphTrustState: trustStateFromFreshness(markerBase.graphFreshness),
    startupSurface,
    sharedPayload,
    sharedPayloadTransport: JSON.stringify({
      kind: sharedPayload.kind,
      summary: sharedPayload.summary,
      provenance: sharedPayload.provenance,
      sectionKeys: sharedPayload.sections.map((section) => section.key),
    }, null, 2),
  };
}

export function writeCodeGraphReadinessMarker(workspaceRoot: string = process.cwd()): CodeGraphReadinessMarker {
  const generatedAt = new Date().toISOString();
  let stats: CodeGraphStatsSnapshot | null = null;
  let error: string | undefined;
  const readiness: CodeGraphReadinessMarker['readiness'] = (() => {
    try {
      const snapshot = getGraphReadinessSnapshot(workspaceRoot);
      return {
        ...snapshot,
        inlineIndexPerformed: false,
      };
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : String(err);
      return {
        freshness: 'error' as const,
        action: 'none' as const,
        inlineIndexPerformed: false,
        reason: `readiness marker failed: ${error}`,
      };
    }
  })();

  try {
    stats = getStats();
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : String(err);
  }

  const graphFreshness = readiness.freshness;
  const graphState = graphStateFromFreshness(graphFreshness);
  const markerBase = { graphFreshness, graphState, readiness };
  const marker: CodeGraphReadinessMarker = {
    schemaVersion: 1,
    generatedAt,
    producer: 'mk-code-index',
    workspaceRoot,
    graphFreshness,
    graphState,
    readiness,
    stats,
    startup: buildStartupBrief(stats, markerBase),
    ...(error ? { error } : {}),
  };
  writeMarkerFileAtomic(CODE_GRAPH_READINESS_MARKER_PATH, `${JSON.stringify(marker, null, 2)}\n`);
  return marker;
}
