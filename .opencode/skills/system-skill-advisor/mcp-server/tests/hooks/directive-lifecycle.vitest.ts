// ───────────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Delivery core tests
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmodSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DIRECTIVE_LIFECYCLE_DEDUP_ENV,
  DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
  DIRECTIVE_LIFECYCLE_STATE_DIR_ENV,
  advanceDirectiveLifecycleBoundary,
  decideDirectiveLifecycleDelivery,
  defaultDirectiveLifecycleStore,
  FileDirectiveLifecycleStore,
  InMemoryDirectiveLifecycleStore,
  isDirectiveLifecycleDedupEnabled,
  resetDefaultDirectiveLifecycleStore,
  splitDirectiveBrief,
} from '../../../hooks/lib/directive-lifecycle.js';

// Mirrors the real advisor brief shape: a per-turn "Advisor: …" route line,
// then the three constant directives under the "\nDirectives:" separator.
const HEAD = 'Advisor: live; use sk-code 0.91/0.23 pass.';
const DIRECTIVES =
  '\nDirectives:\n- Comment hygiene [HARD BLOCK]: never embed ids\n- Governor: lead with the result\n- Proof over appearance: only real command output counts';
const FULL = `${HEAD}${DIRECTIVES}`;
// A brief whose directive text changed (e.g. a redeploy edited a directive).
const FULL_V2 = `${HEAD}${DIRECTIVES.replace('lead with the result', 'lead with the verdict')}`;
// A different route line, same directive block (a new recommendation).
const FULL_ROUTE_V2 = `Advisor: stale; use cli-pi 0.95/0.20 pass.${DIRECTIVES}`;
// Advisor-failure fallback: directives only, no advisor head to keep.
const FALLBACK = 'Directives:\n- Comment hygiene [HARD BLOCK]: never embed ids';

const PROJECT_CWD = process.cwd();
const ORIGINAL_STATE_DIR = process.env[DIRECTIVE_LIFECYCLE_STATE_DIR_ENV];
const CONTRACT_VECTORS = JSON.parse(readFileSync(resolve(
  import.meta.dirname,
  '../../../hooks/lib/directive-lifecycle-vectors.json',
), 'utf8')) as {
  vectors: Array<{
    name: string;
    identity: { sessionID?: unknown; session?: { id?: unknown }; sessionIdentityAmbiguous?: boolean };
    steps: string[];
    expected: string[];
  }>;
};

const TRANSCRIPT_PATH = '/sessions/s1.jsonl';

function makeState() {
  return new InMemoryDirectiveLifecycleStore();
}

function confirmed(state: InMemoryDirectiveLifecycleStore, overrides: Record<string, unknown> = {}) {
  return {
    state,
    sessionId: 's1',
    sessionConfirmed: true,
    transcriptPath: TRANSCRIPT_PATH,
    transcriptBytes: 100,
    ...overrides,
  };
}

function decide(context: string, overrides: Record<string, unknown> = {}) {
  return decideDirectiveLifecycleDelivery(context, confirmed(makeState(), {
    enabled: true,
    ...overrides,
  }));
}

function durableRecord(store: FileDirectiveLifecycleStore, sessionId: string, bytes = 100) {
  const clock = store.clock(sessionId);
  if (!clock) throw new Error('secure store clock unavailable');
  return {
    schemaVersion: DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
    directives: DIRECTIVES,
    transcriptPath: '/t.jsonl',
    transcriptHighWaterBytes: bytes,
    ...clock,
  };
}

