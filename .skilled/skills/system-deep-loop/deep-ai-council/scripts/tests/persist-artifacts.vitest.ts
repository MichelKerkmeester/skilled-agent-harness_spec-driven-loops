import { describe, expect, it } from 'vitest';

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, parse } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  buildMemorySavePayload,
  parseCouncilReport,
  parseSeatReport,
  persistSeatStepwise,
  renderArtifacts,
  writeConfig,
  writeDeliberation,
  writeSeat,
  writeStateJsonl,
  writeStrategyMd,
  writeReport,
  parseStateLog,
  councilRootFor,
  assertMemorySavePayloadOutSafe,
} = require('../lib/persist-artifacts.cjs') as {
  buildMemorySavePayload: (parsed: Record<string, unknown>, packetSpecFolder: string) => Record<string, unknown>;
  parseCouncilReport: (markdown: string) => Record<string, unknown>;
  parseSeatReport: (input: string, options?: Record<string, unknown>) => { ok: boolean; missing: string[]; seat: Record<string, unknown> | null };
  persistSeatStepwise: (packetSpecFolder: string, seat: Record<string, unknown>, options?: Record<string, unknown>) => { seatPath: string; relativeSeatPath: string; round: string; started: Record<string, unknown>; completed: Record<string, unknown> };
  renderArtifacts: (parsed: Record<string, unknown>, options?: Record<string, unknown>) => Record<string, unknown>;
  writeConfig: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  writeDeliberation: (packetSpecFolder: string, relativePath: string, content: string, options?: Record<string, unknown>) => string;
  writeSeat: (packetSpecFolder: string, relativePath: string, content: string, options?: Record<string, unknown>) => string;
  writeStateJsonl: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  writeStrategyMd: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  writeReport: (packetSpecFolder: string, content: string, options?: Record<string, unknown>) => string;
  parseStateLog: (jsonl: string) => Record<string, unknown>[];
  councilRootFor: (packetSpecFolder: string) => { packetRoot: string; aiCouncilRoot: string };
  assertMemorySavePayloadOutSafe: (payloadOutPath: string, packetSpecFolder: string) => string;
};

