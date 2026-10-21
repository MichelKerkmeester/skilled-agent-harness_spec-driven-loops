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
const { randomUUID } = require('node:crypto');
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

// The observer preload patches the fs primitives the guard core destructures at
// require time, so it can read the lock path at its first appearance: the open
// that creates it directly, or the link that installs a fully written temp file.
const LOCK_OBSERVER_PRELOAD = `
const fs = require('node:fs');

const lockPath = process.env.LOCK_OBSERVE_LOCK_PATH;
const observationPath = process.env.LOCK_OBSERVE_PATH;
let observed = false;

function record(source) {
  if (observed) return;
  let content;
  try {
    content = fs.readFileSync(lockPath, 'utf8');
  } catch (_) {
    return;
  }
  observed = true;
  fs.writeFileSync(observationPath, JSON.stringify({ source, content, pid: process.pid }));
}

const originalOpenSync = fs.openSync;
fs.openSync = function observedOpenSync(...args) {
  const descriptor = originalOpenSync.apply(this, args);
  if (args[0] === lockPath) record('open');
  return descriptor;
};

const originalLinkSync = fs.linkSync;
fs.linkSync = function observedLinkSync(...args) {
  const result = originalLinkSync.apply(this, args);
  if (args[1] === lockPath) record('link');
  return result;
};
`;

const LOCK_OBSERVER_SCRIPT = `
const { recordLoopDispatch } = require(process.env.GUARD_CORE_PATH);
recordLoopDispatch(
  process.env.LOCK_STATE_DIR,
  process.env.LOCK_SESSION_ID,
  'deep-review',
  false,
);
`;

function observeLockCreation({ stateDir, sessionID, preloadPath, observationPath }) {
  const lockPath = `${guardCore.loopStatePath(stateDir, sessionID)}.lock`;
  fs.writeFileSync(preloadPath, LOCK_OBSERVER_PRELOAD);
  fs.rmSync(observationPath, { force: true });
  const result = spawnSync(
    process.execPath,
    ['--require', preloadPath, '-e', LOCK_OBSERVER_SCRIPT],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        GUARD_CORE_PATH,
        LOCK_STATE_DIR: stateDir,
        LOCK_SESSION_ID: sessionID,
        LOCK_OBSERVE_PATH: observationPath,
        LOCK_OBSERVE_LOCK_PATH: lockPath,
      },
    },
  );
  assert.equal(result.status, 0, `lock observer exited ${result.status}: ${result.stderr || ''}`);
  return JSON.parse(fs.readFileSync(observationPath, 'utf8'));
}

