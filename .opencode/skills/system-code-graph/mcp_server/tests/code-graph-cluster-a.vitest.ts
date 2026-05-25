// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Read-Path Cluster A Tests
// ───────────────────────────────────────────────────────────────
// Coverage:
//   - F-007: Blocked-read diagnostics — scope + manifest fields
//     surface on `data.*` (not just `data.readiness.*`).
//   - F-018: Guarded auto-rescan policy — happy path (allowed)
//     when stored scope matches active scope and parse backlog
//     is clean; conservative path (blocked) when backlog > 0.
//   - F-019: Verify scope-aware preflight — surfaces informational
//     `scopeMismatch` field when stored and active scopes differ.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  shouldAutoRescan,
  type AutoRescanPolicyArgs,
} from '../lib/auto-rescan-policy.js';

// ───────────────────────────────────────────────────────────────
// F-018: Auto-rescan policy unit tests (pure helper)
// ───────────────────────────────────────────────────────────────

describe('F-018: shouldAutoRescan policy', () => {
  const matchingScope = {
    fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
  };
  const mismatchedScope = {
    fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
  };

  function makeArgs(overrides: Partial<AutoRescanPolicyArgs> = {}): AutoRescanPolicyArgs {
    return {
      storedScope: matchingScope,
      activeScope: matchingScope,
      parseDiagnosticsBacklog: 0,
      ...overrides,
    };
  }

  it('allows guarded inline full scan when stored scope matches active scope and parse backlog is clean', () => {
    const decision = shouldAutoRescan(makeArgs());
    expect(decision).toEqual({ allowed: true });
  });

  it('blocks guarded inline full scan when parse diagnostics are backlogged', () => {
    const decision = shouldAutoRescan(makeArgs({ parseDiagnosticsBacklog: 5 }));
    expect(decision).toEqual({
      allowed: false,
      blockReason: 'parse_error_backlog',
    });
  });

  it('blocks guarded inline full scan when stored scope and active scope diverge', () => {
    const decision = shouldAutoRescan(makeArgs({ activeScope: mismatchedScope }));
    expect(decision).toEqual({
      allowed: false,
      blockReason: 'scope_mismatch',
    });
  });

  it('respects an explicit threshold when callers tolerate a small backlog', () => {
    const decision = shouldAutoRescan(makeArgs({
      parseDiagnosticsBacklog: 5,
      parseDiagnosticsBacklogThreshold: 10,
    }));
    expect(decision).toEqual({ allowed: true });
  });

  it('treats a non-finite backlog defensively as a clean signal', () => {
    const decision = shouldAutoRescan(makeArgs({ parseDiagnosticsBacklog: Number.NaN }));
    expect(decision).toEqual({ allowed: true });
  });
});

// ───────────────────────────────────────────────────────────────
// F-007: Query handler blocked-payload diagnostics on data.*
// ───────────────────────────────────────────────────────────────
// The handler tests below mock ensure-ready and the DB so the
// handler runs in isolation; we only assert on the JSON envelope
// the handler emits when readiness reports a full-scan-required
// blocked path.

const queryMocks = vi.hoisted(() => ({
  getDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => undefined),
      all: vi.fn(() => []),
    })),
    transaction: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
  })),
  queryEdgesFrom: vi.fn(() => []),
  queryEdgesTo: vi.fn(() => []),
  queryOutline: vi.fn(() => []),
  resolveSubjectFilePath: vi.fn((subject: string) => subject),
  queryFileImportDependents: vi.fn(() => []),
  queryFileDegrees: vi.fn(() => []),
  getLastDetectorProvenance: vi.fn(() => 'structured'),
  ensureCodeGraphReady: vi.fn(),
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getDb: queryMocks.getDb,
  queryEdgesFrom: queryMocks.queryEdgesFrom,
  queryEdgesTo: queryMocks.queryEdgesTo,
  queryOutline: queryMocks.queryOutline,
  resolveSubjectFilePath: queryMocks.resolveSubjectFilePath,
  queryFileImportDependents: queryMocks.queryFileImportDependents,
  queryFileDegrees: queryMocks.queryFileDegrees,
  getLastDetectorProvenance: queryMocks.getLastDetectorProvenance,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: queryMocks.ensureCodeGraphReady,
}));

import { handleCodeGraphQuery } from '../handlers/query.js';