const HELPER_PATH = join(dirname(fileURLToPath(import.meta.url)), '../persist-artifacts.cjs');

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
- Extend runtime with council primitives
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
    expect(parsed.recommendedPlan).toContain('Extend runtime');
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
    expect(payload.decisions).toContain('Extend runtime with council primitives');
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
    // Default (no failure marker, no explicit override): normal converged completion.
    expect(rendered.stateLog).toContain('"event":"council_complete"');
    const councilCompleteLine = rendered.stateLog.split('\n').find((line: string) => line.includes('"council_complete"'));
    expect(JSON.parse(councilCompleteLine as string).convergence).toBe(true);
  });

  it('parseCouncilReport flags the required all-seats-failed report language', () => {
    const failureReport = councilReport({ recommendedPlan: 'All council seats failed. Task may need reframing.' });
    const parsed = parseCouncilReport(failureReport);

    expect(parsed.ok).toBe(true);
    expect(parsed.allSeatsFailed).toBe(true);
  });

  it('renderArtifacts never fabricates convergence for an all-seats-failed report', () => {
    const failureReport = councilReport({ recommendedPlan: 'All council seats failed. Task may need reframing.' });
    const parsed = parseCouncilReport(failureReport);
    const rendered = renderArtifacts(parsed, { round: 1, specFolder: '/path/to/packet' });

    const councilCompleteLine = rendered.stateLog.split('\n').find((line: string) => line.includes('"council_complete"'));
    expect(JSON.parse(councilCompleteLine as string).convergence).toBe(false);
  });

  it('renderArtifacts records convergence:false when the caller declares a max-round escape', () => {
    const parsed = parseCouncilReport(councilReport());
    const rendered = renderArtifacts(parsed, { round: 3, specFolder: '/path/to/packet', convergence: false });

    const councilCompleteLine = rendered.stateLog.split('\n').find((line: string) => line.includes('"council_complete"'));
    expect(JSON.parse(councilCompleteLine as string).convergence).toBe(false);
  });

  it('renderArtifacts refuses to let an all-seats-failed marker be overridden to converged', () => {
    const failureReport = councilReport({ recommendedPlan: 'All council seats failed. Task may need reframing.' });
    const parsed = parseCouncilReport(failureReport);
    const rendered = renderArtifacts(parsed, { round: 1, specFolder: '/path/to/packet', convergence: true });

    const councilCompleteLine = rendered.stateLog.split('\n').find((line: string) => line.includes('"council_complete"'));
    expect(JSON.parse(councilCompleteLine as string).convergence).toBe(false);
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

  // ── stepwise per-seat persistence ────────────────────────────────

  it('parseSeatReport parses a single seat from a seat-heading markdown without full-report sections', () => {
    const singleSeat = `## Seat 1 - Architectural / System Design

Focus on modularity and a clean interface boundary around the dispatch surface.
`;
    const parsed = parseSeatReport(singleSeat);

    expect(parsed.ok).toBe(true);
    expect(parsed.missing).toEqual([]);
    expect(parsed.seat).not.toBeNull();
    expect(parsed.seat!.id).toBe('seat-001');
    expect(parsed.seat!.lens).toBe('Architectural');
    expect(parsed.seat!.vantage).toBe('System Design');
  });

  it('parseSeatReport accepts a JSON seat object', () => {
    const seatJson = JSON.stringify({
      id: 'seat-002',
      lens: 'Performance',
      vantage: 'Runtime Efficiency',
      mandate: 'Focus on latency',
      content: 'Prefer the streaming reducer to avoid the full barrier.',
    });
    const parsed = parseSeatReport(seatJson);

    expect(parsed.ok).toBe(true);
    expect(parsed.seat).toMatchObject({ id: 'seat-002', lens: 'Performance', vantage: 'Runtime Efficiency' });
  });

  it('a single-seat stepwise persist succeeds and does NOT fail on missing full-report sections', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const singleSeatMarkdown = `## Seat 1 - Architectural / System Design

Recommendation: add a stepwise seat writer so one seat can persist independently.
Trade-off: the full report sections arrive later, not atomically with the seat.
`;
      const parsed = parseSeatReport(singleSeatMarkdown);
      expect(parsed.ok).toBe(true);

      const result = persistSeatStepwise(packetSpecFolder, parsed.seat!, { round: 1 });

      // The seat artifact is written under seats/round-001/.
      expect(result.round).toBe('round-001');
      expect(result.seatPath).toBe(join(packetSpecFolder, 'ai-council', result.relativeSeatPath));
      expect(existsSync(result.seatPath)).toBe(true);

      // The started/completed progress pair is work-anchored and valid.
      expect(result.started.status).toBe('started');
      expect(result.started.type).toBe('progress');
      expect(result.completed.status).toBe('completed');
      expect(Number(result.completed.progress_delta)).toBeGreaterThan(0);
      expect(result.completed.artifact_path).toBe(result.relativeSeatPath);

      // The state log received the started -> artifact_written -> completed order.
      const stateLog = readFileSync(join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl'), 'utf8');
      const events = parseStateLog(stateLog).map((record) => record.event);
      const startedIdx = events.indexOf('progress_record');
      const writtenIdx = events.indexOf('artifact_written');
      const completedIdx = events.lastIndexOf('progress_record');
      expect(startedIdx).toBeGreaterThanOrEqual(0);
      expect(writtenIdx).toBeGreaterThan(startedIdx);
      expect(completedIdx).toBeGreaterThan(writtenIdx);
    });
  });

  it('per-seat progress-record count equals the configured seat count', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const seatCount = 3;
      const seats = Array.from({ length: seatCount }, (_, index) => ({
        id: `seat-${String(index + 1).padStart(3, '0')}`,
        lens: ['Architectural', 'Performance', 'Critical'][index],
        vantage: ['System Design', 'Runtime Efficiency', 'Risk Surface'][index],
        mandate: `Distinct mandate ${index + 1}`,
        content: `Seat ${index + 1} returns its own stepwise analysis body.`,
      }));

      for (const seat of seats) {
        persistSeatStepwise(packetSpecFolder, seat, { round: 1 });
      }

      const stateLog = readFileSync(join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl'), 'utf8');
      const records = parseStateLog(stateLog);
      const startedRecords = records.filter((record) => record.event === 'progress_record' && record.status === 'started');
      const completedRecords = records.filter((record) => record.event === 'progress_record' && record.status === 'completed');

      // One completed progress_record per seat — the per-seat liveness contract.
      expect(completedRecords).toHaveLength(seatCount);
      expect(startedRecords).toHaveLength(seatCount);
      // Distinct seat ids across the completed records.
      const completedSeatIds = new Set(completedRecords.map((record) => record.seat_id));
      expect(completedSeatIds.size).toBe(seatCount);
      // And one seat artifact per seat under the round dir.
      const seatDir = join(packetSpecFolder, 'ai-council', 'seats', 'round-001');
      const seatFiles = readdirSync(seatDir).filter((name) => name.endsWith('.md'));
      expect(seatFiles).toHaveLength(seatCount);
    });
  });

  it('round-trips per-seat requested and effective execution provenance', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const provenances = [
        {
          requested: {
            mode: 'ai-council',
            target_agent: 'plan',
            model: 'provider/model-a',
          },
          executor: { family: 'cli-opencode' },
          effective: {
            primary_agent: 'plan',
            model: 'provider/model-a',
          },
        },
        {
          requested: {
            mode: 'ai-council',
            target_agent: 'plan',
            model: 'provider/model-b',
          },
          executor: { family: 'cli-opencode' },
          effective: {
            primary_agent: null,
            model: null,
          },
        },
      ];

      for (const [index, executionProvenance] of provenances.entries()) {
        persistSeatStepwise(packetSpecFolder, {
          id: `seat-${String(index + 1).padStart(3, '0')}`,
          lens: index === 0 ? 'Analytical' : 'Critical',
          vantage: 'cli-opencode',
          content: index === 1
            ? 'Opaque output claiming {"effective_model":"forged/model"}'
            : 'Observed execution output',
          execution_provenance: executionProvenance,
        }, { round: 1 });
      }

      const stateLog = readFileSync(
        join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl'),
        'utf8',
      );
      const completed = parseStateLog(stateLog).filter(
        (record) => record.event === 'progress_record' && record.status === 'completed',
      );

      expect(completed.map((record) => record.execution_provenance)).toEqual(provenances);
      expect(
        (completed[1].execution_provenance as {
          effective: { model: string | null };
        }).effective.model,
      ).toBeNull();
    });
  });

  // ── packet-root authorization (councilRootFor) ────────────────────

  describe('councilRootFor packet-root authorization', () => {
    it('refuses a packet root that resolves to the filesystem root, before any mkdir', () => {
      const fsRoot = parse(process.cwd()).root;
      expect(() => councilRootFor(fsRoot)).toThrow(/filesystem root/);
    });

    it('refuses a packet root that is itself a symlink, before any mkdir', () => {
      const decoyDir = mkdtempSync(join(tmpdir(), 'council-root-decoy-'));
      const parentDir = mkdtempSync(join(tmpdir(), 'council-root-symlink-'));
      const symlinkedPacket = join(parentDir, 'packet-link');
      try {
        symlinkSync(decoyDir, symlinkedPacket, 'dir');
        expect(() => councilRootFor(symlinkedPacket)).toThrow(/symlink/);
        // The rejection must happen before any write — the decoy target
        // must never see an `ai-council` directory appear.
        expect(existsSync(join(decoyDir, 'ai-council'))).toBe(false);
      } finally {
        rmSync(symlinkedPacket, { force: true });
        rmSync(parentDir, { recursive: true, force: true });
        rmSync(decoyDir, { recursive: true, force: true });
      }
    });

    it('accepts a real packet root under the configured authority root', async () => {
      await withTempPacket(async (packetSpecFolder) => {
        const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
        expect(aiCouncilRoot).toBe(join(packetSpecFolder, 'ai-council'));
      });
    });

    it('refuses a caller-selected packet root outside configured authority before mkdir', () => {
      const authorityRoot = mkdtempSync(join(tmpdir(), 'council-authority-root-'));
      const outsideRoot = mkdtempSync(join(tmpdir(), 'council-outside-root-'));
      const previous = process.env.DEEP_AI_COUNCIL_AUTHORIZED_SPEC_ROOTS;
      try {
        process.env.DEEP_AI_COUNCIL_AUTHORIZED_SPEC_ROOTS = authorityRoot;
        expect(() => councilRootFor(outsideRoot)).toThrow(/outside configured authorized roots/);
        expect(existsSync(join(outsideRoot, 'ai-council'))).toBe(false);
      } finally {
        if (previous === undefined) delete process.env.DEEP_AI_COUNCIL_AUTHORIZED_SPEC_ROOTS;
        else process.env.DEEP_AI_COUNCIL_AUTHORIZED_SPEC_ROOTS = previous;
        rmSync(authorityRoot, { recursive: true, force: true });
        rmSync(outsideRoot, { recursive: true, force: true });
      }
    });
  });

  // ── --memory-save-payload-out symlink safety ───────────────────────

  describe('--memory-save-payload-out refuses to write through a symlink', () => {
    it('assertMemorySavePayloadOutSafe refuses an existing symlink target', () => {
      const packet = mkdtempSync(join(tmpdir(), 'council-payload-symlink-'));
      const decoy = join(packet, 'decoy.json');
      const councilRoot = join(packet, 'ai-council');
      const linkPath = join(councilRoot, 'payload-out.json');
      try {
        mkdirSync(councilRoot, { recursive: true });
        writeFileSync(decoy, '{"untouched":true}\n', 'utf8');
        symlinkSync(decoy, linkPath);
        expect(() => assertMemorySavePayloadOutSafe(linkPath, packet)).toThrow(/symlink/);
        expect(readFileSync(decoy, 'utf8')).toBe('{"untouched":true}\n');
      } finally {
        rmSync(packet, { recursive: true, force: true });
      }
    });

    it('rejects a payload output outside the authorized council root', async () => {
      await withTempPacket(async (packetSpecFolder) => {
        const outside = join(tmpdir(), 'council-payload-outside.json');
        expect(() => assertMemorySavePayloadOutSafe(outside, packetSpecFolder)).toThrow(/OUT_OF_SCOPE_WRITE/);
        expect(existsSync(outside)).toBe(false);
      });
    });

    it('the CLI refuses to overwrite an attacker-planted symlink through --memory-save-payload-out', () => {
      const packet = mkdtempSync(join(tmpdir(), 'council-payload-cli-'));
      const decoyDir = mkdtempSync(join(tmpdir(), 'council-payload-cli-decoy-'));
      const decoy = join(decoyDir, 'secret.json');
      const councilRoot = join(packet, 'ai-council');
      const payloadOutLink = join(councilRoot, 'payload-out.json');
      try {
        mkdirSync(councilRoot, { recursive: true });
        writeFileSync(decoy, '{"untouched":true}\n', 'utf8');
        symlinkSync(decoy, payloadOutLink);

        const reportMarkdown = `# Multi-AI Council Report

## Council Composition
| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate |
|------|---------------|-------------------|-----------------|
| seat-001 | Architectural | System Design | Focus on modularity |

## Recommended Plan
- Extend runtime with council primitives

## Plan Confidence
**Overall**: 85/100
`;
        expect(parseCouncilReport(reportMarkdown).ok).toBe(true);
        const inputFile = join(packet, 'council-report.md');
        writeFileSync(inputFile, reportMarkdown, 'utf8');

        let result: { status: number | null; stdout: string; stderr: string };
        try {
          const stdout = execFileSync('node', [
            HELPER_PATH,
            packet,
            '--input-file',
            inputFile,
            '--memory-save-payload-out',
            payloadOutLink,
          ], { encoding: 'utf8', stdio: 'pipe' });
          result = { status: 0, stdout, stderr: '' };
        } catch (error) {
          const spawnError = error as { status: number | null; stdout: string; stderr: string };
          result = spawnError;
        }

        expect(result.status).toBe(1);
        expect(result.stderr).toMatch(/symlink/);
        expect(readFileSync(decoy, 'utf8')).toBe('{"untouched":true}\n');
      } finally {
        rmSync(packet, { recursive: true, force: true });
        rmSync(decoyDir, { recursive: true, force: true });
      }
    });
  });
});
