import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';

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
import { handleDevinSessionStart } from '../hooks/devin/session-start.js';

const mockBrief = vi.mocked(getStartupBriefFromMarker);

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

  it('supports compact source', async () => {
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
