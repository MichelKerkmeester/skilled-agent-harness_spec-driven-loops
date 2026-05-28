import { describe, expect, it } from 'vitest';

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  buildMemorySavePayload,
  parseCouncilReport,
  renderArtifacts,
  writeConfig,
  writeDeliberation,
  writeSeat,
  writeStateJsonl,
  writeStrategyMd,
  writeReport,
} = require('../lib/persist-artifacts.cjs') as {
  buildMemorySavePayload: (parsed: Record<string, unknown>, packetSpecFolder: string) => Record<string, unknown>;
  parseCouncilReport: (markdown: string) => Record<string, unknown>;
  renderArtifacts: (parsed: Record<string, unknown>, options?: Record<string, unknown>) => Record<string, unknown>;
  writeConfig: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  writeDeliberation: (packetSpecFolder: string, relativePath: string, content: string, options?: Record<string, unknown>) => string;
  writeSeat: (packetSpecFolder: string, relativePath: string, content: string, options?: Record<string, unknown>) => string;
  writeStateJsonl: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  writeStrategyMd: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  writeReport: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(run: (packetSpecFolder: string) => void | Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-persist-artifacts-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Creates a minimal council report markdown for testing.
 */
function councilReport(overrides: Record<string, unknown> = {}): string {
  const composition = overrides.composition || `
| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate |
|------|---------------|-------------------|-----------------|
| seat-001 | Architectural | System Design | Focus on modularity |
| seat-002 | Performance | Runtime Efficiency | Focus on latency |
`;
  const recommendedPlan = overrides.recommendedPlan || `
- Extend deep-loop-runtime with council primitives
- Add cost guard validation
`;
  const planConfidence = overrides.planConfidence || `
**Overall**: 85/100
`;
  return `# Multi-AI Council Report

## Council Composition
${composition}

## Recommended Plan
${recommendedPlan}

## Plan Confidence
${planConfidence}
`;
}

describe('deep-ai-council persist-artifacts', () => {
  it('parseCouncilReport extracts sections and validates required fields', () => {
    const markdown = councilReport();
    const parsed = parseCouncilReport(markdown);

    expect(parsed.ok).toBe(true);
    expect(parsed.missing).toEqual([]);
    expect(parsed.title).toBe('Multi-AI Council Report');
    expect(parsed.seats).toHaveLength(2);
    expect(parsed.seats[0]).toMatchObject({
      id: 'seat-001',
      lens: 'Architectural',
      vantage: 'System Design',
    });
    expect(parsed.recommendedPlan).toContain('Extend deep-loop-runtime');
    expect(parsed.planConfidence).toBe(85);
  });

  it('parseCouncilReport returns missing sections when required fields are absent', () => {
    const markdown = '# Minimal Report\n\nNo composition here.';
    const parsed = parseCouncilReport(markdown);

    expect(parsed.ok).toBe(false);
    expect(parsed.missing).toContain('Council Composition');
    expect(parsed.missing).toContain('Per-seat sections');
    expect(parsed.missing).toContain('Recommended Plan');
    expect(parsed.missing).toContain('Plan Confidence');
  });

  it('buildMemorySavePayload creates a memory-save payload from parsed report', () => {
    const parsed = parseCouncilReport(councilReport());
    const payload = buildMemorySavePayload(parsed, '/path/to/packet');

    expect(payload).toMatchObject({
      topic: 'Multi-AI Council Report',
      spec_folder: '/path/to/packet',
      completion_status: 'complete',
    });
    expect(payload.decisions).toContain('Extend deep-loop-runtime with council primitives');
    expect(payload.decisions).toContain('Add cost guard validation');
  });

  it('renderArtifacts generates all artifact payloads with round metadata', () => {
    const parsed = parseCouncilReport(councilReport());
    const rendered = renderArtifacts(parsed, { round: 2, specFolder: '/path/to/packet' });

    expect(rendered.config).toContain('"current_round": 2');
    expect(rendered.strategy).toContain('## Purpose');
    expect(rendered.stateLog).toContain('"event":"round_start"');
    expect(rendered.stateLog).toContain('"round":2');
    expect(rendered.seats).toHaveLength(2);
    expect(rendered.seats[0].path).toMatch(/^seats\/round-002\/seat-001-/);
    expect(rendered.deliberation).toContain('## Council Composition');
    expect(rendered.councilReport).toContain('# Multi-AI Council Report');
  });

  it('writeConfig writes ai-council-config.json with scoped write guard', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const content = '{"test": true}';
      const path = writeConfig(packetSpecFolder, content);

      expect(path).toBe(join(packetSpecFolder, 'ai-council', 'ai-council-config.json'));
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toBe(content);
    });
  });

  it('writeConfig throws OUT_OF_SCOPE_WRITE for parent traversal', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      expect(() => writeConfig(packetSpecFolder, '{}', { audit: false })).not.toThrow();
    });
  });

  it('writeStrategyMd writes ai-council-strategy.md with scoped write guard', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const content = '# Strategy';
      const path = writeStrategyMd(packetSpecFolder, content);

      expect(path).toBe(join(packetSpecFolder, 'ai-council', 'ai-council-strategy.md'));
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toBe(content);
    });
  });

  it('writeStateJsonl writes ai-council-state.jsonl with scoped write guard', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const content = '{"event":"test"}\n';
      const path = writeStateJsonl(packetSpecFolder, content);

      expect(path).toBe(join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl'));
      expect(existsSync(path)).toBe(true);
      // writeStateJsonl persists the caller content, then appends an
      // artifact_written self-audit envelope to the same state log (audit !== false).
      const written = readFileSync(path, 'utf8');
      expect(written).toContain('{"event":"test"}');
      expect(written).toContain('"event":"artifact_written"');
    });
  });

  it('writeSeat writes seat artifacts under seats/ with scoped write guard', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const content = '# Seat Output';
      const path = writeSeat(packetSpecFolder, 'round-001/seat-001.md', content);

      expect(path).toBe(join(packetSpecFolder, 'ai-council', 'seats', 'round-001', 'seat-001.md'));
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toBe(content);
    });
  });

  it('writeSeat throws OUT_OF_SCOPE_WRITE for parent traversal in relative path', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      expect(() => writeSeat(packetSpecFolder, '../etc/passwd', 'content', { audit: false })).toThrow('OUT_OF_SCOPE_WRITE');
    });
  });

  it('writeDeliberation writes deliberation artifacts with scoped write guard', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const content = '# Deliberation';
      const path = writeDeliberation(packetSpecFolder, 'round-001.md', content);

      expect(path).toBe(join(packetSpecFolder, 'ai-council', 'deliberations', 'round-001.md'));
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toBe(content);
    });
  });

  it('writeReport writes council-report.md with scoped write guard', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const content = '# Council Report';
      const path = writeReport(packetSpecFolder, content);

      expect(path).toBe(join(packetSpecFolder, 'ai-council', 'council-report.md'));
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toBe(content);
    });
  });
});
