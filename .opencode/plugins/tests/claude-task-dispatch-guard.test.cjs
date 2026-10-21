// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude PreToolUse(Task) deep-loop guard hook -- Regression     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the Claude runtime adapter over the shared dispatch-guard    ║
// ║          core, mirroring the OpenCode plugin test table. Pipes           ║
// ║          representative PreToolUse JSON payloads into the hook process    ║
// ║          via stdin and asserts the transport contract: silent approve    ║
// ║          (empty stdout, exit 0), warn (additionalContext + a write to    ║
// ║          the SHARED bounded warning log), and deny                       ║
// ║          (permissionDecision="deny" with the guard's reason). Because     ║
// ║          each spawn is a fresh process sharing the on-disk state dir,     ║
// ║          this also exercises the cross-process loop-repeat counter that   ║
// ║          both runtimes persist to the same location.                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const REJECT_ENV = 'SYSTEM_DEEP_LOOP_GUARD_REJECT';
const REJECT_LOOP_ENV = 'SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP';
const GUARD_LOG_RELATIVE = ['.skilled', 'skills', '.state', 'loop-guard', 'guard-warnings.log'];

const HOOK_PATH = path.join(
  __dirname,
  '..',
  '..',
  'hooks',
  'task-dispatch',
  'claude',
  'task-dispatch-guard.cjs',
);

const GUARD_CORE_PATH = path.join(
  __dirname,
  '..',
  '..',
  'hooks',
  'task-dispatch',
  'lib',
  'dispatch-guard.cjs',
);
const guardCore = require(GUARD_CORE_PATH);

function writeFixtureRegistry(dir) {
  const registryDir = path.join(dir, '.skilled', 'skills', 'system-deep-loop');
  fs.mkdirSync(registryDir, { recursive: true });
  fs.writeFileSync(
    path.join(registryDir, 'mode-registry.json'),
    JSON.stringify({
      modes: [
        { workflowMode: 'ai-council', agent: 'ai-council' },
        { workflowMode: 'research', agent: 'deep-research' },
        { workflowMode: 'review', agent: 'deep-review' },
      ],
    }),
  );
}

function guardLogPath(dir) {
  return path.join(dir, ...GUARD_LOG_RELATIVE);
}

function degradedGuardLogPath(dir) {
  return `${path.join(dir, '.skilled', 'skills', '.state', 'loop-guard')}.guard-warnings.log`;
}

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

// Run the hook as a real child process, feeding the PreToolUse payload on stdin.
// Returns the parsed hook JSON (or null when the hook approved with empty stdout)
// plus the raw stdout and exit status, mirroring how Claude Code invokes the hook.
function runHook(payload, extraEnv, rawStdin) {
  const input = typeof rawStdin === 'string' ? rawStdin : JSON.stringify(payload);
  const result = spawnSync(process.execPath, [HOOK_PATH], {
    input,
    encoding: 'utf8',
    env: { ...process.env, ...(extraEnv || {}) },
  });
  const stdout = (result.stdout || '').trim();
  let json = null;
  if (stdout) {
    try { json = JSON.parse(stdout); } catch (_) { json = null; }
  }
  return { json, stdout, status: result.status };
}

function decisionOf(hook) {
  return hook.json && hook.json.hookSpecificOutput
    ? hook.json.hookSpecificOutput.permissionDecision || null
    : null;
}

// Each child announces readiness before the parent releases all of them at
// once, so their read-modify-write windows overlap without depending on a shared
// wall-clock instant.
const CONCURRENT_RECORD_SCRIPT = `
const fs = require('node:fs');
const { recordLoopDispatch } = require(process.env.GUARD_CORE_PATH);
fs.writeFileSync(process.env.RECORD_READY_PATH, 'ready');
while (!fs.existsSync(process.env.RECORD_GO_PATH)) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5);
}
recordLoopDispatch(process.env.RECORD_STATE_DIR, process.env.RECORD_SESSION_ID, 'deep-review', false);
`;

async function waitForPaths(paths, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (paths.every((candidatePath) => fs.existsSync(candidatePath))) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error('concurrent recorders did not become ready');
}

