// ───────────────────────────────────────────────────────────────────
// MODULE: Telemetry Export Control Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  aggregateLifecycleEvents,
  createTelemetryExport,
  inspectTelemetryExport,
} from '../../src/observability/index.js';

describe('telemetry export controls', () => {
  it('keeps export disabled unless the caller explicitly enables it', () => {
    const aggregate = aggregateLifecycleEvents([]);

    expect(createTelemetryExport([aggregate])).toEqual({
      status: 'disabled',
      exportVersion: 'telemetry-export/1.0.0',
      recordCount: 0,
      records: [],
    });
  });

  it('drops every non-allowlisted field from enabled exports', () => {
    const canary = 'RAW_EXPORT_CONTENT_CANARY';
    const aggregate = aggregateLifecycleEvents([]);
    const contaminated = {
      ...aggregate,
      rawPrompt: canary,
      counters: {
        ...aggregate.counters,
        candidateText: canary,
      },
      byRuntime: [{
        runtime: 'codex',
        eventCount: 1,
        counters: aggregate.counters,
        rates: aggregate.rates,
        protectedSpans: [canary],
      }],
    };
    const result = createTelemetryExport([contaminated], { enabled: true });

    expect(result.status).toBe('exported');
    expect(result.recordCount).toBe(1);
    expect(JSON.stringify(result)).not.toContain(canary);
    expect(result.records[0]).not.toHaveProperty('rawPrompt');
    expect(result.records[0]?.counters).not.toHaveProperty('candidateText');
    expect(result.records[0]?.byRuntime[0]).not.toHaveProperty('protectedSpans');
    expect(inspectTelemetryExport(result)).toEqual({ safe: true, findings: [] });
  });

  it('reports forbidden content fields and canaries without copying leaked values', () => {
    const result = inspectTelemetryExport({
      records: [{
        runtime: 'codex',
        candidateText: 'sk-canary-telemetry-4d77a21f',
      }],
    });

    expect(result.safe).toBe(false);
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'forbidden-field' }),
      expect.objectContaining({ code: 'redaction-canary' }),
    ]));
    expect(JSON.stringify(result)).not.toContain('sk-canary-telemetry-4d77a21f');
  });
});
