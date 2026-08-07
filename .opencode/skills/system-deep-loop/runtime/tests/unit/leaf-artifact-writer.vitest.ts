// ───────────────────────────────────────────────────────────────────
// MODULE: Read-Only-Leaf Artifact Writer Unit Tests
// ───────────────────────────────────────────────────────────────────
// A read-only codex leaf emits one JSON object as its final message; the
// writer authors the three per-iteration artifacts from it. These tests pin:
// the record schema written for the reducer, wrapper-owned route-proof
// stamping, narrative synthesis, and the all-or-nothing fail-closed contract
// (a malformed message writes nothing).

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  extractLeafPayload,
  assembleRecord,
  synthesizeNarrative,
  writeLeafArtifacts,
} from '../../lib/deep-loop/leaf-artifact-writer.js';
import type { LeafPublicationStage } from '../../lib/deep-loop/leaf-artifact-writer.js';

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
  dispatchedSlice: ['.opencode/skills/x/a.ts', '.opencode/skills/x/b.ts'],
  artifactEvidence: [
    { artifact: '.opencode/skills/x/a.ts', kind: 'content-digest', contentDigest: `sha256:${'a'.repeat(64)}` },
    { artifact: '.opencode/skills/x/b.ts', kind: 'content-digest', contentDigest: `sha256:${'b'.repeat(64)}` },
  ],
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
  it('writes all three artifacts from a nested {stateRecord, deltaFindings} payload', async () => {
    const p = newPacket();
    const msg = JSON.stringify({
      stateRecord: validRecord,
      deltaFindings: [{ type: 'finding', laneId: validRecord.laneId, finding: { severity: 'P2' } }],
    });
    const res = await writeLeafArtifacts(msg, { iteration: 1, ...p });
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

  it('accepts a top-level record (no stateRecord wrapper) and derives delta findings', async () => {
    const p = newPacket();
    const res = await writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 2, ...p });
    expect(res.ok).toBe(true);
    const deltaLines = readFileSync(p.deltaPath, 'utf8').trim().split('\n');
    // record + one finding derived from findingDetails
    expect(deltaLines).toHaveLength(2);
    expect(JSON.parse(deltaLines[1]).finding.severity).toBe('P2');
  });

  it('rejects a complete record whose checked artifacts have no evidence', async () => {
    const p = newPacket();
    const res = await writeLeafArtifacts(JSON.stringify({
      ...validRecord,
      artifactEvidence: [],
    }), { iteration: 1, ...p, dispatchedSlice: validRecord.dispatchedSlice });
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/evidence/);
    expect(existsSync(p.stateLogPath)).toBe(false);
  });

  it('accepts live-render target identities with measured adapter evidence', async () => {
    const p = newPacket();
    const target = { target: 'https://example.test/design', targetType: 'url' };
    const res = await writeLeafArtifacts(JSON.stringify({
      ...validRecord,
      artifactsChecked: [target],
      dispatchedSlice: [target],
      artifactEvidence: [{
        artifact: target,
        kind: 'adapter-check',
        checkReceipt: {
          measured: true,
          adapter: 'sk-design-live-render',
          measurements: { rendered: true, nodeCount: 12 },
        },
      }],
    }), { iteration: 1, ...p, dispatchedSlice: [target] });
    expect(res.ok).toBe(true);
    expect(res.record?.artifactsChecked).toEqual([target]);
  });
});

describe('writeLeafArtifacts — fail-closed', () => {
  it('writes nothing and reports failure on an unparseable message', async () => {
    const p = newPacket();
    const res = await writeLeafArtifacts('the audit went fine, trust me', { iteration: 1, ...p });
    expect(res.ok).toBe(false);
    expect(existsSync(p.stateLogPath)).toBe(false);
    expect(existsSync(p.deltaPath)).toBe(false);
    expect(existsSync(p.iterationMdPath)).toBe(false);
  });

  it('rejects a payload missing a required field, writing nothing', async () => {
    const p = newPacket();
    const { artifactsChecked, ...missing } = validRecord;
    const res = await writeLeafArtifacts(JSON.stringify(missing), { iteration: 1, ...p });
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/artifactsChecked/);
    expect(existsSync(p.stateLogPath)).toBe(false);
  });

  it('rejects an invalid status', async () => {
    const p = newPacket();
    const res = await writeLeafArtifacts(
      JSON.stringify({ ...validRecord, status: 'made-up' }),
      { iteration: 1, ...p },
    );
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/status/);
  });

  it.each([
    ['laneId', { laneId: 7 }],
    ['authority', { authority: false }],
    ['artifactClass', { artifactClass: ['code'] }],
    ['artifactsChecked', { artifactsChecked: ['ok', 3] }],
    ['findingsCount', { findingsCount: '1' }],
  ])('rejects a wrong-typed authoritative field and names %s', async (field, override) => {
    const p = newPacket();
    const res = await writeLeafArtifacts(JSON.stringify({ ...validRecord, ...override }), {
      iteration: 1,
      ...p,
    });
    expect(res.ok).toBe(false);
    expect(res.error).toContain(field);
    expect(existsSync(p.stateLogPath)).toBe(false);
    expect(existsSync(p.deltaPath)).toBe(false);
  });

  it.each([
    'staged',
    'narrative-published',
    'delta-published',
    'state-appended',
    'cleaned',
  ] as const)('recovers a crash injected after %s', async (crashStage: LeafPublicationStage) => {
    const p = newPacket();
    const first = await writeLeafArtifacts(JSON.stringify(validRecord), {
      iteration: 1,
      ...p,
      faultInjection: (stage) => {
        if (stage === crashStage) throw new Error(`injected crash at ${stage}`);
      },
    });
    expect(first.ok).toBe(false);

    const retry = await writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 1, ...p });
    expect(retry.ok).toBe(true);
    expect(existsSync(p.deltaPath)).toBe(true);
    expect(existsSync(`${p.deltaPath}.staging-1`)).toBe(false);
    expect(readFileSync(p.stateLogPath, 'utf8').trim().split('\n')).toHaveLength(1);
  });

  it('refuses to overwrite an existing (write-once) delta file', async () => {
    const p = newPacket();
    const first = await writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 1, ...p });
    expect(first.ok).toBe(true);
    const second = await writeLeafArtifacts(JSON.stringify(validRecord), { iteration: 1, ...p });
    expect(second.ok).toBe(false);
    expect(second.error).toMatch(/write-once/);
  });
});

