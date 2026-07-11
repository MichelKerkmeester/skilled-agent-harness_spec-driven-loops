// ───────────────────────────────────────────────────────────────
// MODULE: code-graph freshness-core unit tests
// ───────────────────────────────────────────────────────────────
// Pins the three load-bearing guarantees (scan / defer-cold / defer-empty)
// plus the debounce, scope-filter, concurrency, and drain contracts that back
// them. Every scenario runs against a throwaway temp project directory so no
// test ever touches this repo's real .code-graph-readiness.json / owner
// marker / freshness state.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import freshnessCore from './freshness-core.cjs';

const DATABASE_RELATIVE_DIR = '.opencode/skills/system-code-graph/mcp_server/database';

function seedReadiness(projectDir: string, graphFreshness: string) {
  const dir = join(projectDir, DATABASE_RELATIVE_DIR);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, '.code-graph-readiness.json'), JSON.stringify({ graphFreshness }), 'utf8');
}

function seedOwner(projectDir: string, lastHeartbeatIso: string, ttlMs: number) {
  const dir = join(projectDir, DATABASE_RELATIVE_DIR);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, '.code-graph-owner.json'), JSON.stringify({ lastHeartbeatIso, ttlMs }), 'utf8');
}

function seedDebounceState(
  projectDir: string,
  sessionID: string,
  state: { pending: string[]; firstPendingAt: number | null; lastEditAt: number | null },
) {
  const { stateDir } = freshnessCore.resolveFreshnessPaths(projectDir);
  mkdirSync(stateDir, { recursive: true });
  const key = freshnessCore.sessionStateKey(sessionID);
  writeFileSync(join(stateDir, `${key}.json`), JSON.stringify(state), 'utf8');
}

function seedScanLock(projectDir: string) {
  const { stateDir, lockPath } = freshnessCore.resolveFreshnessPaths(projectDir);
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(lockPath, `${process.pid}\n`, 'utf8');
}

describe('freshness-core evaluateEdit', () => {
  let projectDir: string;
  const sessionID = 'test-session';

  beforeEach(() => {
    projectDir = mkdtempSync(join(tmpdir(), 'freshness-core-'));
  });

  afterEach(() => {
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('fires a warm-only incremental scan once the max-wait cap has elapsed (REQ-001, REQ-004)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('scan');
    expect(result.dispatch?.args).toContain('--warm-only');
    expect(result.dispatch?.args).toContain('{"incremental":true}');
    expect(result.pendingPaths).toEqual(expect.arrayContaining(['src/bar.ts', 'src/foo.ts']));
  });

  it('never wakes a cold daemon: a stale heartbeat defers with no dispatch (REQ-001)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now - 90000).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('defer-cold');
    expect(result.dispatch).toBeUndefined();
  });

  it('defers on an empty graph by default and does not dispatch (REQ-003)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'empty');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('defer-empty');
    expect(result.dispatch).toBeUndefined();
  });

  it('proceeds past the empty gate only when the bootstrap opt-in is set (REQ-003)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'empty');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: { MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP: '1' },
    });

    expect(result.decision).toBe('scan');
  });

  it('classifies an in-scope source file as in scope under default env (REQ-005)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'fresh');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID: 'scope-in',
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).not.toBe('skip');
  });

  it('classifies a skill doc as out of scope under default env (REQ-005)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'fresh');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);

    const result = freshnessCore.evaluateEdit({
      filePath: '.opencode/skills/x/SKILL.md',
      sessionID: 'scope-out',
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('skip');
    expect(result.reason).toMatch(/^excluded-dir:/);
  });

  it('widens scope for .opencode/skills once SPECKIT_CODE_GRAPH_INDEX_SKILLS is enabled (REQ-005)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'fresh');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);

    const result = freshnessCore.evaluateEdit({
      filePath: '.opencode/skills/x/SKILL.md',
      sessionID: 'scope-widened',
      now,
      projectDir,
      env: { SPECKIT_CODE_GRAPH_INDEX_SKILLS: 'true' },
    });

    // Widened scope clears the directory exclusion; the .md extension gate
    // still applies (a skill doc is not structural source either way).
    expect(result.decision).toBe('skip');
    expect(result.reason).toBe('non-source-extension');
  });

  it('fires once a quiet window has elapsed since the prior edit (REQ-004)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 3000,
      lastEditAt: now - 5000, // exceeds the default 4000ms quiet window
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('scan');
  });

  it('does not fire mid-burst, before either the quiet window or max-wait cap elapses (REQ-004)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 1000,
      lastEditAt: now - 500,
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('defer-debounce');
    expect(result.dispatch).toBeUndefined();
  });

  it('never fires when the pending set stays empty (REQ-004)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);

    const result = freshnessCore.evaluateEdit({
      filePath: '.opencode/skills/x/SKILL.md', // out-of-scope: nothing is ever added to pending
      sessionID: 'empty-pending',
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('skip');
    expect(result.dispatch).toBeUndefined();
  });

  it('defers on a concurrent in-flight scan lock (REQ-007)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });
    seedScanLock(projectDir);

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('defer-inflight');
    expect(result.dispatch).toBeUndefined();
  });

  it('treats missing/malformed markers as not-ready and never throws (fail-safe)', () => {
    const now = Date.now();

    expect(() => freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID: 'no-markers',
      now,
      projectDir,
      env: {},
    })).not.toThrow();

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID: 'no-markers',
      now,
      projectDir,
      env: {},
    });

    expect(result.decision).toBe('defer-empty');
    expect(result.dispatch).toBeUndefined();
  });

  it('honors the kill switch as a full no-op regardless of otherwise-scannable state', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });

    const result = freshnessCore.evaluateEdit({
      filePath: 'src/foo.ts',
      sessionID,
      now,
      projectDir,
      env: { MK_CODE_GRAPH_FRESHNESS_DISABLED: '1' },
    });

    expect(result.decision).toBe('skip');
    expect(result.reason).toBe('disabled');
    expect(result.dispatch).toBeUndefined();
  });

  it('never spawns and never writes stdout/stderr (grep-level guarantee, REQ-006)', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, sessionID, {
      pending: ['src/bar.ts'],
      firstPendingAt: now - 25000,
      lastEditAt: now - 25000,
    });

    let wrote = false;
    const origOut = process.stdout.write.bind(process.stdout);
    const origErr = process.stderr.write.bind(process.stderr);
    process.stdout.write = ((...args: unknown[]) => { wrote = true; return (origOut as (...a: unknown[]) => boolean)(...args); }) as typeof process.stdout.write;
    process.stderr.write = ((...args: unknown[]) => { wrote = true; return (origErr as (...a: unknown[]) => boolean)(...args); }) as typeof process.stderr.write;

    let result;
    try {
      result = freshnessCore.evaluateEdit({
        filePath: 'src/foo.ts',
        sessionID,
        now,
        projectDir,
        env: {},
      });
    } finally {
      process.stdout.write = origOut;
      process.stderr.write = origErr;
    }

    expect(result.decision).toBe('scan');
    expect(wrote).toBe(false);
  });
});