function writeRecordDelayPreload(dir) {
  const preloadPath = path.join(dir, 'record-delay-preload.cjs');
  fs.writeFileSync(preloadPath, [
    "'use strict';",
    'const fs = require("node:fs");',
    'function pause(milliseconds) {',
    '  if (milliseconds > 0) {',
    '    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);',
    '  }',
    '}',
    'const delayMs = Number(process.env.RECORD_LOCK_DELAY_MS || 0);',
    'const writeDelayMs = Number(process.env.RECORD_STATE_WRITE_DELAY_MS || 0);',
    'const originalRenameSync = fs.renameSync;',
    'fs.renameSync = function (sourcePath, targetPath, ...args) {',
    '  if (typeof sourcePath === "string" && /\\.json\\.lock$/.test(sourcePath)) pause(delayMs);',
    '  return originalRenameSync.call(this, sourcePath, targetPath, ...args);',
    '};',
    'const originalUnlinkSync = fs.unlinkSync;',
    'fs.unlinkSync = function (targetPath, ...args) {',
    '  if (typeof targetPath === "string" && /\\.json\\.lock$/.test(targetPath)) pause(delayMs);',
    '  return originalUnlinkSync.call(this, targetPath, ...args);',
    '};',
    'const originalWriteFileSync = fs.writeFileSync;',
    'fs.writeFileSync = function (targetPath, ...args) {',
    '  if (typeof targetPath === "string" && /\\.json\\.\\d+\\.\\d+\\.tmp$/.test(targetPath)) {',
    '    pause(writeDelayMs);',
    '  }',
    '  return originalWriteFileSync.call(this, targetPath, ...args);',
    '};',
    '',
  ].join('\n'));
  return preloadPath;
}

async function recordConcurrently({
  childCount,
  stateDir,
  sessionID,
  barrierDir,
  envForChild,
}) {
  fs.mkdirSync(barrierDir, { recursive: true });
  const goPath = path.join(barrierDir, 'go');
  fs.rmSync(goPath, { force: true });
  const readyPaths = [];
  const children = [];
  for (let index = 0; index < childCount; index += 1) {
    const readyPath = path.join(barrierDir, `ready-${index}`);
    fs.rmSync(readyPath, { force: true });
    readyPaths.push(readyPath);
    children.push(new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['-e', CONCURRENT_RECORD_SCRIPT], {
        env: {
          ...process.env,
          ...(envForChild ? envForChild(index) : {}),
          GUARD_CORE_PATH,
          RECORD_STATE_DIR: stateDir,
          RECORD_SESSION_ID: sessionID,
          RECORD_READY_PATH: readyPath,
          RECORD_GO_PATH: goPath,
        },
        stdio: ['ignore', 'ignore', 'pipe'],
      });
      let stderr = '';
      child.stderr.on('data', (chunk) => { stderr += chunk; });
      child.on('error', reject);
      child.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`concurrent recorder exited ${code}: ${stderr}`));
      });
    }));
  }
  await waitForPaths(readyPaths);
  fs.writeFileSync(goPath, 'go');
  return Promise.all(children);
}

function deadProcessPid() {
  const result = spawnSync(process.execPath, ['-e', 'process.exit(0);']);
  assert.equal(result.status, 0, 'the dead-owner fixture process must exit');
  return result.pid;
}

function preloadNodeOptions(preloadPath) {
  return `${process.env.NODE_OPTIONS || ''} --require=${preloadPath}`.trim();
}

function contextOf(hook) {
  return hook.json && hook.json.hookSpecificOutput
    ? hook.json.hookSpecificOutput.additionalContext || ''
    : '';
}

function reasonOf(hook) {
  return hook.json && hook.json.hookSpecificOutput
    ? hook.json.hookSpecificOutput.permissionDecisionReason || ''
    : '';
}