describe('directive-lifecycle decision', () => {
  it('delivers the full brief on the first message of a session', () => {
    expect(decide(FULL)).toEqual({ reducedContext: null, suppressed: false });
  });

  it('keeps the route line on a proven same-content repeat', () => {
    const state = makeState();
    const first = decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    const second = decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(first.suppressed).toBe(false);
    expect(second).toEqual({ reducedContext: HEAD, suppressed: true });
  });

  it('re-delivers changed policy and then suppresses its identical repeat', () => {
    const state = makeState();
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL_V2, confirmed(state)).suppressed).toBe(false);
    expect(decideDirectiveLifecycleDelivery(FULL_V2, confirmed(state))).toEqual({
      reducedContext: HEAD,
      suppressed: true,
    });
  });

  it('suppresses when only the dynamic route line changes', () => {
    const state = makeState();
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL_ROUTE_V2, confirmed(state))).toEqual({
      reducedContext: 'Advisor: stale; use cli-pi 0.95/0.20 pass.',
      suppressed: true,
    });
  });

  it('re-delivers on every explicit lifecycle boundary', () => {
    for (const event of ['startup', 'resume', 'compact', 'clear']) {
      const state = makeState();
      decideDirectiveLifecycleDelivery(FULL, confirmed(state));
      expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { lifecycleEvent: event })).suppressed).toBe(false);
      expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state)).suppressed).toBe(true);
    }
  });

  it('re-delivers when the transcript path changes or its size shrinks', () => {
    const state = makeState();
    decideDirectiveLifecycleDelivery(FULL, confirmed(state, { transcriptBytes: 5_000 }));
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { transcriptBytes: 900 })).suppressed).toBe(false);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, {
      transcriptPath: '/sessions/new.jsonl',
      transcriptBytes: 6_000,
    })).suppressed).toBe(false);
  });

  it('advances the high-water mark before allowing reduced delivery', () => {
    const state = makeState();
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { transcriptBytes: 5_000 })).suppressed).toBe(false);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { transcriptBytes: 10_000 })).suppressed).toBe(true);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { transcriptBytes: 7_000 })).suppressed).toBe(false);
  });

  it('fails open when transcript evidence is absent or becomes unavailable', () => {
    const state = makeState();
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, {
      transcriptPath: null,
      transcriptBytes: null,
    })).suppressed).toBe(false);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, {
      transcriptPath: null,
      transcriptBytes: null,
    })).suppressed).toBe(false);
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, {
      transcriptPath: null,
      transcriptBytes: null,
    })).suppressed).toBe(false);
  });

  it('re-delivers after identified and unidentified host boundaries', () => {
    const state = makeState();
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state)).suppressed).toBe(true);
    expect(advanceDirectiveLifecycleBoundary(state, 's1')).toBe(true);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state)).suppressed).toBe(false);
    expect(advanceDirectiveLifecycleBoundary(state, null)).toBe(true);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state)).suppressed).toBe(false);
  });

  it('never suppresses unknown or unconfirmed sessions', () => {
    const state = makeState();
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { sessionId: undefined })).suppressed).toBe(false);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { sessionConfirmed: false })).suppressed).toBe(false);
  });

  it('never suppresses fallback policy or kill-switch delivery', () => {
    const state = makeState();
    expect(decideDirectiveLifecycleDelivery(FALLBACK, confirmed(state)).suppressed).toBe(false);
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { enabled: false })).suppressed).toBe(false);
  });

  it('isolates state across sessions', () => {
    const state = makeState();
    decideDirectiveLifecycleDelivery(FULL, confirmed(state));
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state, { sessionId: 's2' })).suppressed).toBe(false);
    expect(decideDirectiveLifecycleDelivery(FULL, confirmed(state)).suppressed).toBe(true);
  });

  it('matches the shared cross-adapter contract vectors', () => {
    for (const vector of CONTRACT_VECTORS.vectors) {
      const state = makeState();
      const observed: string[] = [];
      let transcriptBytes = 100;
      for (const step of vector.steps) {
        if (step === 'compact') {
          advanceDirectiveLifecycleBoundary(
            state,
            typeof vector.identity.sessionID === 'string' ? vector.identity.sessionID : null,
          );
          continue;
        }
        const top = vector.identity.sessionID;
        const nested = vector.identity.session?.id;
        const identityConfirmed = typeof top === 'string'
          && top.length > 0
          && nested !== undefined
          && nested !== top
          ? false
          : typeof top === 'string' && vector.identity.sessionIdentityAmbiguous !== true;
        const decision = decideDirectiveLifecycleDelivery(FULL, confirmed(state, {
          sessionId: typeof top === 'string' ? top : undefined,
          sessionConfirmed: identityConfirmed,
          transcriptBytes,
        }));
        observed.push(decision.suppressed ? 'route-only' : 'full');
        transcriptBytes += 1;
      }
      expect(observed, vector.name).toEqual(vector.expected);
    }
  });

  it('recognizes only reducible advisor-plus-policy briefs', () => {
    expect(splitDirectiveBrief('Advisor: live; use sk-code 0.91/0.23 pass.')).toBeNull();
    expect(splitDirectiveBrief(FALLBACK)).toBeNull();
    expect(splitDirectiveBrief(FULL)).toEqual({ head: HEAD, directives: DIRECTIVES });
  });
});