describe('writeLeafArtifacts — cross-process single-winner claim', () => {
  it('serializes two processes racing to publish conflicting content for the same iteration', async () => {
    const p = newPacket();
    // Two genuinely different leaf outputs contend for the same iteration
    // slot; exactly one may win, the other must see a write-once conflict
    // rather than corrupt the winner's staged files.
    const messageA = JSON.stringify({ ...validRecord, findingsSummary: 'race-a' });
    const messageB = JSON.stringify({ ...validRecord, findingsSummary: 'race-b' });
    const runtimeRoot = resolve(import.meta.dirname, '../..');
    const moduleUrl = new URL('../../lib/deep-loop/leaf-artifact-writer.ts', import.meta.url).href;
    const barrierPath = join(dirname(p.deltaPath), 'go');
    mkdirSync(dirname(barrierPath), { recursive: true });

    const writerPath = join(dirname(barrierPath), 'race-writer.mjs');
    writeFileSync(
      writerPath,
      [
        "import fs from 'node:fs';",
        `const atomicModulePath = ${JSON.stringify(moduleUrl)};`,
        'const [, , messageArg, iterationMdPath, stateLogPath, deltaPath, barrierArg] = process.argv;',
        'const waitBuffer = new SharedArrayBuffer(4);',
        'const waitView = new Int32Array(waitBuffer);',
        'const deadline = Date.now() + 5000;',
        'while (!fs.existsSync(barrierArg)) {',
        "  if (Date.now() > deadline) throw new Error('barrier timeout');",
        '  Atomics.wait(waitView, 0, 0, 5);',
        '}',
        'const { writeLeafArtifacts } = await import(atomicModulePath);',
        'const result = await writeLeafArtifacts(messageArg, {',
        '  iteration: 1,',
        '  iterationMdPath,',
        '  stateLogPath,',
        '  deltaPath,',
        '});',
        "process.stdout.write(JSON.stringify({ ok: result.ok, error: result.error ?? null }) + '\\n');",
      ].join('\n'),
      'utf8',
    );

    const runChild = (message: string): Promise<{ ok: boolean; error: string | null }> => new Promise((resolvePromise, reject) => {
      const child = spawn(
        process.execPath,
        ['--import', 'tsx', writerPath, message, p.iterationMdPath, p.stateLogPath, p.deltaPath, barrierPath],
        { cwd: runtimeRoot, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
      );
      let stdout = '';
      let stderr = '';
      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      child.stdout.on('data', (chunk: string) => { stdout += chunk; });
      child.stderr.on('data', (chunk: string) => { stderr += chunk; });
      child.on('error', reject);
      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(stderr || `child exited ${code}`));
          return;
        }
        resolvePromise(JSON.parse(stdout.trim()));
      });
    });

    const children = [runChild(messageA), runChild(messageB)];
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
    writeFileSync(barrierPath, 'go', 'utf8');
    const results = await Promise.all(children);

    expect(results.filter((result) => result.ok)).toHaveLength(1);
    const losers = results.filter((result) => !result.ok);
    expect(losers).toHaveLength(1);
    expect(losers[0].error).toMatch(/write-once/);

    const deltaLines = readFileSync(p.deltaPath, 'utf8').trim().split('\n');
    expect(deltaLines).toHaveLength(2);
    const winningRecord = JSON.parse(deltaLines[0]);
    expect(['race-a', 'race-b']).toContain(winningRecord.findingsSummary);

    const stateLines = readFileSync(p.stateLogPath, 'utf8').trim().split('\n');
    expect(stateLines).toHaveLength(1);
    expect(JSON.parse(stateLines[0]).findingsSummary).toBe(winningRecord.findingsSummary);
    expect(existsSync(`${p.deltaPath}.staging-1`)).toBe(false);
  });
});
