// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-deep-loop-guard Regression Tests                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the plugin's export shape and the tool.execute.before hook  ║
// ║          logic (warn/reject toggle, fail-open, non-deep passthrough,    ║
// ║          prompt-based identity resolution, and session-scoped          ║
// ║          loop-repeat detection) against a hermetic fixture registry --  ║
// ║          no live OpenCode session required. Soft warnings are asserted  ║
// ║          via the state-dir warning log, not console, because the plugin ║
// ║          must never write to the TUI stream.                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const REJECT_ENV = 'MK_DEEP_LOOP_GUARD_REJECT';
const REJECT_LOOP_ENV = 'MK_DEEP_LOOP_GUARD_REJECT_LOOP';
const WARN_LOG_MAX_BYTES_ENV = 'MK_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES';
const GUARD_LOG_RELATIVE = ['.opencode', 'skills', '.loop-guard-state', 'guard-warnings.log'];

function writeFixtureRegistry(dir) {
  const registryDir = path.join(dir, '.opencode', 'skills', 'system-deep-loop');
  fs.mkdirSync(registryDir, { recursive: true });
  fs.writeFileSync(
    path.join(registryDir, 'mode-registry.json'),
    JSON.stringify({
      modes: [
        { workflowMode: 'ai-council', agent: 'ai-council' },
        { workflowMode: 'research', agent: 'deep-research' },
        { workflowMode: 'review', agent: 'deep-review' },
        { workflowMode: 'agent-improvement', agent: 'deep-improvement' },
        { workflowMode: 'model-benchmark', agent: 'deep-improvement' },
        { workflowMode: 'skill-benchmark', agent: 'deep-improvement' },
        { workflowMode: 'ai-system-improvement', agent: 'deep-improvement' },
        { workflowMode: 'alignment', agent: 'deep-alignment' },
      ],
    }),
  );
}

function guardLogPath(dir) {
  return path.join(dir, ...GUARD_LOG_RELATIVE);
}

function degradedGuardLogPath(dir) {
  return `${path.join(dir, '.opencode', 'skills', '.loop-guard-state')}.guard-warnings.log`;
}

// Soft warnings land in the state-dir log, not console. Read/clear it per check
// to assert warn presence or absence without disturbing the loop-repeat counters,
// which persist in separate per-session json files under the same state dir.
function readGuardLog(dir) {
  try {
    return fs.readFileSync(guardLogPath(dir), 'utf8');
  } catch (_) {
    return '';
  }
}

function clearGuardLog(dir) {
  for (const logPath of [guardLogPath(dir), `${guardLogPath(dir)}.1`]) {
    try {
      fs.rmSync(logPath, { force: true });
    } catch (_) {
      // Best-effort: an absent log is the same clean state the assertions want.
    }
  }
}

async function loadPlugin() {
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-deep-loop-guard.js')).href;
  return import(pluginUrl);
}