describe('freshness-core drainPending', () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = mkdtempSync(join(tmpdir(), 'freshness-core-drain-'));
  });

  afterEach(() => {
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('fires unconditionally on leftover pending state from a warm, non-empty graph', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    seedDebounceState(projectDir, 'crashed-session', {
      pending: ['src/leftover.ts'],
      firstPendingAt: now - 500,
      lastEditAt: now - 100,
    });

    const result = freshnessCore.drainPending({ projectDir, now, env: {} });

    expect(result.decision).toBe('scan');
    expect(result.pendingPaths).toContain('src/leftover.ts');
  });

  it('skips when nothing is pending', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now).toISOString(), 60000);

    const result = freshnessCore.drainPending({ projectDir, now, env: {} });

    expect(result.decision).toBe('skip');
    expect(result.pendingPaths).toEqual([]);
  });

  it('defers a cold daemon without clearing the pending state', () => {
    const now = Date.now();
    seedReadiness(projectDir, 'stale');
    seedOwner(projectDir, new Date(now - 90000).toISOString(), 60000);
    seedDebounceState(projectDir, 'crashed-session', {
      pending: ['src/leftover.ts'],
      firstPendingAt: now - 500,
      lastEditAt: now - 100,
    });

    const result = freshnessCore.drainPending({ projectDir, now, env: {} });

    expect(result.decision).toBe('defer-cold');
    expect(result.dispatch).toBeUndefined();
  });
});

describe('freshness-core probeDaemonWarm', () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = mkdtempSync(join(tmpdir(), 'freshness-core-probe-'));
  });

  afterEach(() => {
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('reports warm within the heartbeat ttl and cold past it', () => {
    const now = Date.now();
    seedOwner(projectDir, new Date(now).toISOString(), 60000);
    expect(freshnessCore.probeDaemonWarm({ projectDir, now, env: {} }).isWarm).toBe(true);

    seedOwner(projectDir, new Date(now - 90000).toISOString(), 60000);
    expect(freshnessCore.probeDaemonWarm({ projectDir, now, env: {} }).isWarm).toBe(false);
  });

  it('reports cold when the owner marker is missing', () => {
    const now = Date.now();
    expect(freshnessCore.probeDaemonWarm({ projectDir, now, env: {} }).isWarm).toBe(false);
  });
});
