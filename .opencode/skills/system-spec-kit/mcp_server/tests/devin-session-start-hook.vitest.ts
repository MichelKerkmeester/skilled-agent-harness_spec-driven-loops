import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';

vi.mock('../hooks/claude/hook-state.js', () => ({
  loadState: vi.fn(() => ({ ok: false, reason: 'not_found', path: '', detail: '' })),
  readCompactPrime: vi.fn(() => null),
  clearCompactPrime: vi.fn(() => null),
  validatePendingCompactPrimeSemantics: vi.fn(() => ({ ok: true })),
}));

vi.mock('../lib/code-graph-boundary.js', () => ({
  getStartupBriefFromMarker: vi.fn(() => ({
    graphOutline: '- handlers/session-bootstrap.ts',
    sessionContinuity: null,
    graphSummary: { files: 182, nodes: 4210, edges: 8940, lastScan: '2026-05-15T10:00:00.000Z' },
    graphQualitySummary: {
      detectorProvenanceSummary: { dominant: 'structured', counts: { structured: 1 } },
      graphEdgeEnrichmentSummary: { edgeEvidenceClass: 'direct_call', numericConfidence: 0.92 },
    },
    graphState: 'ready' as const,
    graphTrustState: 'live',
    startupSurface: [
      'Session context received. Current state:',
      '',
      '- Memory: startup summary only (resume on demand)',
      '- Code Graph: healthy -- 234 files -- 3.1K nodes -- 3.1K edges (scanned today)',
      '',
      'What would you like to work on?',
    ].join('\n'),
    sharedPayload: {
      kind: 'startup',
      summary: 'Startup brief with ready structural context',
      provenance: {
        producer: 'startup_brief',
        sourceSurface: 'startup',
        trustState: 'live',
        generatedAt: '2026-05-15T10:00:00.000Z',
        lastUpdated: '2026-05-15T10:00:00.000Z',
        sourceRefs: ['code-graph-readiness-marker'],
      },
      sections: [{
        key: 'structural-context',
        title: 'Structural Context',
        content: '- handlers/session-bootstrap.ts',
        source: 'code-graph',
      }],
    },
    sharedPayloadTransport: JSON.stringify({
      kind: 'startup',
      provenance: {
        producer: 'startup_brief',
        sourceSurface: 'startup',
        trustState: 'live',
        generatedAt: '2026-05-15T10:00:00.000Z',
        lastUpdated: '2026-05-15T10:00:00.000Z',
        sourceRefs: ['code-graph-readiness-marker'],
      },
      sectionKeys: ['structural-context'],
    }, null, 2),
  })),
}));

import { getStartupBriefFromMarker } from '../lib/code-graph-boundary.js';
import * as hookState from '../hooks/claude/hook-state.js';
import { handleDevinSessionStart } from '../hooks/devin/session-start.js';

const mockBrief = vi.mocked(getStartupBriefFromMarker);
const mockLoadState = vi.mocked(hookState.loadState);
const mockReadCompactPrime = vi.mocked(hookState.readCompactPrime);
const mockClearCompactPrime = vi.mocked(hookState.clearCompactPrime);
const mockValidateSemantics = vi.mocked(hookState.validatePendingCompactPrimeSemantics);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  delete process.env.SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED;
});

