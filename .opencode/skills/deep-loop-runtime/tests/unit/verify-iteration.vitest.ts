import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { verify, REASONS } = require('../../scripts/verify-iteration.cjs');

// Minimal valid review iteration record mirroring the leaf output contract:
// type=iteration + route-proof fields + the numeric iteration key.
function reviewRecord(iteration: number, overrides: Record<string, unknown> = {}) {
  return {
    type: 'iteration',
    iteration,
    mode: 'review',
    target_agent: 'deep-review',
    agent_definition_loaded: true,
    resolved_route: 'Resolved route: mode=review target_agent=deep-review',
    run: 'run-001',
    status: 'complete',
    ...overrides,
  };
}

function writeComplete(dir: string, iteration: number) {
  const nnn = String(iteration).padStart(3, '0');
  fs.mkdirSync(path.join(dir, 'iterations'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'deltas'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'iterations', `iteration-${nnn}.md`),
    `# Iteration ${iteration}\n\nFindings...\n\nReview verdict: PASS\n`,
  );
  fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(reviewRecord(iteration))}\n`);
  fs.writeFileSync(path.join(dir, 'deltas', `iter-${nnn}.jsonl`), `${JSON.stringify(reviewRecord(iteration))}\n`);
}

describe('verify-iteration leaf-reliability check', () => {
  let dir: string;
  beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-')); });
  afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }); });

  it('passes when all three artifacts + route-proof are present', () => {
    writeComplete(dir, 1);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(true);
  });

  it('supports a descriptive suffix on the narrative filename', () => {
    writeComplete(dir, 2);
    fs.renameSync(path.join(dir, 'iterations', 'iteration-002.md'), path.join(dir, 'iterations', 'iteration-002-focus-correctness.md'));
    const r = verify('review', dir, 2);
    expect(r.ok).toBe(true);
  });

  it('fails iteration_file_missing when the narrative is absent', () => {
    writeComplete(dir, 1);
    fs.rmSync(path.join(dir, 'iterations', 'iteration-001.md'));
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ITERATION_FILE_MISSING);
  });

  it('fails iteration_verdict_missing when the review verdict line is absent', () => {
    writeComplete(dir, 1);
    fs.writeFileSync(path.join(dir, 'iterations', 'iteration-001.md'), '# Iteration 1\n\nNo verdict here.\n');
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ITERATION_VERDICT_MISSING);
  });

  it('does NOT require a verdict line for context (different closing shape)', () => {
    const nnn = '001';
    fs.mkdirSync(path.join(dir, 'iterations'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'deltas'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'iterations', `iteration-${nnn}.md`), '# Context iteration\n\nContext gathered.\n');
    const rec = { type: 'iteration', iteration: 1, mode: 'context', target_agent: 'deep-context', agent_definition_loaded: true, resolved_route: 'Resolved route: mode=context target_agent=deep-context' };
    fs.writeFileSync(path.join(dir, 'deep-context-state.jsonl'), `${JSON.stringify(rec)}\n`);
    fs.writeFileSync(path.join(dir, 'deltas', `iter-${nnn}.jsonl`), `${JSON.stringify(rec)}\n`);
    const r = verify('context', dir, 1);
    expect(r.ok).toBe(true);
  });

  it('matches a context record keyed by run instead of iteration', () => {
    const nnn = '001';
    fs.mkdirSync(path.join(dir, 'iterations'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'deltas'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'iterations', `iteration-${nnn}.md`), '# Context\n\nGathered.\n');
    const rec = { type: 'iteration', run: 1, mode: 'context', target_agent: 'deep-context', agent_definition_loaded: true, resolved_route: 'Resolved route: mode=context target_agent=deep-context' };
    fs.writeFileSync(path.join(dir, 'deep-context-state.jsonl'), `${JSON.stringify(rec)}\n`);
    fs.writeFileSync(path.join(dir, 'deltas', `iter-${nnn}.jsonl`), `${JSON.stringify(rec)}\n`);
    const r = verify('context', dir, 1);
    expect(r.ok).toBe(true);
  });

  it('fails state_record_missing when no matching iteration record exists', () => {
    writeComplete(dir, 1);
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(reviewRecord(2))}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.STATE_RECORD_MISSING);
  });

  it('fails route_proof_missing when the record omits route-proof fields', () => {
    writeComplete(dir, 1);
    const bare = { type: 'iteration', iteration: 1, run: 'run-001', status: 'complete' };
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(bare)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ROUTE_PROOF_MISSING);
  });

  it('fails route_proof_mismatch when target_agent is wrong', () => {
    writeComplete(dir, 1);
    const wrong = reviewRecord(1, { target_agent: 'general' });
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(wrong)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ROUTE_PROOF_MISMATCH);
  });

  it('fails delta_file_missing when the delta is absent', () => {
    writeComplete(dir, 1);
    fs.rmSync(path.join(dir, 'deltas', 'iter-001.jsonl'));
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.DELTA_FILE_MISSING);
  });

  it('skips malformed JSONL lines without crashing', () => {
    writeComplete(dir, 1);
    fs.appendFileSync(path.join(dir, 'deep-review-state.jsonl'), 'not json at all\n');
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(true);
  });
});
