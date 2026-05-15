// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Boundary
// ───────────────────────────────────────────────────────────────
// Spec-kit side of the system-code-graph process boundary.
// Startup paths read the readiness marker; request-time graph reads use MCP.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type {
  CodeGraphReadinessMarker,
  CodeGraphStatsSnapshot,
  GraphFreshness,
  GraphReadinessSnapshot,
  ReadyAction,
  StartupBriefResult,
} from '@spec-kit/shared/code-graph-contracts';

export type {
  CodeGraphReadinessMarker,
  CodeGraphStatsSnapshot,
  GraphFreshness,
  GraphReadinessSnapshot,
  StartupBriefResult,
} from '@spec-kit/shared/code-graph-contracts';

const CODE_GRAPH_MCP_TIMEOUT_MS = 8_000;
const MARKER_PATH = fileURLToPath(new URL(
  '../../../system-code-graph/mcp_server/database/.code-graph-readiness.json',
  import.meta.url,
));
const LAUNCHER_PATH = fileURLToPath(new URL('../../../../bin/mk-code-index-launcher.cjs', import.meta.url));

export interface CodeGraphStatusSnapshot {
  status: 'ok' | 'error';
  data?: {
    totalFiles: number;
    totalNodes: number;
    totalEdges: number;
    staleFiles: number;
    lastScanAt: string | null;
    dbFileSize: number | null;
    schemaVersion: number;
    nodesByKind: Record<string, number>;
    edgesByType: Record<string, number>;
    parseHealth: Record<string, number>;
    freshness?: GraphFreshness;
  };
  error?: string;
}

export type QueryIntent = 'structural' | 'semantic' | 'hybrid';

export interface QueryIntentClassification {
  intent: QueryIntent;
  confidence: number;
  structuralScore: number;
  semanticScore: number;
  matchedKeywords: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function processEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

function withTimeout<T>(operation: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      reject(Object.assign(new Error(`${label} timed out after ${timeoutMs}ms`), { code: 'CODE_GRAPH_MCP_TIMEOUT' }));
    }, timeoutMs);
    timeout.unref?.();
    operation.then(
      (value) => {
        if (timeout) clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        if (timeout) clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

export function getCodeGraphReadinessMarkerPath(): string {
  return MARKER_PATH;
}

export function readCodeGraphReadinessMarker(): CodeGraphReadinessMarker | null {
  if (!existsSync(MARKER_PATH)) {
    return null;
  }
  try {
    const parsed = JSON.parse(readFileSync(MARKER_PATH, 'utf8')) as unknown;
    if (!isRecord(parsed) || parsed.schemaVersion !== 1 || parsed.producer !== 'mk-code-index') {
      return null;
    }
    return parsed as unknown as CodeGraphReadinessMarker;
  } catch {
    return null;
  }
}

function freshnessFromMarker(marker: CodeGraphReadinessMarker | null): GraphFreshness {
  return marker?.graphFreshness ?? 'error';
}

function defaultReadiness(reason: string): GraphReadinessSnapshot {
  return {
    freshness: 'error',
    action: 'none',
    inlineIndexPerformed: false,
    reason,
  };
}

export function getGraphReadinessSnapshotFromMarker(): GraphReadinessSnapshot {
  return readCodeGraphReadinessMarker()?.readiness ?? defaultReadiness('code graph readiness marker unavailable');
}

export function getGraphFreshnessFromMarker(): GraphFreshness {
  return freshnessFromMarker(readCodeGraphReadinessMarker());
}

export function getGraphStatsFromMarker(): CodeGraphStatsSnapshot | null {
  return readCodeGraphReadinessMarker()?.stats ?? null;
}

export function getStartupBriefFromMarker(): StartupBriefResult {
  const marker = readCodeGraphReadinessMarker();
  if (marker?.startup) {
    return marker.startup;
  }
  return {
    graphOutline: null,
    sessionContinuity: null,
    graphSummary: null,
    graphQualitySummary: null,
    graphState: 'missing',
    graphTrustState: 'unavailable',
    cocoIndexAvailable: false,
    startupSurface: [
      'Session context received. Current state:',
      '',
      '- Memory: startup summary only (resume on demand)',
      '- Code Graph: unavailable',
      '- CocoIndex: unknown',
      '',
      'What would you like to work on?',
    ].join('\n'),
    sharedPayload: null,
    sharedPayloadTransport: null,
  };
}

export function getCodeGraphStatusSnapshotFromMarker(): CodeGraphStatusSnapshot {
  const marker = readCodeGraphReadinessMarker();
  if (!marker?.stats) {
    return {
      status: 'error',
      error: marker?.error ?? 'Code graph readiness marker unavailable',
    };
  }
  const stats = marker.stats;
  const staleFiles = typeof marker.readiness.files?.length === 'number'
    ? marker.readiness.files.length
    : 0;
  return {
    status: 'ok',
    data: {
      totalFiles: stats.totalFiles,
      totalNodes: stats.totalNodes,
      totalEdges: stats.totalEdges,
      staleFiles,
      lastScanAt: stats.lastScanTimestamp,
      dbFileSize: stats.dbFileSize,
      schemaVersion: stats.schemaVersion,
      nodesByKind: stats.nodesByKind,
      edgesByType: stats.edgesByType,
      parseHealth: stats.parseHealthSummary,
      freshness: marker.graphFreshness,
    },
  };
}

export async function callCodeGraphTool(
  name: string,
  args: Record<string, unknown>,
  timeoutMs: number = CODE_GRAPH_MCP_TIMEOUT_MS,
): Promise<Record<string, unknown>> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [LAUNCHER_PATH],
    cwd: path.resolve(process.cwd()),
    env: processEnv(),
    stderr: 'pipe',
  });
  transport.stderr?.on('data', () => {});
  const client = new Client({ name: 'mk-spec-memory-code-graph-boundary', version: '0.1.0' });
  try {
    await withTimeout(client.connect(transport), timeoutMs, 'mk-code-index initialize');
    const response = await withTimeout(
      client.callTool({ name, arguments: args }),
      timeoutMs,
      `mk-code-index.${name}`,
    );
    const first = Array.isArray(response?.content) ? response.content[0] : null;
    if (typeof first?.text !== 'string') {
      throw new Error('Code graph MCP response missing text content');
    }
    return JSON.parse(first.text) as Record<string, unknown>;
  } finally {
    try {
      await client.close();
    } catch {
      // Best-effort MCP child cleanup.
    }
  }
}