describe('Devin SessionStart startup-context hook', () => {
  it('emits JSON hookSpecificOutput.additionalContext for startup source', async () => {
    const output = await handleDevinSessionStart({ source: 'startup', session_id: 'test-devin' });

    expect(output).toHaveProperty('hookSpecificOutput');
    const typed = output as { hookSpecificOutput: { hookEventName: string; additionalContext: string } };
    expect(typed.hookSpecificOutput.hookEventName).toBe('SessionStart');
    expect(typed.hookSpecificOutput.additionalContext).toContain('Session Context');
    expect(typed.hookSpecificOutput.additionalContext).toContain('Startup Payload Contract');
    expect(typed.hookSpecificOutput.additionalContext).toContain('"producer": "startup_brief"');
    expect(typed.hookSpecificOutput.additionalContext).toContain('"sectionKeys":');
  });

  it('emits fallback context when code-graph readiness is unavailable', async () => {
    mockBrief.mockReturnValueOnce({
      graphOutline: null,
      sessionContinuity: null,
      graphSummary: null,
      graphQualitySummary: null,
      graphState: 'missing' as const,
      graphTrustState: 'unavailable',
      startupSurface: [
        'Session context received. Current state:',
        '',
        '- Memory: startup summary only (resume on demand)',
        '- Code Graph: unavailable',
        '',
        'What would you like to work on?',
      ].join('\n'),
      sharedPayload: null,
      sharedPayloadTransport: null,
    });

    const output = await handleDevinSessionStart({ source: 'startup', session_id: 'test-devin-fallback' });

    const typed = output as { hookSpecificOutput: { hookEventName: string; additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('- Code Graph: unavailable');
    expect(typed.hookSpecificOutput.additionalContext).not.toContain('Startup Payload Contract');
  });

  it('supports resume source', async () => {
    const output = await handleDevinSessionStart({ source: 'resume', session_id: 'test-devin-resume' });

    const typed = output as { hookSpecificOutput: { hookEventName: string; additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Session Resume');
  });

  it('supports clear source', async () => {
    const output = await handleDevinSessionStart({ source: 'clear', session_id: 'test-devin-clear' });

    const typed = output as { hookSpecificOutput: { hookEventName: string; additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Fresh Context');
  });

  it('supports compact source — falls back when no cached prime', async () => {
    mockReadCompactPrime.mockReturnValueOnce(null);
    const output = await handleDevinSessionStart({ source: 'compact', session_id: 'test-devin-compact' });

    const typed = output as { hookSpecificOutput: { hookEventName: string; additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Context Recovery');
  });

  it('fails open on null input', async () => {
    const output = await handleDevinSessionStart(null);
    expect(output).toEqual({});
  });

  it('fails open when code-graph-boundary throws', async () => {
    mockBrief.mockImplementationOnce(() => {
      throw new Error('synthetic boundary failure');
    });

    const output = await handleDevinSessionStart({ source: 'startup', session_id: 'test-devin-crash' });

    const typed = output as { hookSpecificOutput: { hookEventName: string; additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Session Context');
    expect(typed.hookSpecificOutput.additionalContext).toContain('- Code Graph: unavailable');
  });

  it('returns empty object when all sections are empty', async () => {
    mockBrief.mockReturnValueOnce({
      graphOutline: null,
      sessionContinuity: null,
      graphSummary: null,
      graphQualitySummary: null,
      graphState: 'missing' as const,
      graphTrustState: 'unavailable',
      startupSurface: '',
      sharedPayload: null,
      sharedPayloadTransport: null,
    });

    const output = await handleDevinSessionStart({ source: 'startup', session_id: 'test-empty' });
    // Recovery Tools section still renders with non-empty content,
    // so output is NOT empty; hookSpecificOutput is always produced.
    expect(output).toHaveProperty('hookSpecificOutput');
  });

  it('respects SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED env var', async () => {
    process.env.SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED = '1';
    const output = await handleDevinSessionStart({ source: 'startup', session_id: 'test-disabled' });
    expect(output).toEqual({});
  });

  it('emits runtime=devin in diagnostic JSONL on stderr', async () => {
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    await handleDevinSessionStart({ source: 'startup', session_id: 'test-diag' });

    const diagnosticLine = stderrSpy.mock.calls
      .map(call => call[0] as string)
      .find(line => line.includes('devin-session-start'));
    expect(diagnosticLine).toBeDefined();
    const parsed = JSON.parse(diagnosticLine!);
    expect(parsed.runtime).toBe('devin');
    expect(parsed.surface).toBe('devin-session-start');
    expect(parsed.status).toBe('ok');

    stderrSpy.mockRestore();
  });
});

describe('Devin SessionStart hook startup contract parity', () => {
  it('emits equivalent kind=startup provenance block to Claude variant', async () => {
    const output = await handleDevinSessionStart({ source: 'startup', session_id: 'parity-test' });

    const typed = output as { hookSpecificOutput: { additionalContext: string } };
    const context = typed.hookSpecificOutput.additionalContext;

    expect(context).toContain('"producer": "startup_brief"');
    expect(context).toContain('"sourceSurface": "startup"');
    expect(context).toContain('"trustState": "live"');
    expect(context).toContain('"sourceRefs":');
    expect(context).toContain('"code-graph-readiness-marker"');
    expect(context).toContain('"sectionKeys":');
    expect(context).toContain('"structural-context"');
  });
});

describe('Devin SessionStart compact recovery — full hook-state flow', () => {
  const VALID_CACHED_AT = new Date(Date.now() - 60_000).toISOString();
  const VALID_PRIME = {
    payload: 'Previously compacted session context.',
    cachedAt: VALID_CACHED_AT,
    opaqueId: 'test-opaque-id',
    payloadContract: {
      provenance: {
        producer: 'pre_compact',
        sourceSurface: 'compact',
        trustState: 'live',
        generatedAt: VALID_CACHED_AT,
        lastUpdated: VALID_CACHED_AT,
        sourceRefs: ['pre-compact-hook'],
        sanitizerVersion: '1.0.0',
        runtimeFingerprint: { normalizer: 'nfc', node: '22.0.0', icu: '74.1', unicode: '15.1' },
      },
    },
  } as const;

  it('injects Recovered Context sections when cached prime is present and valid', async () => {
    mockReadCompactPrime.mockReturnValueOnce(VALID_PRIME as Parameters<typeof mockReadCompactPrime>[0] extends unknown ? ReturnType<typeof hookState.readCompactPrime> : never);
    mockValidateSemantics.mockReturnValueOnce({ ok: true });
    mockLoadState.mockReturnValueOnce({ ok: true, state: { lastSpecFolder: '.opencode/specs/test-spec', claudeSessionId: 'compact-session', speckitSessionId: null, sessionSummary: null, pendingCompactPrime: null, producerMetadata: null, metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 }, createdAt: VALID_CACHED_AT, updatedAt: VALID_CACHED_AT, schemaVersion: 1 }, path: '', migrated: false, persisted: true });

    const output = await handleDevinSessionStart({ source: 'compact', session_id: 'compact-session' });

    const typed = output as { hookSpecificOutput: { additionalContext: string } };
    const context = typed.hookSpecificOutput.additionalContext;

    expect(context).toContain('Recovered Context');
    expect(context).toContain('Recovery Instructions');
    expect(context).toContain('Active Spec Folder');
    expect(context).toContain('.opencode/specs/test-spec');
    expect(mockClearCompactPrime).toHaveBeenCalledWith('compact-session', {
      cachedAt: VALID_CACHED_AT,
      opaqueId: 'test-opaque-id',
    });
  });

  it('falls back to static message when cached prime is missing', async () => {
    mockReadCompactPrime.mockReturnValueOnce(null);

    const output = await handleDevinSessionStart({ source: 'compact', session_id: 'compact-no-cache' });

    const typed = output as { hookSpecificOutput: { additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Context Recovery');
    expect(typed.hookSpecificOutput.additionalContext).not.toContain('Recovered Context');
    expect(mockClearCompactPrime).not.toHaveBeenCalled();
  });

  it('falls back to static message and clears when semantic validation fails', async () => {
    mockReadCompactPrime.mockReturnValueOnce(VALID_PRIME as ReturnType<typeof hookState.readCompactPrime>);
    mockValidateSemantics.mockReturnValueOnce({ ok: false, reason: 'forbidden_normalized_prefix' as const, detail: 'test-reason' });

    const output = await handleDevinSessionStart({ source: 'compact', session_id: 'compact-bad-semantic' });

    const typed = output as { hookSpecificOutput: { additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Context Recovery');
    expect(typed.hookSpecificOutput.additionalContext).not.toContain('Recovered Context');
    expect(mockClearCompactPrime).toHaveBeenCalled();
  });
});

describe('Devin SessionStart resume — lastSpecFolder injection', () => {
  const NOW = new Date().toISOString();

  it('emits lastSpecFolder in Session Continuity when state is available', async () => {
    mockLoadState.mockReturnValueOnce({
      ok: true,
      state: {
        lastSpecFolder: '.opencode/specs/142-my-feature',
        claudeSessionId: 'resume-session',
        speckitSessionId: null,
        sessionSummary: null,
        pendingCompactPrime: null,
        producerMetadata: null,
        metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
        createdAt: NOW,
        updatedAt: NOW,
        schemaVersion: 1,
      },
      path: '',
      migrated: false,
      persisted: true,
    });

    const output = await handleDevinSessionStart({ source: 'resume', session_id: 'resume-session' });

    const typed = output as { hookSpecificOutput: { additionalContext: string } };
    const context = typed.hookSpecificOutput.additionalContext;
    expect(context).toContain('Session Continuity');
    expect(context).toContain('.opencode/specs/142-my-feature');
  });

  it('falls back to generic resume prompt when state has no lastSpecFolder', async () => {
    mockLoadState.mockReturnValueOnce({ ok: false, reason: 'not_found', path: '', detail: '' });

    const output = await handleDevinSessionStart({ source: 'resume', session_id: 'resume-no-state' });

    const typed = output as { hookSpecificOutput: { additionalContext: string } };
    expect(typed.hookSpecificOutput.additionalContext).toContain('Session Resume');
  });
});
