// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-completion-sentinel Regression Tests                       ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the OpenCode adapter's session.created state-sweep wiring -- ║
// ║          a throttled, fail-open pass over the shared dedup store, mirror-║
// ║          ing mk-spec-gate.js's own session.created sweep contract. Also  ║
// ║          pins the kill-switch as a full no-op and confirms unrelated     ║
// ║          event types never trigger a sweep. Hermetic: no live OpenCode   ║
// ║          session required.                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

const KILL_SWITCH_ENV = 'MK_COMPLETION_SENTINEL_DISABLED';
const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-completion-sentinel.js')).href;

function loadPlugin() {
  return import(pluginUrl);
}

function makeProjectDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'mk-completion-sentinel-test-'));
}

async function withEnv(key, value, fn) {
  const previous = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
}

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function writeDedupStore(stateDir, store) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(path.join(stateDir, 'advisory-dedup.json'), JSON.stringify(store), 'utf8');
}

function readDedupStore(stateDir) {
  return JSON.parse(fs.readFileSync(path.join(stateDir, 'advisory-dedup.json'), 'utf8'));
}

test('session.created invokes the throttled state sweep, pruning a stale dedup entry', async () => {
  const { default: MkCompletionSentinelPlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    const sentinelCore = MkCompletionSentinelPlugin.__test.core;
    const { stateDir } = sentinelCore.resolveSentinelPaths(projectDir);
    const freshAdvisedAt = isoDaysAgo(1);
    writeDedupStore(stateDir, {
      stale: { fingerprint: 'sha256:stale', advisedAt: isoDaysAgo(40) },
      fresh: { fingerprint: 'sha256:fresh', advisedAt: freshAdvisedAt },
    });

    const hooks = await MkCompletionSentinelPlugin({ directory: projectDir });
    await hooks.event({ event: { type: 'session.created' } });

    assert.deepEqual(
      readDedupStore(stateDir),
      { fresh: { fingerprint: 'sha256:fresh', advisedAt: freshAdvisedAt } },
      'session.created must sweep the shared dedup store, pruning only the stale entry',
    );
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('kill switch (MK_COMPLETION_SENTINEL_DISABLED=1) makes session.created a full no-op, sweep included', async () => {
  const { default: MkCompletionSentinelPlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    await withEnv(KILL_SWITCH_ENV, '1', async () => {
      const sentinelCore = MkCompletionSentinelPlugin.__test.core;
      const { stateDir } = sentinelCore.resolveSentinelPaths(projectDir);
      const originalStore = { stale: { fingerprint: 'sha256:stale', advisedAt: isoDaysAgo(400) } };
      writeDedupStore(stateDir, originalStore);

      const hooks = await MkCompletionSentinelPlugin({ directory: projectDir });
      await hooks.event({ event: { type: 'session.created' } });

      assert.deepEqual(readDedupStore(stateDir), originalStore, 'kill switch must prevent the sweep entirely');
    });
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('a second session.created on the same plugin instance within the sweep interval is throttled (no re-sweep)', async () => {
  const { default: MkCompletionSentinelPlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    const sentinelCore = MkCompletionSentinelPlugin.__test.core;
    const { stateDir } = sentinelCore.resolveSentinelPaths(projectDir);
    writeDedupStore(stateDir, { stale: { fingerprint: 'sha256:stale', advisedAt: isoDaysAgo(40) } });

    const hooks = await MkCompletionSentinelPlugin({ directory: projectDir });
    await hooks.event({ event: { type: 'session.created' } });
    assert.deepEqual(readDedupStore(stateDir), {}, 'the first sweep must prune the stale entry');

    // Re-seed a stale entry directly, bypassing the sweep, to prove the
    // SECOND session.created on the SAME plugin instance -- well within the
    // sweep interval -- never touches the store at all.
    const secondStale = { stale2: { fingerprint: 'sha256:stale2', advisedAt: isoDaysAgo(40) } };
    writeDedupStore(stateDir, secondStale);
    await hooks.event({ event: { type: 'session.created' } });

    assert.deepEqual(readDedupStore(stateDir), secondStale, 'a throttled sweep must not touch the store');
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});

test('an unrelated event type never triggers the sweep', async () => {
  const { default: MkCompletionSentinelPlugin } = await loadPlugin();
  const projectDir = makeProjectDir();
  try {
    const sentinelCore = MkCompletionSentinelPlugin.__test.core;
    const { stateDir } = sentinelCore.resolveSentinelPaths(projectDir);
    const originalStore = { stale: { fingerprint: 'sha256:stale', advisedAt: isoDaysAgo(40) } };
    writeDedupStore(stateDir, originalStore);

    const hooks = await MkCompletionSentinelPlugin({ directory: projectDir });
    await hooks.event({ event: { type: 'tool.execute.after' } });

    assert.deepEqual(readDedupStore(stateDir), originalStore, 'an unrelated event type must never trigger a sweep');
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});
