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
const GUARD_LOG_RELATIVE = ['.opencode', 'skills', '.loop-guard-state', 'guard-warnings.log'];

function writeFixtureRegistry(dir) {
  const registryDir = path.join(dir, '.opencode', 'skills', 'deep-loop-workflows');
  fs.mkdirSync(registryDir, { recursive: true });
  fs.writeFileSync(
    path.join(registryDir, 'mode-registry.json'),
    JSON.stringify({
      modes: [
        { workflowMode: 'ai-council', agent: 'ai-council' },
        { workflowMode: 'research', agent: 'deep-research' },
      ],
    }),
  );
}

function guardLogPath(dir) {
  return path.join(dir, ...GUARD_LOG_RELATIVE);
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
  try {
    fs.rmSync(guardLogPath(dir), { force: true });
  } catch (_) {
    // best-effort: an absent log is the same clean state the assertions want.
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
  fs.rmSync(path.join(tmpDir, '.opencode', 'skills', 'deep-loop-workflows', 'mode-registry.json'));
  process.env[REJECT_ENV] = '1';
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
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
  delete process.env[REJECT_LOOP_ENV];
  fs.rmSync(blockedStateDirPath, { force: true });

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
  fs.writeFileSync(staleStatePath, JSON.stringify({ sessionId: 'session-retention-stale', dispatches: {} }));
  fs.writeFileSync(freshStatePath, JSON.stringify({ sessionId: 'session-retention-fresh', dispatches: {} }));
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  fs.utimesSync(staleStatePath, threeDaysAgo, threeDaysAgo);

  process.env['MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS'] = '1';
  const retentionHooks1 = await pluginModule.default({ directory: tmpDir });
  assert.equal(typeof retentionHooks1.event, 'function');
  await retentionHooks1.event({ event: { type: 'session.created' } });

  assert.equal(fs.existsSync(staleStatePath), false, 'a state file untouched past the active-retention window should be archived out of the active dir');
  assert.equal(fs.existsSync(path.join(retentionArchiveDir, `${staleKey}.json`)), true, 'the archived file should land in .archive/ under the same filename');
  assert.equal(fs.existsSync(freshStatePath), true, 'a recently-touched state file should remain active, untouched by the sweep');

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

  delete process.env['MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS'];
  delete process.env['MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS'];

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('mk-deep-loop-guard.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
