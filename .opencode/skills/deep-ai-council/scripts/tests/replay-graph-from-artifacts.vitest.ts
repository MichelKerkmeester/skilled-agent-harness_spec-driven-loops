import { describe, expect, it } from 'vitest';

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(run: (packetSpecFolder: string) => void | Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-replay-graph-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  });
}

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

  it('derivePayload creates council_graph_upsert payload from events', () => {
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

  it('main derives payload and writes JSON to stdout for valid input', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const statePath = join(councilRoot, 'ai-council-state.jsonl');
      writeFileSync(statePath, JSON.stringify({ event: 'round_start', round: 1, seats: ['seat-001'] }) + '\n');

      const exitCode = main(['--spec-folder', packetSpecFolder, '--session-id', 'session-001']);
      expect(exitCode).toBe(0);
    });
  });

  it('main supports --dry-run flag', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const statePath = join(councilRoot, 'ai-council-state.jsonl');
      writeFileSync(statePath, JSON.stringify({ event: 'round_start', round: 1, seats: ['seat-001'] }) + '\n');

      const exitCode = main(['--spec-folder', packetSpecFolder, '--session-id', 'session-001', '--dry-run']);
      expect(exitCode).toBe(0);
    });
  });
});
