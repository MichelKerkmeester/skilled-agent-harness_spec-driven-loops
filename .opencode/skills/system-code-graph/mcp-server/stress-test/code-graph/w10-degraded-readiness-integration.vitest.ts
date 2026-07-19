// ───────────────────────────────────────────────────────────────
// MODULE: W10 Degraded Readiness Integration Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises real code_graph_query degraded readiness envelope capture.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockCreateEmptyQueryPlan, mockMapGraphReadinessToTelemetry, mockBuildSearchDecisionEnvelope } = vi.hoisted(() => ({
  mockCreateEmptyQueryPlan: vi.fn((opts: Record<string, unknown>) => opts),
  mockMapGraphReadinessToTelemetry: vi.fn(() => ({
    freshness: 'empty',
    action: 'full_scan',
    canonicalReadiness: 'missing',
    trustState: 'absent',
    blocked: true,
    degraded: true,
    graphAnswersOmitted: true,
    requiredAction: 'code_graph_scan',
  })),
  mockBuildSearchDecisionEnvelope: vi.fn((params: Record<string, unknown>) => ({
    degradedReadiness: params.degradedReadiness,
  })),
}));

vi.mock('../../../../system-spec-kit/mcp-server/lib/query/query-plan.js', () => ({
  createEmptyQueryPlan: mockCreateEmptyQueryPlan,
}));

vi.mock('../../../../system-spec-kit/mcp-server/lib/search/graph-readiness-mapper.js', () => ({
  mapGraphReadinessToTelemetry: mockMapGraphReadinessToTelemetry,
}));

vi.mock('../../../../system-spec-kit/mcp-server/lib/search/search-decision-envelope.js', () => ({
  buildSearchDecisionEnvelope: mockBuildSearchDecisionEnvelope,
}));

import { closeDb, initDb } from '../../lib/code-graph-db.js';
import { handleCodeGraphQuery } from '../../handlers/query.js';

interface CodeGraphQueryPayload {
  status: string;
  data?: Record<string, unknown>;
}

function isCodeGraphQueryPayload(value: unknown): value is CodeGraphQueryPayload {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.status === 'string'
    && (record.data === undefined || (
      typeof record.data === 'object'
      && record.data !== null
      && !Array.isArray(record.data)
    ));
}

function parseCodeGraphQueryPayload(text: string): CodeGraphQueryPayload {
  const parsed: unknown = JSON.parse(text);
  if (!isCodeGraphQueryPayload(parsed)) {
    throw new Error('Expected code_graph_query payload with status and optional data');
  }
  return parsed;
}

describe('W10 degraded-readiness integration', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    closeDb();
    vi.restoreAllMocks();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('captures actual empty code_graph_query degraded readiness in SearchDecisionEnvelope', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'w10-cg-empty-'));
    tempDirs.push(tempDir);
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
    initDb(tempDir);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'src/example.ts',
    });
    const parsed = parseCodeGraphQueryPayload(result.content[0]?.text ?? '{}');

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.blockReason).toBe('full_scan_required');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
      retryAfter: 'scan_complete',
    });

    const envelope = mockBuildSearchDecisionEnvelope({
      requestId: 'w10-empty',
      queryPlan: mockCreateEmptyQueryPlan({ selectedChannels: ['code_graph_query'] }),
      degradedReadiness: mockMapGraphReadinessToTelemetry(parsed.data ?? {}),
      timestamp: '2026-04-29T00:00:00.000Z',
    });

    expect(envelope.degradedReadiness).toMatchObject({
      freshness: 'empty',
      action: 'full_scan',
      canonicalReadiness: 'missing',
      trustState: 'absent',
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
    });
  });
});