async function main() {
  const pluginModule = await loadPlugin();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
  assert.equal(typeof pluginModule.default, 'function');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mk-deep-loop-guard-'));
  writeFixtureRegistry(tmpDir);
  const hooks = await pluginModule.default({ directory: tmpDir });
  const beforeHook = hooks['tool.execute.before'];
  assert.equal(typeof beforeHook, 'function');

  delete process.env[REJECT_ENV];

  // Non-task tool: no-op, no throw.
  await beforeHook({ tool: 'read' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research' } });

  // Unknown subagent_type: no-op, no throw.
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'not-a-real-agent', prompt: 'mode=research' } });

  // Matching mode: no-op, no throw.
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=ai-council do the thing' } });

  // No mode declared in the prompt at all: no-op, no throw (absence, not disagreement).
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'do the thing' } });

  // Mode and target identity comparisons are case-insensitive.
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task' },
    { args: { subagent_type: 'general', prompt: 'Deep Route: mode=RESEARCH; target_agent=@DEEP-RESEARCH' } },
  );
  assert.doesNotMatch(readGuardLog(tmpDir), /mode mismatch/i);

  // Every workflow mode registered to a multiplexed agent remains valid.
  for (const workflowMode of ['agent-improvement', 'model-benchmark', 'skill-benchmark', 'ai-system-improvement']) {
    clearGuardLog(tmpDir);
    await beforeHook(
      { tool: 'task' },
      { args: { subagent_type: 'general', prompt: `Deep Route: mode=${workflowMode}; target_agent=@deep-improvement` } },
    );
    assert.doesNotMatch(readGuardLog(tmpDir), /mode mismatch/i, `${workflowMode} should remain valid for deep-improvement`);
  }

  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task' },
    { args: { subagent_type: 'general', prompt: 'Deep Route: mode=nonsense; target_agent=@deep-improvement' } },
  );
  assert.match(readGuardLog(tmpDir), /registry modes="agent-improvement\|ai-system-improvement\|model-benchmark\|skill-benchmark"/);

  // The Deep Route line wins over unrelated mode tokens elsewhere in the prompt.
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task' },
    {
      args: {
        subagent_type: 'general',
        prompt: 'mode=ai-council in quoted prose\nDeep Route: mode=research; target_agent=@deep-research\nmore prose mode=review',
      },
    },
  );
  assert.doesNotMatch(readGuardLog(tmpDir), /mode mismatch/i);

  // Mismatch, warn mode (default): records to the warning log, does not throw.
  clearGuardLog(tmpDir);
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
  assert.match(readGuardLog(tmpDir), /mk-deep-loop-guard.*mode mismatch/i);

  // Mismatch, reject mode: throws.
  process.env[REJECT_ENV] = '1';
  await assert.rejects(
    () => beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } }),
    /mk-deep-loop-guard: Deep Route mode mismatch/,
  );
  delete process.env[REJECT_ENV];

  // Fail-open: registry unreadable, mismatch present, reject mode on -- must not throw.
  fs.rmSync(path.join(tmpDir, '.opencode', 'skills', 'system-deep-loop', 'mode-registry.json'));
  process.env[REJECT_ENV] = '1';
  clearGuardLog(tmpDir);
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
  assert.match(readGuardLog(tmpDir), /reject-mode degraded.*mode registry unavailable/i);
  delete process.env[REJECT_ENV];
  writeFixtureRegistry(tmpDir);

  // --- Identity resolution: subagent_type="general" is orchestrate's real convention ---

  // "Deep Route: ... target_agent=@X" resolves identity even though subagent_type is "general".
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task' },
    { args: { subagent_type: 'general', prompt: 'Deep Route: mode=ai-council; target_agent=@deep-research\nmode=research do the thing' } },
  );
  assert.match(readGuardLog(tmpDir), /subagent_type="deep-research"/, 'target_agent= should resolve real identity from subagent_type="general"');

  // "Agent: @X" line resolves identity when no Deep Route target_agent is present.
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task' },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=ai-council do the thing' } },
  );
  assert.match(readGuardLog(tmpDir), /subagent_type="deep-research"/, 'Agent: @X line should resolve real identity from subagent_type="general"');

  // subagent_type="general" with no Agent:/Deep Route text at all is unresolvable: no-op, no throw.
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'general', prompt: 'mode=research do the thing' } });

  // --- Loop-repeat detection (session-scoped, command-owned loop executors only) ---

  const sessionA = 'session-loop-a';

  // 1st non-command-driven hand-off to a loop executor: silent allow, no warn.
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task', sessionID: sessionA },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review do the thing' } },
  );
  assert.doesNotMatch(readGuardLog(tmpDir), /loop-like/, '1st hand-off must not warn about loop-repeat');

  // 2nd non-command-driven hand-off to the SAME executor, SAME session: warn.
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task', sessionID: sessionA },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review do the thing again' } },
  );
  assert.match(readGuardLog(tmpDir), /loop-like repeated dispatch/, '2nd hand-off must warn about loop-repeat');
  assert.doesNotMatch(readGuardLog(tmpDir), /orchestrate/i, 'the warning must not claim an unobservable caller identity');

  // 3rd non-command-driven hand-off, default (warn) mode: warns, does not throw.
  clearGuardLog(tmpDir);
  await beforeHook(
    { tool: 'task', sessionID: sessionA },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review a third time' } },
  );
  assert.match(readGuardLog(tmpDir), /loop-like repeated dispatch/, '3rd hand-off must warn (default mode)');

  // 3rd non-command-driven hand-off, reject-loop mode: throws (use a fresh session for a clean count).
  const sessionB = 'session-loop-b';
  await beforeHook({ tool: 'task', sessionID: sessionB }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review one' } });
  await beforeHook({ tool: 'task', sessionID: sessionB }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review two' } });
  process.env[REJECT_LOOP_ENV] = '1';
  await assert.rejects(
    () => beforeHook({ tool: 'task', sessionID: sessionB }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review three' } }),
    /mk-deep-loop-guard: loop-like repeated dispatch/,
  );
  delete process.env[REJECT_LOOP_ENV];

  // Mixed-case agent identity still reaches loop rejection.
  const sessionUppercase = 'session-loop-uppercase';
  await beforeHook({ tool: 'task', sessionID: sessionUppercase }, { args: { subagent_type: 'general', prompt: 'Agent: @DEEP-REVIEW\nmode=REVIEW one' } });
  await beforeHook({ tool: 'task', sessionID: sessionUppercase }, { args: { subagent_type: 'general', prompt: 'Agent: @Deep-Review\nmode=Review two' } });
  process.env[REJECT_LOOP_ENV] = '1';
  await assert.rejects(
    () => beforeHook({ tool: 'task', sessionID: sessionUppercase }, { args: { subagent_type: 'general', prompt: 'Agent: @DEEP-REVIEW\nmode=REVIEW three' } }),
    /mk-deep-loop-guard: loop-like repeated dispatch/,
  );
  delete process.env[REJECT_LOOP_ENV];

  // deep-alignment is a command-owned loop executor: repeated hand-offs reach loop rejection.
  const sessionAlignment = 'session-loop-alignment';
  await beforeHook({ tool: 'task', sessionID: sessionAlignment }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-alignment\nmode=alignment one' } });
  await beforeHook({ tool: 'task', sessionID: sessionAlignment }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-alignment\nmode=alignment two' } });
  process.env[REJECT_LOOP_ENV] = '1';
  await assert.rejects(
    () => beforeHook({ tool: 'task', sessionID: sessionAlignment }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-alignment\nmode=alignment three' } }),
    /mk-deep-loop-guard: loop-like repeated dispatch/,
  );
  delete process.env[REJECT_LOOP_ENV];

  // Command-driven dispatches (iteration-state markers present) never count toward the threshold.
  const sessionC = 'session-loop-c';
  clearGuardLog(tmpDir);
  for (let i = 1; i <= 5; i += 1) {
    await beforeHook(
      { tool: 'task', sessionID: sessionC },
      { args: { subagent_type: 'general', prompt: `Agent: @deep-review\nIteration: ${i} of 10\nmode=review do the thing` } },
    );
  }
  assert.doesNotMatch(readGuardLog(tmpDir), /loop-like/, 'command-driven iterations must never trigger loop-repeat warn');

  // Human-readable review iteration markers remain valid when their bounds are sane.
  const sessionReviewIteration = 'session-review-iteration';
  clearGuardLog(tmpDir);
  for (let i = 1; i <= 3; i += 1) {
    await beforeHook(
      { tool: 'task', sessionID: sessionReviewIteration },
      { args: { subagent_type: 'general', prompt: `Agent: @deep-review\nReview Iteration: ${i} of 3\nmode=review` } },
    );
  }
  assert.doesNotMatch(readGuardLog(tmpDir), /loop-like/, 'bounded review iteration markers must remain command-driven');

  // Prose collisions and impossible iteration bounds do not bypass repeat counting.
  const markerNearMisses = [
    'This prose mentions STATE SUMMARY but is not an iteration envelope.',
    'Discuss Iteration: 2 of 5 without treating it as a marker.',
    'Iteration: 5 of 3',
  ];
  for (const [index, markerText] of markerNearMisses.entries()) {
    const sessionID = `session-marker-near-miss-${index}`;
    clearGuardLog(tmpDir);
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await beforeHook(
        { tool: 'task', sessionID },
        { args: { subagent_type: 'general', prompt: `Agent: @deep-review\nmode=review\n${markerText}` } },
      );
    }
    assert.match(readGuardLog(tmpDir), /loop-like repeated dispatch/, `${markerText} must not bypass repeat counting`);
  }

  // Prompt improvement is not a command-owned deep-loop executor.
  const promptImproverSession = 'session-prompt-improver';
  clearGuardLog(tmpDir);
  for (let i = 0; i < 5; i += 1) {
    await beforeHook(
      { tool: 'task', sessionID: promptImproverSession },
      { args: { subagent_type: 'prompt-improver', prompt: 'Improve this prompt again.' } },
    );
  }
  assert.doesNotMatch(readGuardLog(tmpDir), /loop-like/, 'prompt-improver must remain outside deep-loop repeat counting');

  // Non-loop-executor targets (e.g. ai-council) are never loop-counted, even when repeated.
  const sessionD = 'session-loop-d';
  clearGuardLog(tmpDir);
  for (let i = 1; i <= 5; i += 1) {
    await beforeHook(
      { tool: 'task', sessionID: sessionD },
      { args: { subagent_type: 'general', prompt: `Agent: @ai-council\nmode=ai-council plan again (${i})` } },
    );
  }
  assert.doesNotMatch(readGuardLog(tmpDir), /loop-like/, 'non-loop-executor targets (ai-council) must never trigger loop-repeat warn');

  // Different sessions do not cross-contaminate loop-repeat counts.
  const sessionE1 = 'session-loop-e1';
  const sessionE2 = 'session-loop-e2';
  clearGuardLog(tmpDir);
  await beforeHook({ tool: 'task', sessionID: sessionE1 }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' } });
  await beforeHook({ tool: 'task', sessionID: sessionE2 }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' } });
  assert.doesNotMatch(readGuardLog(tmpDir), /loop-like/, 'separate sessions must not share loop-repeat counts');

  // Fail-open: loop-guard state directory is a file, not a directory -- write fails, dispatch never blocked.
  const blockedStateDirPath = path.join(tmpDir, '.opencode', 'skills', '.loop-guard-state');
  fs.rmSync(blockedStateDirPath, { recursive: true, force: true });
  fs.writeFileSync(blockedStateDirPath, 'not a directory');
  process.env[REJECT_LOOP_ENV] = '1';
  await beforeHook(
    { tool: 'task', sessionID: 'session-loop-failopen' },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-improvement\nmode=agent-improvement go' } },
  );
  assert.match(
    fs.readFileSync(degradedGuardLogPath(tmpDir), 'utf8'),
    /reject-mode degraded.*loop state persistence unavailable/i,
  );
  delete process.env[REJECT_LOOP_ENV];
  fs.rmSync(blockedStateDirPath, { force: true });
  fs.rmSync(degradedGuardLogPath(tmpDir), { force: true });

  // --- Retention: sweep archives stale per-session state, prune deletes old archives ---

  const retentionStateDir = path.join(tmpDir, '.opencode', 'skills', '.loop-guard-state');
  fs.mkdirSync(retentionStateDir, { recursive: true });
  const retentionArchiveDir = path.join(retentionStateDir, '.archive');

  function sessionKeyFor(id) {
    return Buffer.from(id, 'utf8').toString('hex');
  }

  const staleKey = sessionKeyFor('session-retention-stale');
  const freshKey = sessionKeyFor('session-retention-fresh');
  const staleStatePath = path.join(retentionStateDir, `${staleKey}.json`);
  const freshStatePath = path.join(retentionStateDir, `${freshKey}.json`);
  const staleTempPath = `${staleStatePath}.${process.pid}.${Date.now()}.tmp`;
  const freshTempPath = `${freshStatePath}.${process.pid}.${Date.now()}.tmp`;
  const unrelatedTempPath = path.join(retentionStateDir, 'unrelated.tmp');
  fs.writeFileSync(staleStatePath, JSON.stringify({ sessionId: 'session-retention-stale', dispatches: {} }));
  fs.writeFileSync(freshStatePath, JSON.stringify({ sessionId: 'session-retention-fresh', dispatches: {} }));
  fs.writeFileSync(staleTempPath, 'stale temp');
  fs.writeFileSync(freshTempPath, 'fresh temp');
  fs.writeFileSync(unrelatedTempPath, 'unrelated temp');
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  fs.utimesSync(staleStatePath, threeDaysAgo, threeDaysAgo);
  fs.utimesSync(staleTempPath, threeDaysAgo, threeDaysAgo);
  fs.utimesSync(unrelatedTempPath, threeDaysAgo, threeDaysAgo);

  process.env['MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS'] = '1';
  const retentionHooks1 = await pluginModule.default({ directory: tmpDir });
  assert.equal(typeof retentionHooks1.event, 'function');
  await retentionHooks1.event({ event: { type: 'session.created' } });

  assert.equal(fs.existsSync(staleStatePath), false, 'a state file untouched past the active-retention window should be archived out of the active dir');
  assert.equal(fs.existsSync(path.join(retentionArchiveDir, `${staleKey}.json`)), true, 'the archived file should land in .archive/ under the same filename');
  assert.equal(fs.existsSync(freshStatePath), true, 'a recently-touched state file should remain active, untouched by the sweep');
  assert.equal(fs.existsSync(staleTempPath), false, 'a stale guard-owned atomic temp file should be pruned');
  assert.equal(fs.existsSync(freshTempPath), true, 'a fresh guard-owned atomic temp file should survive');
  assert.equal(fs.existsSync(unrelatedTempPath), true, 'an unrelated temp file should not be pruned');

  // A live cross-process sweep lock makes another sweep a no-op.
  const lockedKey = sessionKeyFor('session-retention-locked');
  const lockedStatePath = path.join(retentionStateDir, `${lockedKey}.json`);
  fs.writeFileSync(lockedStatePath, JSON.stringify({ sessionId: 'session-retention-locked', dispatches: {} }));
  fs.utimesSync(lockedStatePath, threeDaysAgo, threeDaysAgo);
  const sweepLockPath = path.join(retentionStateDir, '.sweep.lock');
  fs.mkdirSync(sweepLockPath);
  const lockedHooks = await pluginModule.default({ directory: tmpDir });
  await lockedHooks.event({ event: { type: 'session.created' } });
  assert.equal(fs.existsSync(lockedStatePath), true, 'a second process must not sweep while the lock is live');
  fs.rmdirSync(sweepLockPath);

  // Second session.created on the SAME plugin instance, immediately after: throttled, no-op.
  const secondKey = sessionKeyFor('session-retention-second');
  const secondStatePath = path.join(retentionStateDir, `${secondKey}.json`);
  fs.writeFileSync(secondStatePath, JSON.stringify({ sessionId: 'session-retention-second', dispatches: {} }));
  const alsoOld = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  fs.utimesSync(secondStatePath, alsoOld, alsoOld);
  await retentionHooks1.event({ event: { type: 'session.created' } });
  assert.equal(fs.existsSync(secondStatePath), true, 'a second session.created within the sweep interval on the same plugin instance must be throttled (no re-sweep)');

  // Archive prune: an archived file past the archive-retention window gets deleted.
  // Uses a fresh plugin instance so its own throttle state starts unswept, guaranteeing
  // the sweep (and its trailing archive prune) actually runs on the very next call.
  process.env['MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS'] = '1';
  const archivedStalePath = path.join(retentionArchiveDir, `${staleKey}.json`);
  const veryOld = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  fs.utimesSync(archivedStalePath, veryOld, veryOld);
  const retentionHooks2 = await pluginModule.default({ directory: tmpDir });
  await retentionHooks2.event({ event: { type: 'session.created' } });
  assert.equal(fs.existsSync(archivedStalePath), false, 'an archived file past the archive-retention window should be pruned by the next sweep pass');

  // Non-session.created events must never trigger a sweep.
  const untouchedKey = sessionKeyFor('session-retention-untouched-event');
  const untouchedStatePath = path.join(retentionStateDir, `${untouchedKey}.json`);
  fs.writeFileSync(untouchedStatePath, JSON.stringify({ sessionId: 'session-retention-untouched-event', dispatches: {} }));
  fs.utimesSync(untouchedStatePath, veryOld, veryOld);
  const retentionHooks3 = await pluginModule.default({ directory: tmpDir });
  await retentionHooks3.event({ event: { type: 'session.idle' } });
  assert.equal(fs.existsSync(untouchedStatePath), true, 'a non-session.created event must never trigger the sweep');

  // Warning logs rotate by size and receive maintenance on session creation.
  clearGuardLog(tmpDir);
  process.env[WARN_LOG_MAX_BYTES_ENV] = '512';
  for (let i = 0; i < 6; i += 1) {
    await beforeHook(
      { tool: 'task' },
      { args: { subagent_type: 'ai-council', prompt: `mode=research generate warning ${i}` } },
    );
  }
  assert.equal(fs.existsSync(`${guardLogPath(tmpDir)}.1`), true, 'size overflow should retain one rotated warning-log generation');
  assert.ok(fs.statSync(guardLogPath(tmpDir)).size <= 512, 'the active warning log should remain within its byte cap');

  clearGuardLog(tmpDir);
  fs.mkdirSync(path.dirname(guardLogPath(tmpDir)), { recursive: true });
  fs.writeFileSync(guardLogPath(tmpDir), 'x'.repeat(1024));
  const warningMaintenanceHooks = await pluginModule.default({ directory: tmpDir });
  await warningMaintenanceHooks.event({ event: { type: 'session.created' } });
  assert.equal(fs.existsSync(guardLogPath(tmpDir)), false, 'startup maintenance should rotate an oversized active log');
  assert.equal(fs.existsSync(`${guardLogPath(tmpDir)}.1`), true, 'startup maintenance should preserve the rotated generation');

  delete process.env['MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS'];
  delete process.env['MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS'];
  delete process.env[WARN_LOG_MAX_BYTES_ENV];

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('mk-deep-loop-guard.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