describe('directive-lifecycle kill-switch env', () => {
  const original = process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];

  afterEach(() => {
    if (original === undefined) {
      delete process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];
    } else {
      process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV] = original;
    }
  });

  it('is on by default', () => {
    delete process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];
    expect(isDirectiveLifecycleDedupEnabled()).toBe(true);
  });

  it('turns off for 0/false/off/no and stays on for anything else', () => {
    for (const off of ['0', 'false', 'off', 'no', 'OFF']) {
      process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV] = off;
      expect(isDirectiveLifecycleDedupEnabled()).toBe(false);
    }
    for (const on of ['1', 'true', 'yes', 'anything-else']) {
      process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV] = on;
      expect(isDirectiveLifecycleDedupEnabled()).toBe(true);
    }
  });
});

describe('FileDirectiveLifecycleStore', () => {
  let dir = '';
  let outside = '';

  afterEach(() => {
    new FileDirectiveLifecycleStore({ baseDir: dir || join(tmpdir(), 'directive-lifecycle-unused') }).clearAll();
    if (dir) rmSync(dir, { recursive: true, force: true });
    if (outside) rmSync(outside, { recursive: true, force: true });
    dir = '';
    outside = '';
    if (ORIGINAL_STATE_DIR === undefined) delete process.env[DIRECTIVE_LIFECYCLE_STATE_DIR_ENV];
    else process.env[DIRECTIVE_LIFECYCLE_STATE_DIR_ENV] = ORIGINAL_STATE_DIR;
    resetDefaultDirectiveLifecycleStore();
  });

  it('round-trips versioned records and isolates sessions', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    const store = new FileDirectiveLifecycleStore({ baseDir: dir });
    const record = durableRecord(store, 's1');
    expect(store.set('s1', record)).toBe(true);
    expect(store.get('s1')).toEqual(record);
    expect(store.get('s2')).toBeNull();
    store.clear('s1');
    expect(store.get('s1')).toBeNull();
  });

  it('persists high-water and clock state across process-like instances', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    const writer = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(writer.set('s1', durableRecord(writer, 's1'))).toBe(true);
    const reader = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(decideDirectiveLifecycleDelivery(FULL, {
      state: reader,
      sessionId: 's1',
      sessionConfirmed: true,
      transcriptPath: '/t.jsonl',
      transcriptBytes: 100,
    })).toEqual({ reducedContext: HEAD, suppressed: true });
    expect(reader.advanceGeneration()).toBe(true);
    expect(decideDirectiveLifecycleDelivery(FULL, {
      state: writer,
      sessionId: 's1',
      sessionConfirmed: true,
      transcriptPath: '/t.jsonl',
      transcriptBytes: 101,
    }).suppressed).toBe(false);
  });

  it('rejects corrupt, permissive, and multiply-linked records', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    const store = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(store.set('s1', durableRecord(store, 's1'))).toBe(true);
    const path = storePathFor(dir);
    writeFileSync(path, '{not-json', { mode: 0o600 });
    expect(store.get('s1')).toBeNull();
    rmSync(path);
    expect(store.set('s1', durableRecord(store, 's1'))).toBe(true);
    chmodSync(path, 0o644);
    expect(store.get('s1')).toBeNull();
    chmodSync(path, 0o600);
    const alias = `${path}.hardlink`;
    linkSync(path, alias);
    expect(store.get('s1')).toBeNull();
  });

  it('rejects symlinked store components and record files', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    outside = mkdtempSync(join(tmpdir(), 'directive-lifecycle-outside-'));
    symlinkSync(outside, join(dir, 'directive-lifecycle'), 'dir');
    const escaped = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(escaped.clock('s1')).toBeNull();
    expect(readdirSync(outside)).toEqual([]);

    rmSync(join(dir, 'directive-lifecycle'), { force: true });
    const store = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(store.set('s1', durableRecord(store, 's1'))).toBe(true);
    const path = storePathFor(dir);
    rmSync(path);
    const externalRecord = join(outside, 'external.json');
    writeFileSync(externalRecord, JSON.stringify(durableRecord(store, 's1')), { mode: 0o600 });
    symlinkSync(externalRecord, path);
    expect(store.get('s1')).toBeNull();
  });

  it('poisons recovered state after a boundary mutation failure', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    outside = mkdtempSync(join(tmpdir(), 'directive-lifecycle-outside-'));
    symlinkSync(outside, join(dir, 'directive-lifecycle'), 'dir');
    const failed = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(failed.advanceGeneration()).toBe(false);

    const recoveredBase = join(outside, 'recovered');
    mkdirSync(recoveredBase, { mode: 0o700 });
    const recovered = new FileDirectiveLifecycleStore({ baseDir: recoveredBase });
    expect(recovered.clock('s1')).toBeNull();
    expect(recovered.advanceGeneration()).toBe(true);
    expect(recovered.clock('s1')).not.toBeNull();
  });

  it('anchors mutations to the opened directory during component replacement', async () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    outside = mkdtempSync(join(tmpdir(), 'directive-lifecycle-outside-'));
    const store = new FileDirectiveLifecycleStore({ baseDir: dir });
    const candidate = durableRecord(store, 's1');
    const stateDir = dirname(storePathFor(dir));
    const anchoredDir = `${stateDir}.anchored`;
    const helper = resolve(import.meta.dirname, '../../../hooks/lib/directive-lifecycle-store.py');
    const child = spawn('python3', [helper, dir, '64'], {
      cwd: PROJECT_CWD,
      env: { ...process.env, SPECKIT_DIRECTIVE_STORE_TEST_PAUSE_MS: '250' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stdin.end(JSON.stringify({ op: 'set', sessionId: 's1', record: candidate }));
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
    renameSync(stateDir, anchoredDir);
    symlinkSync(outside, stateDir, 'dir');
    const exitCode = await new Promise<number | null>((resolvePromise) => child.on('close', resolvePromise));
    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout)).toMatchObject({ ok: true, result: true });
    expect(readdirSync(outside)).toEqual([]);
    expect(readdirSync(anchoredDir)).toContain(`${sessionHashFor('s1')}.json`);
  });

  it('keeps high-water monotonic across process-like store instances', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    const first = new FileDirectiveLifecycleStore({ baseDir: dir });
    const second = new FileDirectiveLifecycleStore({ baseDir: dir });
    expect(first.set('s1', durableRecord(first, 's1', 1_000))).toBe(true);
    expect(second.set('s1', durableRecord(second, 's1', 100))).toBe(true);
    expect(first.get('s1')?.transcriptHighWaterBytes).toBe(1_000);
  });

  it('evicts old sessions and removes only stale owned temp files', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    const store = new FileDirectiveLifecycleStore({ baseDir: dir, maxSessions: 2 });
    expect(store.set('s1', durableRecord(store, 's1'))).toBe(true);
    expect(store.set('s2', durableRecord(store, 's2'))).toBe(true);
    const stateDir = dirname(storePathFor(dir));
    const staleTemp = join(stateDir, '.directive-lifecycle-tmp-stale');
    writeFileSync(staleTemp, 'stale', { mode: 0o600 });
    const old = new Date(Date.now() - 10 * 60 * 1000);
    utimesSync(staleTemp, old, old);
    expect(store.set('s3', durableRecord(store, 's3'))).toBe(true);
    expect(store.get('s1')).toBeNull();
    expect(store.get('s2')).not.toBeNull();
    expect(store.get('s3')).not.toBeNull();
    expect(readdirSync(stateDir)).not.toContain('.directive-lifecycle-tmp-stale');
  });

  it('fails open for oversized state and missing directories', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    const store = new FileDirectiveLifecycleStore({ baseDir: dir });
    store.clearAll();
    store.clear('does-not-exist');
    expect(store.get('does-not-exist')).toBeNull();
    expect(store.set('s1', {
      ...durableRecord(store, 's1'),
      directives: 'x'.repeat(70 * 1024),
    })).toBe(false);
  });

  it('uses and restores the environment-selected base directory', () => {
    dir = mkdtempSync(join(tmpdir(), 'directive-lifecycle-test-'));
    process.env[DIRECTIVE_LIFECYCLE_STATE_DIR_ENV] = dir;
    resetDefaultDirectiveLifecycleStore();
    const store = defaultDirectiveLifecycleStore();
    expect(store.set('s1', durableRecord(store, 's1'))).toBe(true);
    expect(JSON.parse(readFileSync(storePathFor(dir), 'utf-8'))).toMatchObject({
      schemaVersion: DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
      directives: DIRECTIVES,
      transcriptPath: '/t.jsonl',
      transcriptHighWaterBytes: 100,
    });
  });
});

function sessionHashFor(sessionId: string): string {
  return createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
}

function storePathFor(baseDir: string): string {
  const projectHash = createHash('sha256').update(PROJECT_CWD).digest('hex').slice(0, 12);
  return join(baseDir, 'directive-lifecycle', projectHash, `${sessionHashFor('s1')}.json`);
}
