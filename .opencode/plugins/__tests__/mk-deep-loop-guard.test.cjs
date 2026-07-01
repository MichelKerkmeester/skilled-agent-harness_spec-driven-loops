// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-deep-loop-guard Regression Tests                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the plugin's export shape and the tool.execute.before hook  ║
// ║          logic (warn/reject toggle, fail-open, non-deep passthrough,    ║
// ║          prompt-based identity resolution, and session-scoped          ║
// ║          loop-repeat detection) against a hermetic fixture registry --  ║
// ║          no live OpenCode session required.                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const REJECT_ENV = 'MK_DEEP_LOOP_GUARD_REJECT';
const REJECT_LOOP_ENV = 'MK_DEEP_LOOP_GUARD_REJECT_LOOP';

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

  // Mismatch, warn mode (default): logs, does not throw.
  let warned = '';
  const originalError = console.error;
  console.error = (msg) => { warned = String(msg); };
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
  console.error = originalError;
  assert.match(warned, /mk-deep-loop-guard.*mode mismatch/i);

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
  warned = '';
  console.error = (msg) => { warned = String(msg); };
  await beforeHook(
    { tool: 'task' },
    { args: { subagent_type: 'general', prompt: 'Deep Route: mode=ai-council; target_agent=@deep-research\nmode=research do the thing' } },
  );
  console.error = originalError;
  assert.match(warned, /subagent_type="deep-research"/, 'target_agent= should resolve real identity from subagent_type="general"');

  // "Agent: @X" line resolves identity when no Deep Route target_agent is present.
  warned = '';
  console.error = (msg) => { warned = String(msg); };
  await beforeHook(
    { tool: 'task' },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=ai-council do the thing' } },
  );
  console.error = originalError;
  assert.match(warned, /subagent_type="deep-research"/, 'Agent: @X line should resolve real identity from subagent_type="general"');

  // subagent_type="general" with no Agent:/Deep Route text at all is unresolvable: no-op, no throw.
  await beforeHook({ tool: 'task' }, { args: { subagent_type: 'general', prompt: 'mode=research do the thing' } });

  // --- Loop-repeat detection (session-scoped, command-owned loop executors only) ---

  const sessionA = 'session-loop-a';

  // 1st non-command-driven hand-off to a loop executor: silent allow, no warn.
  let sawWarnLoop = false;
  console.error = (msg) => { if (/loop-like/.test(String(msg))) sawWarnLoop = true; };
  await beforeHook(
    { tool: 'task', sessionID: sessionA },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review do the thing' } },
  );
  console.error = originalError;
  assert.equal(sawWarnLoop, false, '1st hand-off must not warn about loop-repeat');

  // 2nd non-command-driven hand-off to the SAME executor, SAME session: warn.
  let loopWarnDetail = '';
  console.error = (msg) => { loopWarnDetail = String(msg); };
  await beforeHook(
    { tool: 'task', sessionID: sessionA },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review do the thing again' } },
  );
  console.error = originalError;
  assert.match(loopWarnDetail, /loop-like repeated dispatch/, '2nd hand-off must warn about loop-repeat');

  // 3rd non-command-driven hand-off, default (warn) mode: warns, does not throw.
  loopWarnDetail = '';
  console.error = (msg) => { loopWarnDetail = String(msg); };
  await beforeHook(
    { tool: 'task', sessionID: sessionA },
    { args: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review a third time' } },
  );
  console.error = originalError;
  assert.match(loopWarnDetail, /loop-like repeated dispatch/, '3rd hand-off must warn (default mode)');

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
  let sawWarnCommandDriven = false;
  console.error = (msg) => { if (/loop-like/.test(String(msg))) sawWarnCommandDriven = true; };
  for (let i = 1; i <= 5; i += 1) {
    await beforeHook(
      { tool: 'task', sessionID: sessionC },
      { args: { subagent_type: 'general', prompt: `Agent: @deep-review\nIteration: ${i} of 10\nmode=review do the thing` } },
    );
  }
  console.error = originalError;
  assert.equal(sawWarnCommandDriven, false, 'command-driven iterations must never trigger loop-repeat warn');

  // Non-loop-executor targets (e.g. ai-council) are never loop-counted, even when repeated.
  const sessionD = 'session-loop-d';
  let sawWarnNonLoopExecutor = false;
  console.error = (msg) => { if (/loop-like/.test(String(msg))) sawWarnNonLoopExecutor = true; };
  for (let i = 1; i <= 5; i += 1) {
    await beforeHook(
      { tool: 'task', sessionID: sessionD },
      { args: { subagent_type: 'general', prompt: `Agent: @ai-council\nmode=ai-council plan again (${i})` } },
    );
  }
  console.error = originalError;
  assert.equal(sawWarnNonLoopExecutor, false, 'non-loop-executor targets (ai-council) must never trigger loop-repeat warn');

  // Different sessions do not cross-contaminate loop-repeat counts.
  const sessionE1 = 'session-loop-e1';
  const sessionE2 = 'session-loop-e2';
  let sawWarnCrossSession = false;
  console.error = (msg) => { if (/loop-like/.test(String(msg))) sawWarnCrossSession = true; };
  await beforeHook({ tool: 'task', sessionID: sessionE1 }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' } });
  await beforeHook({ tool: 'task', sessionID: sessionE2 }, { args: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' } });
  console.error = originalError;
  assert.equal(sawWarnCrossSession, false, 'separate sessions must not share loop-repeat counts');

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

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('mk-deep-loop-guard.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
