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

function isQueryIntent(value: unknown): value is QueryIntent {
  return value === 'structural' || value === 'semantic' || value === 'hybrid';
}

function parseQueryIntentClassification(value: unknown): QueryIntentClassification {
  if (!isRecord(value) || !isQueryIntent(value.intent)) {
    throw new Error('code_graph_classify_query_intent returned an invalid classification');
  }
  return {
    intent: value.intent,
    confidence: Number(value.confidence ?? 0),
    structuralScore: Number(value.structuralScore ?? 0),
    semanticScore: Number(value.semanticScore ?? 0),
    matchedKeywords: Array.isArray(value.matchedKeywords)
      ? value.matchedKeywords.filter((keyword): keyword is string => typeof keyword === 'string')
      : [],
  };
}

export async function classifyQueryIntent(query: string): Promise<QueryIntentClassification> {
  const payload = await callCodeGraphTool('code_graph_classify_query_intent', { query });
  if (payload.status !== 'ok') {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'code_graph_classify_query_intent failed');
  }
  return parseQueryIntentClassification(payload.data);
}

export function normalizeReadyAction(value: unknown): ReadyAction {
  return value === 'full_scan' || value === 'selective_reindex' ? value : 'none';
}