describe('F-007: blocked full-scan payload surfaces diagnostics on data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryMocks.getDb.mockReturnValue({
      prepare: vi.fn(() => ({
        get: vi.fn(() => undefined),
        all: vi.fn(() => []),
      })),
      transaction: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
    });
    queryMocks.queryEdgesFrom.mockReturnValue([]);
    queryMocks.queryEdgesTo.mockReturnValue([]);
    queryMocks.queryOutline.mockReturnValue([]);
    queryMocks.resolveSubjectFilePath.mockImplementation((subject: string) => subject);
    queryMocks.queryFileImportDependents.mockReturnValue([]);
    queryMocks.queryFileDegrees.mockReturnValue([]);
    queryMocks.getLastDetectorProvenance.mockReturnValue('structured');
  });

  it('includes scope and manifest diagnostics in blocked full-scan payloads', async () => {
    queryMocks.ensureCodeGraphReady.mockResolvedValueOnce({
      freshness: 'stale',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'candidate manifest drift: indexable file set has changed since last scan',
      activeScope: {
        fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
        label: 'end-user code only',
        source: 'default',
      },
      storedScope: {
        fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
        label: 'skills included',
        source: 'env',
      },
      manifestCount: 42,
      manifestDigest: 'abcdef0123456789',
      autoRescanSafety: 'blocked',
      autoRescanBlockReason: 'scope_mismatch',
    } as never);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('blocked');
    // F-007: `reason`, `activeScope`, `storedScope`, `manifestCount`,
    // `manifestDigest` MUST be reachable directly on `data.*` so
    // operators routing on them don't have to walk into
    // `data.readiness.*`. The nested readiness block continues to
    // carry the same fields for backward compatibility.
    expect(parsed.data).toMatchObject({
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
      blockReason: 'full_scan_required',
      reason: 'candidate manifest drift: indexable file set has changed since last scan',
      activeScope: expect.objectContaining({
        source: 'default',
        fingerprint: expect.stringContaining('skills=none'),
      }),
      storedScope: expect.objectContaining({
        source: 'env',
        fingerprint: expect.stringContaining('skills=all'),
      }),
      manifestCount: 42,
      manifestDigest: 'abcdef0123456789',
    });
    expect(parsed.data.readiness).toMatchObject({
      activeScope: expect.objectContaining({ source: 'default' }),
      storedScope: expect.objectContaining({ source: 'env' }),
      manifestCount: 42,
      manifestDigest: 'abcdef0123456789',
      autoRescanSafety: 'blocked',
      autoRescanBlockReason: 'scope_mismatch',
    });
  });

  it('surfaces null diagnostics on blocked payloads when ensure-ready omits them', async () => {
    // Backward compat: legacy ensure-ready callers that don't
    // populate the diagnostic envelope must not crash the handler.
    queryMocks.ensureCodeGraphReady.mockResolvedValueOnce({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    } as never);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('blocked');
    expect(parsed.data).toMatchObject({
      blocked: true,
      reason: 'graph is empty (0 nodes)',
      activeScope: null,
      storedScope: null,
      manifestCount: null,
      manifestDigest: null,
    });
  });
});

// ───────────────────────────────────────────────────────────────
// F-019: Verify scope-aware preflight informational field
// ───────────────────────────────────────────────────────────────
// Verify is a separate handler with its own mock surface; we
// reuse the query mocks above (handleCodeGraphQuery is mocked in
// verify's own test for resilience). Here we set up verify with
// vi.resetModules so the verify handler module loads with its own
// mocked dependencies cleanly separated from the query mocks.

describe('F-019: code_graph_verify scope-aware preflight', () => {
  const VERIFY_FIXTURE_BATTERY_PATH = fileURLToPath(new URL(
    './assets/code-graph-gold-queries.json',
    import.meta.url,
  ));
  const WORKSPACE_ROOT = fileURLToPath(new URL(
    '../../../../../',
    import.meta.url,
  ));

  let tempDir = '';
  const originalCwd = process.cwd();

  beforeEach(() => {
    process.chdir(WORKSPACE_ROOT);
    tempDir = mkdtempSync(join(tmpdir(), 'code-graph-cluster-a-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
    process.chdir(originalCwd);
  });

  it('proceeds with informational scopeMismatch when stored and active scopes differ', async () => {
    // F-019: scope mismatch is informational only — verify proceeds
    // and surfaces the canonical { stored, active, recommendation }
    // envelope alongside the normal verification result. We dynamically
    // import a clean verify handler with isolated mocks so the F-007
    // query mocks above don't leak into it.
    vi.resetModules();
    const verifyMocks = {
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ok',
      })),
      handleCodeGraphQuery: vi.fn(async () => ({
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            status: 'ok',
            data: { nodes: [{ name: 'handleVerify', fqName: 'verify.handleVerify' }] },
          }),
        }],
      })),
      setLastGoldVerification: vi.fn(),
      getStoredCodeGraphScope: vi.fn(() => ({
        fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
        label: 'skills included',
        source: 'env',
      })),
    };
    vi.doMock('../lib/ensure-ready.js', () => ({
      ensureCodeGraphReady: verifyMocks.ensureCodeGraphReady,
    }));
    vi.doMock('../handlers/query.js', () => ({
      handleCodeGraphQuery: verifyMocks.handleCodeGraphQuery,
    }));
    vi.doMock('../lib/code-graph-db.js', () => ({
      setLastGoldVerification: verifyMocks.setLastGoldVerification,
      getStoredCodeGraphScope: verifyMocks.getStoredCodeGraphScope,
    }));
    const { handleCodeGraphVerify } = await import('../handlers/verify.js');

    const response = await handleCodeGraphVerify({
      batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
      includeDetails: true,
    });
    const parsed = JSON.parse(response.content[0].text);

    // F-019: verify proceeds and surfaces the canonical
    // { stored, active, recommendation } envelope as informational
    // diagnostics. The gold-query battery still runs and the result
    // payload is present.
    expect(parsed.status).toBe('ok');
    expect(parsed.scopePreflight).toMatchObject({ status: 'mismatch' });
    expect(parsed.scopeMismatch).toEqual({
      stored: expect.objectContaining({ source: 'env' }),
      active: expect.objectContaining({ source: 'default' }),
      recommendation: 'rescan with matching scope or pass forceScopeChange',
    });
    expect(parsed.result).toEqual(expect.objectContaining({
      batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
    }));
    expect(verifyMocks.handleCodeGraphQuery).toHaveBeenCalled();

    vi.doUnmock('../lib/ensure-ready.js');
    vi.doUnmock('../handlers/query.js');
    vi.doUnmock('../lib/code-graph-db.js');
  });
});