async function recordConcurrently({
  childCount,
  stateDir,
  sessionID,
  barrierDir,
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

  // The owner record must be readable the moment the lock path first appears: a
  // creator paused before its write would otherwise leave a live-looking lock
  // with unreadable content that only the stale window could retire.
  const observedLockStateDir = path.join(tmpDir, 'observed-lock-state');
  const observedLockSession = 'claude-loop-observed-lock';
  const observedLock = observeLockCreation({
    stateDir: observedLockStateDir,
    sessionID: observedLockSession,
    preloadPath: path.join(tmpDir, 'lock-observer-preload.cjs'),
    observationPath: path.join(tmpDir, 'lock-observation.json'),
  });
  assert.match(
    observedLock.content,
    /^\d+ \S+\n$/,
    'the lock path must never be visible without a complete owner record',
  );
  assert.equal(
    observedLock.content.split(' ')[0],
    String(observedLock.pid),
    'the visible lock must name the acquiring process as its owner',
  );
  assert.equal(
    fs.existsSync(`${guardCore.loopStatePath(observedLockStateDir, observedLockSession)}.lock`),
    false,
    'the observed acquisition must release its lock',
  );

  // A lock whose owner died is broken immediately, even when its file is fresh;
  // waiting for the age window would block a live session for no reason. The
  // update records exactly one increment on the count already on disk.
  const deadLockStateDir = path.join(tmpDir, 'dead-lock-state');
  const deadLockSession = 'claude-loop-dead-lock';
  const deadLockStatePath = guardCore.loopStatePath(deadLockStateDir, deadLockSession);
  guardCore.writeLoopStateAtomic(deadLockStateDir, deadLockSession, {
    sessionId: deadLockSession,
    dispatches: { 'deep-review': { count: 2 } },
  });
  const deadLockPath = `${deadLockStatePath}.lock`;
  fs.writeFileSync(deadLockPath, `${deadProcessPid()} abandoned-lock\n`);
  const deadLockResult = guardCore.recordLoopDispatch(
    deadLockStateDir,
    deadLockSession,
    'deep-review',
    false,
  );
  assert.deepEqual(
    deadLockResult,
    { count: 3, persisted: true },
    'breaking a dead owner\'s lock must record exactly one increment',
  );
  assert.equal(fs.existsSync(deadLockPath), false, 'a dead owner\'s lock must be removed');
  assert.equal(
    guardCore.readLoopState(deadLockStateDir, deadLockSession).dispatches['deep-review'].count,
    3,
    'the increment must reach the state file once, not once per acquisition attempt',
  );
  assert.deepEqual(
    fs.readdirSync(deadLockStateDir).filter((name) => name.endsWith('.break')),
    [],
    'a completed break must release the break lock',
  );

  // A live breaker owns the decision: while it holds the break lock, acquisition
  // must neither remove the dead owner's lock nor take the break lock away.
  const breakHeldStateDir = path.join(tmpDir, 'break-held-state');
  const breakHeldSession = 'claude-loop-break-held';
  const breakHeldStatePath = guardCore.loopStatePath(breakHeldStateDir, breakHeldSession);
  guardCore.writeLoopStateAtomic(breakHeldStateDir, breakHeldSession, {
    sessionId: breakHeldSession,
    dispatches: { 'deep-review': { count: 4 } },
  });
  const breakHeldLockPath = `${breakHeldStatePath}.lock`;
  const breakHeldLockContents = `${deadProcessPid()} abandoned-break-held\n`;
  const breakHeldContents = `${process.pid} live-breaker\n`;
  fs.writeFileSync(breakHeldLockPath, breakHeldLockContents);
  fs.writeFileSync(`${breakHeldLockPath}.break`, breakHeldContents);
  const stateBeforeBreakHeld = fs.readFileSync(breakHeldStatePath, 'utf8');
  const breakHeldResult = guardCore.recordLoopDispatch(
    breakHeldStateDir,
    breakHeldSession,
    'deep-review',
    false,
  );
  assert.deepEqual(
    breakHeldResult,
    { count: 5, persisted: false },
    'a held break lock must make acquisition time out without persisting',
  );
  assert.equal(
    fs.readFileSync(breakHeldLockPath, 'utf8'),
    breakHeldLockContents,
    'a held break lock must keep a dead owner\'s lock in place',
  );
  assert.equal(
    fs.readFileSync(`${breakHeldLockPath}.break`, 'utf8'),
    breakHeldContents,
    'a breaker that lost the break lock must not remove it',
  );
  assert.equal(
    fs.readFileSync(breakHeldStatePath, 'utf8'),
    stateBeforeBreakHeld,
    'a timed-out break must leave the state file untouched',
  );

  // A dead owner's lock present before the children start must be broken exactly
  // once, and every child must still land its own increment.
  const deadLockConcurrentStateDir = path.join(tmpDir, 'dead-lock-concurrent-state');
  const deadLockConcurrentSession = 'claude-loop-dead-lock-concurrent';
  const deadLockConcurrentCount = 12;
  fs.mkdirSync(deadLockConcurrentStateDir, { recursive: true });
  const deadLockConcurrentLockPath =
    `${guardCore.loopStatePath(deadLockConcurrentStateDir, deadLockConcurrentSession)}.lock`;
  fs.writeFileSync(deadLockConcurrentLockPath, `${deadProcessPid()} abandoned-concurrent\n`);
  await recordConcurrently({
    childCount: deadLockConcurrentCount,
    stateDir: deadLockConcurrentStateDir,
    sessionID: deadLockConcurrentSession,
    barrierDir: path.join(tmpDir, 'dead-lock-concurrent-barrier'),
  });
  assert.equal(
    guardCore.readLoopState(deadLockConcurrentStateDir, deadLockConcurrentSession)
      .dispatches['deep-review'].count,
    deadLockConcurrentCount,
    'every concurrent hand-off must survive a dead-owner lock at the start',
  );
  assert.deepEqual(
    fs.readdirSync(deadLockConcurrentStateDir)
      .filter((name) => name.endsWith('.lock') || name.endsWith('.break')),
    [],
    'the dead-owner lock and every break lock must be gone after the updates',
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

  // The sweep removes per-session locks on the same owner-liveness rule as
  // acquisition. A live owner keeps its lock however old the file is: its pid,
  // not the mtime, is the evidence that the update is still in flight.
  const sweepStateDir = path.join(tmpDir, 'sweep-lock-state');
  const sweepSession = 'claude-loop-sweep-lock';
  fs.mkdirSync(sweepStateDir, { recursive: true });
  const sweepDeadPid = deadProcessPid();
  const sweepLockPath = `${guardCore.loopStatePath(sweepStateDir, sweepSession)}.lock`;
  fs.writeFileSync(sweepLockPath, `${sweepDeadPid} abandoned-sweep\n`);
  const sweepLiveLockPath =
    `${guardCore.loopStatePath(sweepStateDir, 'claude-loop-sweep-live')}.lock`;
  fs.writeFileSync(sweepLiveLockPath, `${process.pid} live-sweep\n`);
  const staleWindowAgo = new Date(Date.now() - 60 * 1000);
  fs.utimesSync(sweepLiveLockPath, staleWindowAgo, staleWindowAgo);

  // Unreadable content names no owner to probe, so the stale window decides.
  const sweepFreshUnreadablePath =
    `${guardCore.loopStatePath(sweepStateDir, 'claude-loop-sweep-fresh')}.lock`;
  fs.writeFileSync(sweepFreshUnreadablePath, 'not an owner\n');
  const sweepOldUnreadablePath =
    `${guardCore.loopStatePath(sweepStateDir, 'claude-loop-sweep-old')}.lock`;
  fs.writeFileSync(sweepOldUnreadablePath, 'not an owner\n');
  fs.utimesSync(sweepOldUnreadablePath, staleWindowAgo, staleWindowAgo);

  // A creator killed between writing its lock temp file and linking it leaves a
  // file the ordinary lock branch cannot see; the sweep retires it by embedded
  // pid liveness while keeping a live creator's temp file.
  const sweepDeadTempBase = guardCore.loopStatePath(
    sweepStateDir,
    'claude-loop-sweep-dead-temp',
  );
  const sweepDeadTempPath = `${sweepDeadTempBase}.lock.tmp-${sweepDeadPid}-${randomUUID()}`;
  const sweepLiveTempBase = guardCore.loopStatePath(
    sweepStateDir,
    'claude-loop-sweep-live-temp',
  );
  const sweepLiveTempPath = `${sweepLiveTempBase}.lock.tmp-${process.pid}-${randomUUID()}`;
  fs.writeFileSync(sweepDeadTempPath, `${sweepDeadPid} dead-temp\n`);
  fs.writeFileSync(sweepLiveTempPath, `${process.pid} live-temp\n`);

  guardCore.sweepStaleLoopGuardStates(sweepStateDir, {});
  assert.equal(fs.existsSync(sweepLockPath), false, 'the sweep must remove a dead owner\'s lock');
  assert.equal(
    fs.existsSync(sweepLiveLockPath),
    true,
    'the sweep must keep a live owner\'s lock past the stale window',
  );
  assert.equal(
    fs.existsSync(sweepFreshUnreadablePath),
    true,
    'unreadable content inside the stale window must survive the sweep',
  );
  assert.equal(
    fs.existsSync(sweepOldUnreadablePath),
    false,
    'unreadable content past the stale window must be swept',
  );
  assert.equal(
    fs.existsSync(sweepDeadTempPath),
    false,
    'the sweep must remove a dead owner\'s lock temp file',
  );
  assert.equal(
    fs.existsSync(sweepLiveTempPath),
    true,
    'the sweep must keep a live owner\'s lock temp file',
  );
  assert.deepEqual(
    fs.readdirSync(sweepStateDir).filter((name) => name.endsWith('.break')),
    [],
    'a completed sweep break must release the break lock',
  );

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
