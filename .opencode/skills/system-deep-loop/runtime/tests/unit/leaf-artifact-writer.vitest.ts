// ───────────────────────────────────────────────────────────────────
// MODULE: Read-Only-Leaf Artifact Writer Unit Tests
// ───────────────────────────────────────────────────────────────────
// A read-only codex leaf emits one JSON object as its final message; the
// writer authors the three per-iteration artifacts from it. These tests pin:
// the record schema written for the reducer, wrapper-owned route-proof
// stamping, narrative synthesis, and the all-or-nothing fail-closed contract
// (a malformed message writes nothing).

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  extractLeafPayload,
  assembleRecord,
  synthesizeNarrative,
  writeLeafArtifacts,
} from '../../lib/deep-loop/leaf-artifact-writer.js';

const tempRoots: string[] = [];

function newPacket(): { iterationMdPath: string; stateLogPath: string; deltaPath: string } {
  const root = mkdtempSync(join(tmpdir(), 'leaf-writer-'));
  tempRoots.push(root);
  return {
    iterationMdPath: join(root, 'iterations', 'iteration-001.md'),
    stateLogPath: join(root, 'deep-alignment-state.jsonl'),
    deltaPath: join(root, 'deltas', 'iter-001.jsonl'),
  };
}

const validRecord = {
  status: 'complete',
  laneId: 'sk-code::code::.opencode/skills/x/',
  authority: 'sk-code',
  artifactClass: 'code',
  scope: { type: 'paths', values: ['.opencode/skills/x/'] },
  artifactsChecked: ['.opencode/skills/x/a.ts', '.opencode/skills/x/b.ts'],
  findingsCount: 1,
  findingsSummary: '1 P2',
  findingsNew: 1,
  findingDetails: [{ severity: 'P2', summary: 'minor drift' }],
  newFindingsRatio: 1,
  sessionId: '2026-07-23T00:00:00.000Z',
  generation: 1,
  lineageMode: 'new',
  timestamp: '2026-07-23T00:00:01.000Z',
  durationMs: 1234,
};

afterEach(() => {
  while (tempRoots.length) {
    const root = tempRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe('extractLeafPayload', () => {
  it('parses a raw JSON object', () => {
    expect(extractLeafPayload('{"a":1}')).toEqual({ a: 1 });
  });

  it('prefers the last fenced ```json block amid prose', () => {
    const msg = 'Here is my audit.\n```json\n{"stateRecord":{"status":"complete"}}\n```\nDone.';
    expect(extractLeafPayload(msg)).toEqual({ stateRecord: { status: 'complete' } });
  });

  it('recovers a trailing object when there is leading prose', () => {
    expect(extractLeafPayload('Audit summary follows: {"status":"complete"}')).toEqual({
      status: 'complete',
    });
  });

  it('returns null when nothing parses', () => {
    expect(extractLeafPayload('no json here at all')).toBeNull();
    expect(extractLeafPayload('')).toBeNull();
  });
});

describe('assembleRecord — route-proof invariants are wrapper-owned', () => {
  it('stamps the route-proof fields and iteration, overriding the leaf', () => {
    const record = assembleRecord(
      { ...validRecord, target_agent: 'IMPOSTER', mode: 'wrong', iteration: 99 },
      3,
    );
    expect(record.type).toBe('iteration');
    expect(record.target_agent).toBe('deep-alignment');
    expect(record.mode).toBe('alignment');
    expect(record.agent_definition_loaded).toBe(true);
    expect(record.resolved_route).toBe(
      'Resolved route: mode=alignment target_agent=deep-alignment',
    );
    expect(record.iteration).toBe(3);
    // Non-route-proof audit data is preserved from the leaf.
    expect(record.artifactsChecked).toEqual(validRecord.artifactsChecked);
  });
});

describe('synthesizeNarrative', () => {
  it('renders a human-facing markdown with the findings by severity', () => {
    const md = synthesizeNarrative(assembleRecord(validRecord, 1));
    expect(md).toContain('# Alignment Iteration 1');
    expect(md).toContain('minor drift');
    expect(md).toContain('Artifacts Checked');
  });
});

describe('writeLeafArtifacts — happy path', () => {
  it('writes all three artifacts from a nested {stateRecord, deltaFindings} payload', () => {
    const p = newPacket();
    const msg = JSON.stringify({
      stateRecord: validRecord,
      deltaFindings: [{ type: 'finding', laneId: validRecord.laneId, finding: { severity: 'P2' } }],
    });
    const res = writeLeafArtifacts(msg, { iteration: 1, ...p });
    expect(res.ok).toBe(true);

    // State log: exactly one canonical record line with route-proof.
    const stateLines = readFileSync(p.stateLogPath, 'utf8').trim().split('\n');
    expect(stateLines).toHaveLength(1);
    const rec = JSON.parse(stateLines[0]);
    expect(rec.type).toBe('iteration');
    expect(rec.target_agent).toBe('deep-alignment');
    expect(rec.iteration).toBe(1);

    // Delta: record line first, then one finding line.
    const deltaLines = readFileSync(p.deltaPath, 'utf8').trim().split('\n');
    expect(deltaLines).toHaveLength(2);
    expect(JSON.parse(deltaLines[0]).type).toBe('iteration');
    expect(JSON.parse(deltaLines[1]).type).toBe('finding');

    // Narrative markdown exists.
    expect(existsSync(p.iterationMdPath)).toBe(true);
  });

  it('accepts a top-level record (no stateRecord wrapper) and derives delta findings', () => {
    const p = newPacket();
    const res = writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 2, ...p });
    expect(res.ok).toBe(true);
    const deltaLines = readFileSync(p.deltaPath, 'utf8').trim().split('\n');
    // record + one finding derived from findingDetails
    expect(deltaLines).toHaveLength(2);
    expect(JSON.parse(deltaLines[1]).finding.severity).toBe('P2');
  });
});

describe('writeLeafArtifacts — fail-closed', () => {
  it('writes nothing and reports failure on an unparseable message', () => {
    const p = newPacket();
    const res = writeLeafArtifacts('the audit went fine, trust me', { iteration: 1, ...p });
    expect(res.ok).toBe(false);
    expect(existsSync(p.stateLogPath)).toBe(false);
    expect(existsSync(p.deltaPath)).toBe(false);
    expect(existsSync(p.iterationMdPath)).toBe(false);
  });

  it('rejects a payload missing a required field, writing nothing', () => {
    const p = newPacket();
    const { artifactsChecked, ...missing } = validRecord;
    const res = writeLeafArtifacts(JSON.stringify(missing), { iteration: 1, ...p });
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/artifactsChecked/);
    expect(existsSync(p.stateLogPath)).toBe(false);
  });

  it('rejects an invalid status', () => {
    const p = newPacket();
    const res = writeLeafArtifacts(
      JSON.stringify({ ...validRecord, status: 'made-up' }),
      { iteration: 1, ...p },
    );
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/status/);
  });

  it('refuses to overwrite an existing (write-once) delta file', () => {
    const p = newPacket();
    const first = writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 1, ...p });
    expect(first.ok).toBe(true);
    const second = writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 1, ...p });
    expect(second.ok).toBe(false);
    expect(second.error).toMatch(/write-once/);
  });
});
