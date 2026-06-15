import { afterEach, describe, expect, it } from 'vitest';

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  derivePayload,
  parseJsonl,
  main,
} = require('../replay-graph-from-artifacts.cjs') as {
  derivePayload: (specFolder: string, sessionId: string, events: Array<Record<string, unknown>>) => { specFolder: string; sessionId: string; nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>> };
  parseJsonl: (filePath: string) => Array<Record<string, unknown>>;
  main: (argv?: string[]) => number;
};

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testDir, '..', '..', '..', '..', '..');
const cleanupNamespaces: Array<{ specFolder: string; sessionId: string }> = [];

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(
  run: (packetSpecFolder: string) => void | Promise<void>,
  options: { insideRepo?: boolean } = {},
): Promise<void> {
  const tempParent = options.insideRepo ? repoRoot : tmpdir();
  const tempDir = mkdtempSync(join(tempParent, 'council-replay-graph-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function writeCouncilState(packetSpecFolder: string, events: Array<Record<string, unknown>>): void {
  const councilRoot = join(packetSpecFolder, 'ai-council');
  mkdirSync(councilRoot, { recursive: true });
  writeFileSync(
    join(councilRoot, 'ai-council-state.jsonl'),
    events.map((event) => JSON.stringify(event)).join('\n') + '\n',
  );
}

function captureOutput(run: () => number): { exitCode: number; stdout: string; stderr: string } {
  const originalStdoutWrite = process.stdout.write;
  const originalStderrWrite = process.stderr.write;
  let stdout = '';
  let stderr = '';
  process.stdout.write = ((chunk: unknown) => {
    stdout += String(chunk);
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: unknown) => {
    stderr += String(chunk);
    return true;
  }) as typeof process.stderr.write;
  try {
    return { exitCode: run(), stdout, stderr };
  } finally {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
  }
}

afterEach(async () => {
  const db = await import('../../../../deep-loop-runtime/lib/council/council-graph-db.js');
  while (cleanupNamespaces.length > 0) {
    const namespace = cleanupNamespaces.pop();
    if (namespace) {
      db.cleanupNamespace(namespace);
    }
  }
  db.closeDb();
  delete process.env.DEEP_AI_COUNCIL_REPLAY_UPSERT_SCRIPT;
});

describe('deep-ai-council replay-graph-from-artifacts', () => {
  it('parseJsonl parses JSONL file into event array', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const filePath = join(packetSpecFolder, 'state.jsonl');
      const events = [
        { event: 'round_start', round: 1, seats: ['seat-001', 'seat-002'] },
        { event: 'seat_returned', round: 1, seat: 'seat-001', status: 'ok' },
        { event: 'council_complete', timestamp: '2026-05-24T12:00:00.000Z' },
      ];
      writeFileSync(filePath, events.map((e) => JSON.stringify(e)).join('\n') + '\n');

      const parsed = parseJsonl(filePath);
      expect(parsed).toHaveLength(3);
      expect(parsed[0].event).toBe('round_start');
      expect(parsed[1].event).toBe('seat_returned');
      expect(parsed[2].event).toBe('council_complete');
    });
  });

  it('parseJsonl throws for malformed JSON lines', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const filePath = join(packetSpecFolder, 'state.jsonl');
      writeFileSync(filePath, 'invalid json\n{"valid": true}\n');

      expect(() => parseJsonl(filePath)).toThrow('Malformed JSONL');
    });
  });

  it('parseJsonl throws for non-object lines', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const filePath = join(packetSpecFolder, 'state.jsonl');
      writeFileSync(filePath, '["array", "not", "object"]\n');

      expect(() => parseJsonl(filePath)).toThrow('line is not a JSON object');
    });
  });

  it('derivePayload creates council runtime graph payload from events', () => {
    const events = [
      { event: 'round_start', round: 1, seats: ['seat-001', 'seat-002'] },
      { event: 'seat_returned', round: 1, seat: 'seat-001', status: 'ok' },
    ];
    const payload = derivePayload('/spec/folder', 'session-001', events);

    expect(payload).toMatchObject({
      specFolder: '/spec/folder',
      sessionId: 'session-001',
    });
    expect(Array.isArray(payload.nodes)).toBe(true);
    expect(Array.isArray(payload.edges)).toBe(true);
  });

  it('derivePayload creates SESSION node', () => {
    const payload = derivePayload('/spec/folder', 'session-001', []);
    const sessionNode = payload.nodes.find((n: Record<string, unknown>) => n.kind === 'SESSION');
    expect(sessionNode).toBeDefined();
    expect(sessionNode.id).toBe('session:session-001');
    expect(sessionNode.name).toBe('Council session session-001');
  });

  it('derivePayload creates ROUND nodes with DERIVES_FROM edges', () => {
    const events = [
      { event: 'round_start', round: 1, seats: ['seat-001'] },
    ];
    const payload = derivePayload('/spec/folder', 'session-001', events);

    const roundNode = payload.nodes.find((n: Record<string, unknown>) => n.kind === 'ROUND');
    expect(roundNode).toBeDefined();
    expect(roundNode.id).toBe('round:round-001');

    const derivesEdge = payload.edges.find((e: Record<string, unknown>) => e.relation === 'DERIVES_FROM');
    expect(derivesEdge).toBeDefined();
    expect(derivesEdge.sourceId).toBe('round:round-001');
    expect(derivesEdge.targetId).toBe('session:session-001');
  });

  it('derivePayload creates SEAT nodes with PARTICIPATES_IN edges', () => {
    const events = [
      { event: 'round_start', round: 1, seats: ['seat-001', 'seat-002'] },
    ];
    const payload = derivePayload('/spec/folder', 'session-001', events);

    const seatNodes = payload.nodes.filter((n: Record<string, unknown>) => n.kind === 'SEAT');
    expect(seatNodes).toHaveLength(2);

    const participateEdges = payload.edges.filter((e: Record<string, unknown>) => e.relation === 'PARTICIPATES_IN');
    expect(participateEdges).toHaveLength(2);
  });

  it('derivePayload creates CLAIM/EVIDENCE nodes from event properties', () => {
    const events = [
      {
        event: 'seat_returned',
        round: 1,
        seat: 'seat-001',
        claims: [{ text: 'Test claim' }],
        evidence: [{ summary: 'Test evidence' }],
      },
    ];
    const payload = derivePayload('/spec/folder', 'session-001', events);

    const claimNode = payload.nodes.find((n: Record<string, unknown>) => n.kind === 'CLAIM');
    const evidenceNode = payload.nodes.find((n: Record<string, unknown>) => n.kind === 'EVIDENCE');
    expect(claimNode).toBeDefined();
    expect(evidenceNode).toBeDefined();
  });

  it('derivePayload filters edges to valid node references only', () => {
    const events = [
      { event: 'round_start', round: 1, seats: ['seat-001'] },
      {
        event: 'seat_returned',
        round: 1,
        seat: 'seat-001',
        claims: [{ text: 'Test', supports: 'nonexistent-target' }],
      },
    ];
    const payload = derivePayload('/spec/folder', 'session-001', events);

    const edgesToNonexistent = payload.edges.filter((e: Record<string, unknown>) => e.targetId === 'nonexistent-target');
    expect(edgesToNonexistent).toHaveLength(0);
  });

  it('derivePayload skips events with mismatched session_id', () => {
    const events = [
      { event: 'round_start', round: 1, session_id: 'other-session', seats: ['seat-001'] },
      { event: 'round_start', round: 2, session_id: 'session-001', seats: ['seat-002'] },
    ];
    const payload = derivePayload('/spec/folder', 'session-001', events);

    const roundNodes = payload.nodes.filter((n: Record<string, unknown>) => n.kind === 'ROUND');
    expect(roundNodes).toHaveLength(1);
    expect(roundNodes[0].id).toBe('round:round-002');
  });

  it('main returns 0 with --help flag', () => {
    const exitCode = main(['--help']);
    expect(exitCode).toBe(0);
  });

  it('main returns 1 for missing required arguments', () => {
    const exitCode = main(['--spec-folder', '/path']);
    expect(exitCode).toBe(1);
  });

  it('main returns 1 for unknown arguments', () => {
    const exitCode = main(['--unknown', 'value']);
    expect(exitCode).toBe(1);
  });

  it('main returns 1 for missing state file', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const exitCode = main(['--spec-folder', packetSpecFolder, '--session-id', 'session-001']);
      expect(exitCode).toBe(1);
    });
  });

  it('main supports --dry-run and writes the derived payload JSON to stdout', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      writeCouncilState(packetSpecFolder, [{ event: 'round_start', round: 1, seats: ['seat-001'] }]);

      const { exitCode, stdout, stderr } = captureOutput(() => main(['--spec-folder', packetSpecFolder, '--session-id', 'session-001', '--dry-run']));
      expect(exitCode, stderr || stdout).toBe(0);
      const payload = JSON.parse(stdout) as { specFolder: string; sessionId: string; nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>> };
      expect(payload).toMatchObject({
        specFolder: packetSpecFolder,
        sessionId: 'session-001',
      });
      expect(payload.nodes.some((node) => node.kind === 'SESSION')).toBe(true);
      expect(payload.edges.some((edge) => edge.relation === 'DERIVES_FROM')).toBe(true);
    });
  });

  it('main writes derived graph rows through the runtime council CLI by default', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const sessionId = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      cleanupNamespaces.push({ specFolder: packetSpecFolder, sessionId });
      writeCouncilState(packetSpecFolder, [{ event: 'round_start', round: 1, seats: ['seat-001'] }]);

      const { exitCode, stdout, stderr } = captureOutput(() => main(['--spec-folder', packetSpecFolder, '--session-id', sessionId]));
      expect(exitCode, stderr || stdout).toBe(0);
      expect(stderr).toBe('');
      const upsertResult = JSON.parse(stdout.trim()) as { status: string; data: { insertedNodes: number; insertedEdges: number } };
      expect(upsertResult).toMatchObject({ status: 'ok' });
      expect(upsertResult.data.insertedNodes).toBeGreaterThan(0);

      const db = await import('../../../../deep-loop-runtime/lib/council/council-graph-db.js');
      const stats = db.getStats(packetSpecFolder, sessionId);
      expect(stats.totalNodes).toBeGreaterThan(0);
      expect(stats.totalEdges).toBeGreaterThan(0);
    }, { insideRepo: true });
  });

  it('main propagates runtime CLI child failures', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      writeCouncilState(packetSpecFolder, [{ event: 'round_start', round: 1, seats: ['seat-001'] }]);
      process.env.DEEP_AI_COUNCIL_REPLAY_UPSERT_SCRIPT = join(packetSpecFolder, 'missing-upsert.cjs');

      const { exitCode, stderr } = captureOutput(() => main(['--spec-folder', packetSpecFolder, '--session-id', 'session-001']));
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Runtime council graph upsert failed with exit code 1');
    }, { insideRepo: true });
  });
});