async function main() {
  assert.equal(fs.existsSync(HOOK_PATH), true, 'the Claude task-dispatch-guard hook script must exist');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-task-guard-'));
  // Remove the fixture tree even when an assertion aborts the run before teardown.
  process.on('exit', () => fs.rmSync(tmpDir, { recursive: true, force: true }));
  writeFixtureRegistry(tmpDir);
  const cwd = tmpDir;

  // --- Transport basics: non-Task and unresolvable dispatches approve silently ---

  // Invalid stdin JSON: fail open, approve.
  let hook = runHook(null, undefined, 'not json at all');
  assert.equal(hook.stdout, '', 'invalid stdin must approve silently');
  assert.equal(hook.status, 0, 'invalid stdin must exit 0');

  // Non-Task tool: no-op approve.
  hook = runHook({ tool_name: 'Bash', tool_input: { command: 'ls' }, cwd });
  assert.equal(hook.stdout, '', 'non-Task tool must approve silently');

  // Unknown subagent_type, no route: no-op approve.
  hook = runHook({ tool_name: 'Task', tool_input: { subagent_type: 'not-a-real-agent', prompt: 'mode=research' }, cwd });
  assert.equal(hook.stdout, '', 'unknown subagent must approve silently');

  // Matching mode: no-op approve.
  hook = runHook({ tool_name: 'Task', tool_input: { subagent_type: 'ai-council', prompt: 'mode=ai-council do the thing' }, cwd });
  assert.equal(hook.stdout, '', 'matching mode must approve silently');

  // No mode declared at all: absence is not disagreement, approve.
  hook = runHook({ tool_name: 'Task', tool_input: { subagent_type: 'ai-council', prompt: 'do the thing' }, cwd });
  assert.equal(hook.stdout, '', 'no declared mode must approve silently');

  // Tool-name normalization: lowercase 'task' and uppercase 'TASK' are both guarded.
  clearGuardLog(cwd);
  hook = runHook({ tool_name: 'task', tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do it' }, cwd });
  assert.match(contextOf(hook), /mode mismatch/i, "lowercase 'task' tool_name must still be guarded");
  clearGuardLog(cwd);
  hook = runHook({ tool_name: 'TASK', tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do it' }, cwd });
  assert.match(contextOf(hook), /mode mismatch/i, "uppercase 'TASK' tool_name must still be guarded");

  // --- Mode-mismatch: case-insensitivity, multiplexed agents, envelope anchoring ---

  // Mode and target identity comparisons are case-insensitive.
  clearGuardLog(cwd);
  hook = runHook({
    tool_name: 'Task',
    tool_input: { subagent_type: 'general', prompt: 'Deep Route: mode=RESEARCH; target_agent=@DEEP-RESEARCH' },
    cwd,
  });
  assert.equal(hook.stdout, '', 'mixed-case mode/target must not warn');
  assert.doesNotMatch(readGuardLog(cwd), /mode mismatch/i, 'mixed-case mode/target must not log a mismatch');

  // An unregistered mode for a registered agent lists the sorted permitted set.
  clearGuardLog(cwd);
  hook = runHook({
    tool_name: 'Task',
    tool_input: { subagent_type: 'general', prompt: 'Deep Route: mode=nonsense; target_agent=@deep-research' },
    cwd,
  });
  assert.match(contextOf(hook), /registry modes="research"/, 'mismatch advisory must list the sorted permitted modes');

  // The Deep Route line wins over unrelated mode tokens elsewhere in the prompt.
  clearGuardLog(cwd);
  hook = runHook({
    tool_name: 'Task',
    tool_input: {
      subagent_type: 'general',
      prompt: 'mode=ai-council in quoted prose\nDeep Route: mode=research; target_agent=@deep-research\nmore prose mode=review',
    },
    cwd,
  });
  assert.equal(hook.stdout, '', 'the Deep Route envelope mode must win over incidental mode= tokens');

  // --- Mismatch: warn (default) writes the shared log; reject denies ---

  // Mismatch, warn mode (default): additionalContext + a shared-log write, no deny.
  clearGuardLog(cwd);
  hook = runHook({ tool_name: 'Task', tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' }, cwd });
  assert.equal(decisionOf(hook), null, 'default mode must not deny a mismatch');
  assert.match(contextOf(hook), /system-deep-loop-guard.*mode mismatch/i, 'default mismatch must surface an advisory');
  assert.match(readGuardLog(cwd), /system-deep-loop-guard.*mode mismatch/i, 'default mismatch must append to the shared warning log');

  // Mismatch, reject mode: deny with the guard's reason.
  hook = runHook(
    { tool_name: 'Task', tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' }, cwd },
    { [REJECT_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), 'deny', 'reject mode must deny a mismatch');
  assert.match(reasonOf(hook), /system-deep-loop-guard: Deep Route mode mismatch/, 'deny must carry the mismatch reason');

  // Fail-open: registry unreadable, mismatch present, reject on -- approve + degraded audit, no deny.
  const registryPath = path.join(cwd, '.skilled', 'skills', 'system-deep-loop', 'mode-registry.json');
  fs.rmSync(registryPath);
  clearGuardLog(cwd);
  hook = runHook(
    { tool_name: 'Task', tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' }, cwd },
    { [REJECT_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), null, 'a missing registry must not deny in reject mode (fail-open)');
  assert.match(readGuardLog(cwd), /reject-mode degraded.*mode registry unavailable/i, 'degraded reject enforcement must be audited');
  writeFixtureRegistry(cwd);

  // --- Identity resolution parity (subagent_type="general" is orchestrate's convention) ---

  clearGuardLog(cwd);
  hook = runHook({
    tool_name: 'Task',
    tool_input: { subagent_type: 'general', prompt: 'Deep Route: mode=ai-council; target_agent=@deep-research\nmode=research do the thing' },
    cwd,
  });
  assert.match(contextOf(hook), /subagent_type="deep-research"/, 'target_agent= resolves identity from subagent_type="general"');

  clearGuardLog(cwd);
  hook = runHook({
    tool_name: 'Task',
    tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=ai-council do the thing' },
    cwd,
  });
  assert.match(contextOf(hook), /subagent_type="deep-research"/, 'Agent: @X resolves identity from subagent_type="general"');

  // --- Loop-repeat: 1st allow, 2nd warn, 3rd deny (reject-loop), cross-process state ---

  const sessionA = 'claude-loop-a';

  // 1st non-command-driven hand-off: silent allow.
  clearGuardLog(cwd);
  hook = runHook({ tool_name: 'Task', session_id: sessionA, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review one' }, cwd });
  assert.equal(hook.stdout, '', '1st hand-off must approve silently');

  // 2nd non-command-driven hand-off, same session: warn (no orchestrate claim).
  clearGuardLog(cwd);
  hook = runHook({ tool_name: 'Task', session_id: sessionA, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review two' }, cwd });
  assert.match(contextOf(hook), /loop-like repeated dispatch/, '2nd hand-off must warn');
  assert.doesNotMatch(contextOf(hook), /orchestrate/i, 'the warning must not claim an unobservable caller identity');

  // 3rd non-command-driven hand-off, default mode: warn, no deny.
  hook = runHook({ tool_name: 'Task', session_id: sessionA, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review three' }, cwd });
  assert.equal(decisionOf(hook), null, '3rd hand-off must not deny in default mode');
  assert.match(contextOf(hook), /loop-like repeated dispatch/, '3rd hand-off must warn in default mode');

  // 3rd non-command-driven hand-off, reject-loop mode: deny (fresh session for a clean count).
  const sessionB = 'claude-loop-b';
  runHook({ tool_name: 'Task', session_id: sessionB, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review one' }, cwd });
  runHook({ tool_name: 'Task', session_id: sessionB, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review two' }, cwd });
  hook = runHook(
    { tool_name: 'Task', session_id: sessionB, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-review\nmode=review three' }, cwd },
    { [REJECT_LOOP_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), 'deny', '3rd hand-off must deny under reject-loop');
  assert.match(reasonOf(hook), /system-deep-loop-guard: loop-like repeated dispatch/, 'deny must carry the loop-repeat reason');

  // Mixed-case agent identity still reaches loop rejection.
  const sessionUpper = 'claude-loop-upper';
  runHook({ tool_name: 'Task', session_id: sessionUpper, tool_input: { subagent_type: 'general', prompt: 'Agent: @DEEP-REVIEW\nmode=REVIEW one' }, cwd });
  runHook({ tool_name: 'Task', session_id: sessionUpper, tool_input: { subagent_type: 'general', prompt: 'Agent: @Deep-Review\nmode=Review two' }, cwd });
  hook = runHook(
    { tool_name: 'Task', session_id: sessionUpper, tool_input: { subagent_type: 'general', prompt: 'Agent: @DEEP-REVIEW\nmode=REVIEW three' }, cwd },
    { [REJECT_LOOP_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), 'deny', 'mixed-case identity must still reach loop rejection');

  // Command-driven dispatches never count toward the threshold -- but only when the
  // iteration marker co-occurs with a Config: path resolving to a real, on-disk
  // deep-loop config. This is the genuine command-driven case: the marker AND the
  // filesystem artifact both check out.
  const sessionCmd = 'claude-loop-cmd';
  clearGuardLog(cwd);
  const realConfigDir = path.join(cwd, 'specs', 'example', 'review');
  fs.mkdirSync(realConfigDir, { recursive: true });
  fs.writeFileSync(
    path.join(realConfigDir, 'deep-review-config.json'),
    JSON.stringify({ mode: 'review', maxIterations: 10 }),
  );
  for (let i = 1; i <= 5; i += 1) {
    runHook({
      tool_name: 'Task',
      session_id: sessionCmd,
      tool_input: {
        subagent_type: 'general',
        prompt: `Agent: @deep-review\nIteration: ${i} of 10\n- Config: specs/example/review/deep-review-config.json\nmode=review do it`,
      },
      cwd,
    });
  }
  assert.doesNotMatch(readGuardLog(cwd), /loop-like/, 'genuinely command-driven iterations (marker + real config file) must never trigger loop-repeat warn');

  // Forgery regression: a bare iteration marker with NO Config: line, or one
  // pointing at a path that does not exist, must NOT be exempted -- it has to count toward
  // the loop-repeat threshold like any other hand-off, closing the "just paste the marker
  // text" bypass.
  const sessionForgedNoConfig = 'claude-loop-forged-no-config';
  clearGuardLog(cwd);
  for (let i = 1; i <= 3; i += 1) {
    runHook({ tool_name: 'Task', session_id: sessionForgedNoConfig, tool_input: { subagent_type: 'general', prompt: `Agent: @deep-review\nIteration: ${i} of 10\nmode=review do it` }, cwd });
  }
  assert.match(readGuardLog(cwd), /loop-like repeated dispatch/, 'a bare iteration marker with no Config: reference must not bypass loop-repeat counting');

  const sessionForgedGhostConfig = 'claude-loop-forged-ghost-config';
  clearGuardLog(cwd);
  for (let i = 1; i <= 3; i += 1) {
    runHook({
      tool_name: 'Task',
      session_id: sessionForgedGhostConfig,
      tool_input: {
        subagent_type: 'general',
        prompt: `Agent: @deep-review\nIteration: ${i} of 10\n- Config: specs/does-not-exist/review/deep-review-config.json\nmode=review do it`,
      },
      cwd,
    });
  }
  assert.match(readGuardLog(cwd), /loop-like repeated dispatch/, 'an iteration marker with a Config: path pointing at a nonexistent file must not bypass loop-repeat counting');

  // --- Config scope: only a config the project owns backs the exemption ---

  // Accepted: a valid deep-loop config that lives inside the project root, named
  // by an absolute path that still lands inside it.
  const sessionConfigInside = 'claude-loop-config-inside';
  const scopedConfigDir = path.join(cwd, 'specs', 'scope', 'review');
  fs.mkdirSync(scopedConfigDir, { recursive: true });
  const scopedConfigPath = path.join(scopedConfigDir, 'deep-review-config.json');
  fs.writeFileSync(scopedConfigPath, JSON.stringify({ mode: 'review', maxIterations: 10 }));
  clearGuardLog(cwd);
  for (let i = 1; i <= 5; i += 1) {
    runHook({
      tool_name: 'Task',
      session_id: sessionConfigInside,
      tool_input: {
        subagent_type: 'general',
        prompt: `Agent: @deep-review\nIteration: ${i} of 10\n- Config: ${scopedConfigPath}\nmode=review do it`,
      },
      cwd,
    });
  }
  assert.doesNotMatch(readGuardLog(cwd), /loop-like/, 'a valid config inside the project must keep the dispatch command-driven');

  // Rejected: the same config shape at an absolute path outside the project.
  // Without a project-scope check any JSON file on the machine would exempt a
  // dispatch, so this path has to keep counting toward the threshold.
  const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-task-guard-outside-'));
  process.on('exit', () => fs.rmSync(outsideDir, { recursive: true, force: true }));
  const outsideConfigPath = path.join(outsideDir, 'deep-review-config.json');
  fs.writeFileSync(outsideConfigPath, JSON.stringify({ mode: 'review', maxIterations: 10 }));
  const sessionConfigOutside = 'claude-loop-config-outside';
  clearGuardLog(cwd);
  for (let i = 1; i <= 3; i += 1) {
    runHook({
      tool_name: 'Task',
      session_id: sessionConfigOutside,
      tool_input: {
        subagent_type: 'general',
        prompt: `Agent: @deep-review\nIteration: ${i} of 10\n- Config: ${outsideConfigPath}\nmode=review do it`,
      },
      cwd,
    });
  }
  assert.match(readGuardLog(cwd), /loop-like repeated dispatch/, 'a config at an absolute path outside the project must not exempt the dispatch');

  // Rejected: a symlink inside the project that resolves to that outside config,
  // so a link cannot launder an outside path into a project-relative one.
  const symlinkConfigDir = path.join(cwd, 'specs', 'scope', 'symlinked');
  fs.mkdirSync(symlinkConfigDir, { recursive: true });
  fs.symlinkSync(outsideConfigPath, path.join(symlinkConfigDir, 'deep-review-config.json'));
  const sessionConfigSymlinked = 'claude-loop-config-symlinked';
  clearGuardLog(cwd);
  for (let i = 1; i <= 3; i += 1) {
    runHook({
      tool_name: 'Task',
      session_id: sessionConfigSymlinked,
      tool_input: {
        subagent_type: 'general',
        prompt: `Agent: @deep-review\nIteration: ${i} of 10\n- Config: specs/scope/symlinked/deep-review-config.json\nmode=review do it`,
      },
      cwd,
    });
  }
  assert.match(readGuardLog(cwd), /loop-like repeated dispatch/, 'a symlink inside the project pointing outside it must not exempt the dispatch');

  // Prose collisions and impossible bounds do not bypass repeat counting.
  const nearMisses = [
    'This prose mentions STATE SUMMARY but is not an iteration envelope.',
    'Discuss Iteration: 2 of 5 without treating it as a marker.',
    'Iteration: 5 of 3',
  ];
  nearMisses.forEach((markerText, index) => {
    const sessionID = `claude-near-miss-${index}`;
    clearGuardLog(cwd);
    for (let attempt = 0; attempt < 2; attempt += 1) {
      runHook({ tool_name: 'Task', session_id: sessionID, tool_input: { subagent_type: 'general', prompt: `Agent: @deep-review\nmode=review\n${markerText}` }, cwd });
    }
    assert.match(readGuardLog(cwd), /loop-like repeated dispatch/, `${markerText} must not bypass repeat counting`);
  });

  // Prompt improvement is not a command-owned deep-loop executor.
  clearGuardLog(cwd);
  for (let i = 0; i < 5; i += 1) {
    runHook({ tool_name: 'Task', session_id: 'claude-prompt-improver', tool_input: { subagent_type: 'prompt-improver', prompt: 'Improve this prompt again.' }, cwd });
  }
  assert.doesNotMatch(readGuardLog(cwd), /loop-like/, 'prompt-improver must remain outside deep-loop repeat counting');

  // Non-loop-executor targets (ai-council) are never loop-counted.
  clearGuardLog(cwd);
  for (let i = 1; i <= 5; i += 1) {
    runHook({ tool_name: 'Task', session_id: 'claude-loop-council', tool_input: { subagent_type: 'general', prompt: `Agent: @ai-council\nmode=ai-council plan again (${i})` }, cwd });
  }
  assert.doesNotMatch(readGuardLog(cwd), /loop-like/, 'non-loop-executor targets (ai-council) must never trigger loop-repeat warn');

  // Different sessions do not cross-contaminate loop-repeat counts.
  clearGuardLog(cwd);
  runHook({ tool_name: 'Task', session_id: 'claude-e1', tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' }, cwd });
  runHook({ tool_name: 'Task', session_id: 'claude-e2', tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' }, cwd });
  assert.doesNotMatch(readGuardLog(cwd), /loop-like/, 'separate sessions must not share loop-repeat counts');

  // Fail-open: loop-guard state dir is a file -- write fails, dispatch never denied.
  const blockedStateDirPath = path.join(cwd, '.skilled', 'skills', '.state', 'loop-guard');
  fs.rmSync(blockedStateDirPath, { recursive: true, force: true });
  fs.writeFileSync(blockedStateDirPath, 'not a directory');
  hook = runHook(
    { tool_name: 'Task', session_id: 'claude-failopen', tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-research\nmode=research go' }, cwd },
    { [REJECT_LOOP_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), null, 'unwritable loop state must not deny in reject-loop mode (fail-open)');
  assert.match(
    fs.readFileSync(degradedGuardLogPath(cwd), 'utf8'),
    /reject-mode degraded.*loop state persistence unavailable/i,
    'degraded loop-reject enforcement must be audited to the sibling log',
  );
  fs.rmSync(blockedStateDirPath, { force: true });
  fs.rmSync(degradedGuardLogPath(cwd), { force: true });

  // --- Concurrent hand-offs to one session must not lose increments ---

  const concurrentStateDir = path.join(tmpDir, 'concurrent-state');
  const concurrentSession = 'claude-loop-concurrent';
  const concurrentCount = 16;
  fs.mkdirSync(concurrentStateDir, { recursive: true });
  await recordConcurrently({
    childCount: concurrentCount,
    stateDir: concurrentStateDir,
    sessionID: concurrentSession,
    barrierDir: path.join(tmpDir, 'concurrent-barrier'),
  });
  assert.equal(
    guardCore.readLoopState(concurrentStateDir, concurrentSession).dispatches['deep-review'].count,
    concurrentCount,
    'every concurrent hand-off must survive the shared session-state update',
  );
  assert.equal(
    fs.existsSync(`${guardCore.loopStatePath(concurrentStateDir, concurrentSession)}.lock`),
    false,
    'the per-session lock must be released after the update',
  );

  // A lock whose owner died is stale immediately, even when its file is fresh;
  // waiting for the age window would block a live session for no reason.
  const staleLockStateDir = path.join(tmpDir, 'stale-lock-state');
  const staleLockSession = 'claude-loop-stale-lock';
  fs.mkdirSync(staleLockStateDir, { recursive: true });
  const staleLockPath = `${guardCore.loopStatePath(staleLockStateDir, staleLockSession)}.lock`;
  fs.writeFileSync(staleLockPath, `${deadProcessPid()} abandoned-lock\n`);
  const staleLockResult = guardCore.recordLoopDispatch(
    staleLockStateDir,
    staleLockSession,
    'deep-review',
    false,
  );
  assert.equal(staleLockResult.count, 1, 'a takeover must record on the current count');
  assert.equal(staleLockResult.persisted, true, 'a takeover must persist the updated state');
  assert.equal(fs.existsSync(staleLockPath), false, 'a stale lock must be removed after takeover');
  assert.deepEqual(
    fs.readdirSync(staleLockStateDir).filter((name) => name.includes('.lock.stale-')),
    [],
    'a completed takeover must leave no claim file behind',
  );

  // Two contenders that both judge the same stale lock abandoned must not both
  // replace it: the loser waits for the winner's lock instead of deleting it.
  const takeoverRaceDir = path.join(tmpDir, 'takeover-race-state');
  const takeoverRaceSession = 'claude-loop-takeover-race';
  fs.mkdirSync(takeoverRaceDir, { recursive: true });
  const takeoverRaceLockPath = `${guardCore.loopStatePath(takeoverRaceDir, takeoverRaceSession)}.lock`;
  fs.writeFileSync(takeoverRaceLockPath, `${deadProcessPid()} abandoned-race\n`);
  const takeoverRaceLockTime = new Date(Date.now() - 60 * 1000);
  fs.utimesSync(takeoverRaceLockPath, takeoverRaceLockTime, takeoverRaceLockTime);
  const delayPreload = writeRecordDelayPreload(tmpDir);
  await recordConcurrently({
    childCount: 2,
    stateDir: takeoverRaceDir,
    sessionID: takeoverRaceSession,
    barrierDir: path.join(tmpDir, 'takeover-race-barrier'),
    envForChild: (index) => ({
      NODE_OPTIONS: preloadNodeOptions(delayPreload),
      RECORD_LOCK_DELAY_MS: index === 0 ? '50' : '300',
      RECORD_STATE_WRITE_DELAY_MS: index === 0 ? '800' : '0',
    }),
  });
  assert.equal(
    guardCore.readLoopState(takeoverRaceDir, takeoverRaceSession).dispatches['deep-review'].count,
    2,
    'one contender must take the stale lock over and the other must wait for it',
  );
  assert.equal(fs.existsSync(takeoverRaceLockPath), false, 'the winning lock must be released');
  assert.deepEqual(
    fs.readdirSync(takeoverRaceDir).filter((name) => name.includes('.lock.stale-')),
    [],
    'a rejected takeover claim must not survive',
  );

  // A live owner keeps its lock however old the file is; age alone is not proof
  // that the owner died.
  const liveLockStateDir = path.join(tmpDir, 'live-lock-state');
  const liveLockSession = 'claude-loop-live-lock';
  fs.mkdirSync(liveLockStateDir, { recursive: true });
  const liveLockPath = `${guardCore.loopStatePath(liveLockStateDir, liveLockSession)}.lock`;
  const liveLockContents = `${process.pid} live-owner\n`;
  fs.writeFileSync(liveLockPath, liveLockContents);
  const liveLockTime = new Date(Date.now() - 60 * 1000);
  fs.utimesSync(liveLockPath, liveLockTime, liveLockTime);
  const liveLockResult = guardCore.recordLoopDispatch(
    liveLockStateDir,
    liveLockSession,
    'deep-review',
    false,
  );
  assert.equal(liveLockResult.persisted, false, 'a live lock must time out instead of being taken over');
  assert.equal(fs.existsSync(liveLockPath), true, 'a live owner must keep its lock');
  assert.equal(fs.readFileSync(liveLockPath, 'utf8'), liveLockContents, 'a live lock must not be rewritten');
  assert.equal(
    fs.existsSync(guardCore.loopStatePath(liveLockStateDir, liveLockSession)),
    false,
    'a timed-out acquisition must not create the state file',
  );

  // A timed-out acquisition reports the count already on disk without rewriting it.
  const timeoutStateDir = path.join(tmpDir, 'timeout-state');
  const timeoutSession = 'claude-loop-timeout';
  const timeoutStatePath = guardCore.loopStatePath(timeoutStateDir, timeoutSession);
  guardCore.writeLoopStateAtomic(timeoutStateDir, timeoutSession, {
    sessionId: timeoutSession,
    dispatches: { 'deep-review': { count: 7 } },
  });
  const timeoutLockPath = `${timeoutStatePath}.lock`;
  fs.writeFileSync(timeoutLockPath, `${process.pid} timeout-owner\n`);
  const stateBeforeTimeout = fs.readFileSync(timeoutStatePath, 'utf8');
  const timeoutResult = guardCore.recordLoopDispatch(
    timeoutStateDir,
    timeoutSession,
    'deep-review',
    false,
  );
  assert.deepEqual(
    timeoutResult,
    { count: 8, persisted: false },
    'a timed-out acquisition must report the current count without persisting',
  );
  assert.equal(
    fs.readFileSync(timeoutStatePath, 'utf8'),
    stateBeforeTimeout,
    'a timed-out acquisition must leave the state file untouched',
  );
  assert.equal(fs.existsSync(timeoutLockPath), true, 'a timed-out acquisition must keep the live lock');

  // The sweep owns abandoned locks and takeover claims, not only temp and state files.
  const sweepStateDir = path.join(tmpDir, 'sweep-lock-state');
  const sweepSession = 'claude-loop-sweep-lock';
  fs.mkdirSync(sweepStateDir, { recursive: true });
  const sweepDeadPid = deadProcessPid();
  const sweepLockPath = `${guardCore.loopStatePath(sweepStateDir, sweepSession)}.lock`;
  fs.writeFileSync(sweepLockPath, `${sweepDeadPid} abandoned-sweep\n`);
  const sweepClaimPath = `${sweepLockPath}.stale-${sweepDeadPid}-claim`;
  fs.writeFileSync(sweepClaimPath, `${sweepDeadPid} abandoned-claim\n`);
  const sweepLiveLockPath = `${guardCore.loopStatePath(sweepStateDir, 'claude-loop-sweep-live')}.lock`;
  fs.writeFileSync(sweepLiveLockPath, `${process.pid} live-sweep\n`);
  guardCore.sweepStaleLoopGuardStates(sweepStateDir, {});
  assert.equal(fs.existsSync(sweepLockPath), false, 'the sweep must remove a dead owner\'s lock');
  assert.equal(fs.existsSync(sweepClaimPath), false, 'the sweep must remove an abandoned takeover claim');
  assert.equal(fs.existsSync(sweepLiveLockPath), true, 'the sweep must keep a live owner\'s lock');

  // --- A missing projectDir resolves relative Config: paths against cwd ---

  const fallbackConfigDir = path.join(tmpDir, 'specs', 'fallback', 'review');
  fs.mkdirSync(fallbackConfigDir, { recursive: true });
  fs.writeFileSync(
    path.join(fallbackConfigDir, 'deep-review-config.json'),
    JSON.stringify({ mode: 'review', maxIterations: 10 }),
  );
  const fallbackSession = 'claude-loop-cwd-fallback';
  const priorCwd = process.cwd();
  try {
    process.chdir(tmpDir);
    const fallbackResult = guardCore.evaluateDispatch({
      subagentType: 'general',
      prompt: 'Agent: @deep-review\nIteration: 1 of 10\n- Config: specs/fallback/review/deep-review-config.json\nmode=review',
      sessionID: fallbackSession,
      env: {},
    });
    assert.equal(fallbackResult.decision, 'allow', 'a cwd-resolved config must not warn');
  } finally {
    process.chdir(priorCwd);
  }
  const fallbackState = guardCore.readLoopState(
    path.join(tmpDir, '.skilled', 'skills', '.state', 'loop-guard'),
    fallbackSession,
  );
  assert.equal(
    fallbackState.dispatches['deep-review'].lastCommandDriven,
    true,
    'a caller without projectDir must resolve relative Config: paths against cwd',
  );
  assert.equal(
    fallbackState.dispatches['deep-review'].count,
    0,
    'a cwd-resolved config must keep the dispatch command-driven',
  );

  console.log('claude-task-dispatch-guard.test.cjs: all assertions passed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