export async function getCodeGraphStatusViaRpc(): Promise<CodeGraphStatusSnapshot> {
  try {
    const payload = await callCodeGraphTool('code_graph_status', {});
    const data = isRecord(payload.data) ? payload.data : {};
    if (payload.status !== 'ok') {
      return {
        status: 'error',
        error: typeof payload.message === 'string' ? payload.message : 'code_graph_status failed',
      };
    }
    const readiness = isRecord(data.readiness) ? data.readiness : {};
    return {
      status: 'ok',
      data: {
        totalFiles: Number(data.totalFiles ?? 0),
        totalNodes: Number(data.totalNodes ?? 0),
        totalEdges: Number(data.totalEdges ?? 0),
        staleFiles: Array.isArray(readiness.files) ? readiness.files.length : 0,
        lastScanAt: typeof data.lastScanAt === 'string' ? data.lastScanAt : null,
        dbFileSize: typeof data.dbFileSize === 'number' ? data.dbFileSize : null,
        schemaVersion: Number(data.schemaVersion ?? 0),
        nodesByKind: isRecord(data.nodesByKind) ? data.nodesByKind as Record<string, number> : {},
        edgesByType: isRecord(data.edgesByType) ? data.edgesByType as Record<string, number> : {},
        parseHealth: isRecord(data.parseHealth) ? data.parseHealth as Record<string, number> : {},
        freshness: typeof data.freshness === 'string' ? data.freshness as GraphFreshness : undefined,
      },
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function classifyQueryIntent(query: string): QueryIntentClassification {
  if (!query?.trim()) {
    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
  }

  const structuralPatterns = [
    /\bwho\s+calls\b/i,
    /\bwhat\s+(?:calls|imports|exports|extends|implements)\b/i,
    /\b(?:show|list|get)\s+(?:callers|callees|dependencies|imports|exports|outline)\b/i,
    /\b(?:impact|blast\s+radius)\s+of\b/i,
    /\b(?:outline|structure)\s+of\b/i,
  ];
  const semanticPatterns = [
    /\bsimilar\s+to\b/i,
    /\b(?:find|search)\s+(?:code|files|implementations)\s+(?:that|for|about|related)\b/i,
    /\b(?:examples?|patterns?|usage)\s+of\b/i,
    /\bwhat\s+(?:is|are|does)\s+(?:the\s+)?(?:pattern|approach|concept|purpose|meaning|intent|strategy)\b/i,
    /\bwhere\s+(?:is|are)\b.*\b(?:handled|implemented|defined|configured)\b/i,
  ];
  const structuralKeywords = new Set([
    'calls', 'call', 'imports', 'exports', 'extends', 'implements', 'function',
    'class', 'method', 'interface', 'type', 'module', 'callers', 'callees',
    'dependencies', 'dependents', 'references', 'definition', 'declaration',
    'outline', 'impact', 'graph', 'edges', 'nodes', 'symbols', 'hierarchy',
  ]);
  const semanticKeywords = new Set([
    'similar', 'like', 'related', 'example', 'pattern', 'usage', 'approach',
    'find', 'search', 'discover', 'locate', 'explain', 'understand', 'purpose',
    'why', 'meaning', 'context', 'concept', 'intent',
  ]);
  const tokens = query.toLowerCase().split(/[\s,;:.()[\]{}'"]+/).filter(Boolean);
  const structuralHits = tokens.filter((token) => structuralKeywords.has(token));
  const semanticHits = tokens.filter((token) => semanticKeywords.has(token));
  const structuralScore = structuralHits.length + structuralPatterns.filter((pattern) => pattern.test(query)).length * 2;
  const semanticScore = semanticHits.length + semanticPatterns.filter((pattern) => pattern.test(query)).length * 2;
  const total = structuralScore + semanticScore;
  const matchedKeywords = [...structuralHits, ...semanticHits];
  if (total === 0) {
    return { intent: 'hybrid', confidence: 0.5, structuralScore, semanticScore, matchedKeywords };
  }
  const structuralRatio = structuralScore / total;
  const semanticRatio = semanticScore / total;
  const confidence = (ratio: number) => Math.min(0.95, 0.5 + ratio * 0.25 + Math.min(total, 5) * 0.05);
  if (structuralRatio > 0.65) {
    return { intent: 'structural', confidence: confidence(structuralRatio), structuralScore, semanticScore, matchedKeywords };
  }
  if (semanticRatio > 0.65) {
    return { intent: 'semantic', confidence: confidence(semanticRatio), structuralScore, semanticScore, matchedKeywords };
  }
  return {
    intent: 'hybrid',
    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
    structuralScore,
    semanticScore,
    matchedKeywords,
  };
}

export function normalizeReadyAction(value: unknown): ReadyAction {
  return value === 'full_scan' || value === 'selective_reindex' ? value : 'none';
}
