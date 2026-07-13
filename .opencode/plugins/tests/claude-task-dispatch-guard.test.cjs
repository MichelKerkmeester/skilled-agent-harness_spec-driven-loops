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
const { spawnSync } = require('node:child_process');

const REJECT_ENV = 'MK_DEEP_LOOP_GUARD_REJECT';
const REJECT_LOOP_ENV = 'MK_DEEP_LOOP_GUARD_REJECT_LOOP';
const GUARD_LOG_RELATIVE = ['.opencode', 'skills', '.loop-guard-state', 'guard-warnings.log'];

const HOOK_PATH = path.join(
  __dirname,
  '..',
  '..',
  'skills',
  'system-deep-loop',
  'runtime',
  'hooks',
  'claude',
  'task-dispatch-guard.cjs',
);

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

function main() {
  assert.equal(fs.existsSync(HOOK_PATH), true, 'the Claude task-dispatch-guard hook script must exist');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-task-guard-'));
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

  // Every workflow mode registered to a multiplexed agent remains valid.
  for (const workflowMode of ['agent-improvement', 'model-benchmark', 'skill-benchmark', 'ai-system-improvement']) {
    clearGuardLog(cwd);
    hook = runHook({
      tool_name: 'Task',
      tool_input: { subagent_type: 'general', prompt: `Deep Route: mode=${workflowMode}; target_agent=@deep-improvement` },
      cwd,
    });
    assert.equal(hook.stdout, '', `${workflowMode} must remain valid for deep-improvement`);
  }

  // An unregistered mode for a multiplexed agent lists the sorted permitted set.
  clearGuardLog(cwd);
  hook = runHook({
    tool_name: 'Task',
    tool_input: { subagent_type: 'general', prompt: 'Deep Route: mode=nonsense; target_agent=@deep-improvement' },
    cwd,
  });
  assert.match(contextOf(hook), /registry modes="agent-improvement\|ai-system-improvement\|model-benchmark\|skill-benchmark"/, 'mismatch advisory must list the sorted permitted modes');

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
  assert.match(contextOf(hook), /mk-deep-loop-guard.*mode mismatch/i, 'default mismatch must surface an advisory');
  assert.match(readGuardLog(cwd), /mk-deep-loop-guard.*mode mismatch/i, 'default mismatch must append to the shared warning log');

  // Mismatch, reject mode: deny with the guard's reason.
  hook = runHook(
    { tool_name: 'Task', tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' }, cwd },
    { [REJECT_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), 'deny', 'reject mode must deny a mismatch');
  assert.match(reasonOf(hook), /mk-deep-loop-guard: Deep Route mode mismatch/, 'deny must carry the mismatch reason');

  // Fail-open: registry unreadable, mismatch present, reject on -- approve + degraded audit, no deny.
  const registryPath = path.join(cwd, '.opencode', 'skills', 'system-deep-loop', 'mode-registry.json');
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
  assert.match(reasonOf(hook), /mk-deep-loop-guard: loop-like repeated dispatch/, 'deny must carry the loop-repeat reason');

  // Mixed-case agent identity still reaches loop rejection.
  const sessionUpper = 'claude-loop-upper';
  runHook({ tool_name: 'Task', session_id: sessionUpper, tool_input: { subagent_type: 'general', prompt: 'Agent: @DEEP-REVIEW\nmode=REVIEW one' }, cwd });
  runHook({ tool_name: 'Task', session_id: sessionUpper, tool_input: { subagent_type: 'general', prompt: 'Agent: @Deep-Review\nmode=Review two' }, cwd });
  hook = runHook(
    { tool_name: 'Task', session_id: sessionUpper, tool_input: { subagent_type: 'general', prompt: 'Agent: @DEEP-REVIEW\nmode=REVIEW three' }, cwd },
    { [REJECT_LOOP_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), 'deny', 'mixed-case identity must still reach loop rejection');

  // deep-alignment is a command-owned loop executor: repeated hand-offs reach loop rejection.
  const sessionAlign = 'claude-loop-alignment';
  runHook({ tool_name: 'Task', session_id: sessionAlign, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-alignment\nmode=alignment one' }, cwd });
  runHook({ tool_name: 'Task', session_id: sessionAlign, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-alignment\nmode=alignment two' }, cwd });
  hook = runHook(
    { tool_name: 'Task', session_id: sessionAlign, tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-alignment\nmode=alignment three' }, cwd },
    { [REJECT_LOOP_ENV]: '1' },
  );
  assert.equal(decisionOf(hook), 'deny', 'deep-alignment repeated hand-off must reach loop rejection');
  assert.match(reasonOf(hook), /mk-deep-loop-guard: loop-like repeated dispatch/, 'deny must carry the loop-repeat reason for deep-alignment');

  // Command-driven dispatches never count toward the threshold.
  const sessionCmd = 'claude-loop-cmd';
  clearGuardLog(cwd);
  for (let i = 1; i <= 5; i += 1) {
    runHook({ tool_name: 'Task', session_id: sessionCmd, tool_input: { subagent_type: 'general', prompt: `Agent: @deep-review\nIteration: ${i} of 10\nmode=review do it` }, cwd });
  }
  assert.doesNotMatch(readGuardLog(cwd), /loop-like/, 'command-driven iterations must never trigger loop-repeat warn');

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
  const blockedStateDirPath = path.join(cwd, '.opencode', 'skills', '.loop-guard-state');
  fs.rmSync(blockedStateDirPath, { recursive: true, force: true });
  fs.writeFileSync(blockedStateDirPath, 'not a directory');
  hook = runHook(
    { tool_name: 'Task', session_id: 'claude-failopen', tool_input: { subagent_type: 'general', prompt: 'Agent: @deep-improvement\nmode=agent-improvement go' }, cwd },
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

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('claude-task-dispatch-guard.test.cjs: all assertions passed');
}

main();
