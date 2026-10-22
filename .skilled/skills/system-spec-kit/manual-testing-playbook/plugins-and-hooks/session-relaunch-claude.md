---
title: "Claude Session Relaunch"
description: "Scenarios for Claude context nudges, prepared handoffs, Stop arming, killer timeouts and wrapper relaunches."
trigger_phrases:
  - "Claude session relaunch"
  - "session-relaunch-claude"
  - "skilled-loop handoff"
  - "Claude context nudge"
version: 1.0.7.0
id: session-relaunch-claude
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Claude Session Relaunch

---

## 1. OVERVIEW

This playbook covers live Claude handoffs and automatable checks for the session-relaunch hooks and wrapper. Live tmux runs cover the Claude handoff. Node tests cover thresholds, prepare order, I/O fallbacks, relaunch limits, killer locking and wrapper edge cases.

---

## 2. SCENARIO CONTRACT

Operators confirm that a context nudge can lead to a validated note, Stop-time arming and a fresh Claude session that claims and completes the note.

- Objective: Verify threshold context, note validation, Stop arming, process shutdown, wrapper relaunch, note status changes and hop and age limits.
- Real user request: Carry this task into a new Claude session before context compaction, then finish the remaining work.
- Prompt: Start a short task. Follow the session-relaunch nudge. Finish the remaining work in the receiving Claude session.
- Expected execution process: Run Claude inside tmux with `SESSION_RELAUNCH_THRESHOLD=0.05`, prepare the note when the nudge appears, wait for Stop to arm the record when the transcript path is present and background tasks have drained, then confirm the wrapper relaunches with the claim seed.
- Expected signals: The relaunch record moves from pending to armed and is consumed by the wrapper. The receiving session starts with a `[session-relaunch]` claim seed. The note moves from open to claimed to done.
- Pass/fail: PASS if the new session claims the same note and completes its remaining work after an armed handoff. FAIL if Stop arms without a transcript path, the wrapper declines an eligible record or the receiving session cannot claim the note.

---

## 3. TEST EXECUTION

### Primary Scenario

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| session-relaunch-claude | Claude session relaunch | Live: follow a prepared note through a tmux relaunch. | Start a short task. Follow the session-relaunch nudge. Finish the remaining work in the receiving Claude session. | tmux new-session -d -s session-relaunch-check 'SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop claude "Carry this short task through the handoff and finish it in the receiving session."'<br>tmux attach -t session-relaunch-check | Prepare exits 0 and writes pending. Stop arms the record after the transcript path is present and background tasks have drained. The wrapper starts Claude with the claim seed. The note reaches done. | Capture the tmux pane and handoff status changes. Save relevant relaunch.log entries and the output of `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history --last 3`. | PASS when the same handoff reaches done after a new Claude process starts with the seed. FAIL when an eligible armed record is declined or the note cannot be claimed. | Check note frontmatter and sections. Check Stop session id, runtime log and hop or age decline reason. |

Three 2026-10-19 benchmark reports hold the outcomes, operator inputs and evidence paths for this live check: [`2026-10-19--manual-testing-playbook--session-relaunch-final-code/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-final-code/README.md) records the final-code round, [`2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/README.md) records the earlier runs made while the gaps were being fixed, and [`2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/`](../../benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/README.md) records the run with no Gate 3 answer.

### Supplemental Checks

#### Nudge at threshold (Live)

Start a Claude session through `skilled-loop` with a small context window in a repository where the Claude hooks are installed. Inside the loop the nudge asks for a hop. Continue turns until the latest assistant usage reaches the configured threshold. Confirm that Claude receives a context nudge with a handoff path and that the nudge level is recorded once in nudge-<session-id>.json. Exit without preparing a note so this check does not request a wrapper hop.

~~~bash
SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 bash .skilled/bin/skilled-loop claude "Tell me when the handoff nudge arrives, then wait."
~~~

Evidence: the model responds to the nudge and the per-session nudge state records the reached level. PASS when the first eligible level arrives once. FAIL when no context is injected at or above the threshold or repeated events send the same level again.

#### No nudge below threshold (Automatable)

Run the Claude adapter suite. Its below-threshold case uses a fill ratio of 799/1000 with a threshold of 0.80 and expects empty stdout.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
~~~

Evidence: the named below-threshold test passes. PASS when it emits no context. FAIL when the test reports an additionalContext payload or a non-zero exit.

#### Prepare order and shell-child refusal (Automatable)

Run the CLI suite. It verifies that an invalid note exits 2 first, that a valid note outside skilled-loop prints the manual command and exits 3 without inspecting running work, and that a live shell child inside the loop makes prepare exit 2.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs
~~~

Evidence: the invalid-note, outside-loop and live-bash-child cases pass. The outside-loop case supplies an invalid `CLAUDE_PID` and still receives exit 3, so prepare skipped the running-work check. PASS when the three paths return their documented status and the refused cases write no pending record. FAIL when prepare checks for a shell child outside the loop or writes pending for an invalid note.

#### Killer timeout disarms and notifies (Automatable)

This direct test uses a short timeout and a long idle period. It replaces only the osascript process call with a recorder, so it checks the notification attempt without displaying an operating-system notification.

~~~bash
node <<'NODE'
const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const realSpawnSync = childProcess.spawnSync;
const notifications = [];
childProcess.spawnSync = (command, args, options) => {
  if (command === 'osascript') {
    notifications.push(args.join(' '));
    return { status: 0, stdout: '', stderr: '' };
  }
  return realSpawnSync(command, args, options);
};
const core = require('./.skilled/hooks/session-relaunch/lib/relaunch-core.cjs');
const killer = require('./.skilled/hooks/session-relaunch/lib/killer.cjs');
(async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-notify-'));
  try {
    const env = {
      ...process.env,
      XDG_RUNTIME_DIR: path.join(root, 'runtime'),
      SESSION_RELAUNCH_REPO_ROOT: root,
      SKILLED_LOOP_ID: String(process.pid)
    };
    fs.mkdirSync(env.XDG_RUNTIME_DIR, { recursive: true });
    const loopId = env.SKILLED_LOOP_ID;
    const transcript = path.join(root, 'transcript.jsonl');
    fs.writeFileSync(transcript, '{"type":"user"}\n');
    core.preparePending({
      loopId,
      handoffPath: path.join(root, 'handoff.md'),
      sessionId: 'notification-check',
      runtime: 'claude',
      cwd: root,
      hops: 0,
      env
    });
    core.arm({ loopId, cwd: root, env });
    await killer.main([
      '--loop-id', loopId,
      '--target-pid', loopId,
      '--transcript', transcript,
      '--idle-ms', '10000',
      '--timeout-ms', '50'
    ], env);
    const record = core.readRelaunchFile(loopId, env);
    assert.equal(record.status, 'disarmed');
    assert.equal(record.disarmReason, 'killer-timeout');
    assert.equal(notifications.length, 1);
    assert.match(notifications[0], /Session relaunch needs attention \(killer timed out\)/);
    process.stdout.write('PASS: timeout disarmed the record and attempted a notification\n');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
})().catch((error) => {
  process.stderr.write(error.stack + '\n');
  process.exitCode = 1;
});
NODE
~~~

Evidence: the record is disarmed with reason killer-timeout and the osascript stub receives one notification command whose title says the killer timed out. When `SKILLED_LOOP_MANUAL_TEMPLATE` is set without exactly one note placeholder, the command also carries a subtitle that says the template was ignored and why. PASS when both assertions hold. FAIL when the record stays armed or the notification call is not attempted.

#### Kill switch disables both hooks (Automatable)

This test creates a pending record, then starts each Claude adapter with SYSTEM_SESSION_RELAUNCH_DISABLED=1. The context adapter must emit nothing. The Stop adapter must leave the record pending.

~~~bash
node <<'NODE'
const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const core = require('./.skilled/hooks/session-relaunch/lib/relaunch-core.cjs');
const repo = process.cwd();
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-disabled-'));
try {
  const loopId = String(process.pid);
  const sessionId = 'disabled-check';
  const transcript = path.join(root, 'transcript.jsonl');
  const env = {
    ...process.env,
    XDG_RUNTIME_DIR: path.join(root, 'runtime'),
    SESSION_RELAUNCH_REPO_ROOT: repo,
    SKILLED_LOOP_ID: loopId,
    SYSTEM_SESSION_RELAUNCH_DISABLED: '1'
  };
  fs.mkdirSync(env.XDG_RUNTIME_DIR, { recursive: true });
  fs.writeFileSync(transcript, '{"type":"user"}\n');
  core.preparePending({
    loopId,
    handoffPath: path.join(root, 'handoff.md'),
    sessionId,
    runtime: 'claude',
    cwd: repo,
    hops: 0,
    env
  });
  const payload = JSON.stringify({
    hook_event_name: 'PostToolUse',
    session_id: sessionId,
    transcript_path: transcript,
    cwd: repo,
    background_tasks: []
  });
  const context = childProcess.spawnSync(
    process.execPath,
    ['.skilled/hooks/session-relaunch/claude/context-nudge.mjs'],
    { cwd: repo, env, input: payload, encoding: 'utf8' }
  );
  const stop = childProcess.spawnSync(
    process.execPath,
    ['.skilled/hooks/session-relaunch/claude/stop-arm.mjs'],
    { cwd: repo, env, input: payload, encoding: 'utf8' }
  );
  assert.equal(context.status, 0);
  assert.equal(context.stdout, '');
  assert.equal(stop.status, 0);
  assert.equal(stop.stdout, '');
  assert.equal(core.readRelaunchFile(loopId, env).status, 'pending');
  process.stdout.write('PASS: both adapters stayed silent and the record stayed pending\n');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
NODE
~~~

Evidence: both adapter processes exit 0 without stdout and the record remains pending. PASS when neither adapter emits or arms state. FAIL when either adapter writes output or changes the record.

#### Hop cap limits repeated relaunches (Automatable)

Run the wrapper suite:

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
~~~

Evidence: with `SESSION_RELAUNCH_MAX_HOPS=2`, the test records three launches total, with hop counts 0, 1 and 2. PASS when the wrapper stops after the second relaunch. FAIL when it starts another Claude process.

The cap also stops the sender, and the other suites cover that side. `prepare` at the cap writes no record: it prints a `hop limit reached` line naming auto-compaction as the fallback, then the manual claim command, logs `prepare-declined` with reason `hop-cap` and exits 3, leaving the note open. The adapters emit no nudge at the cap, and the killer un-arms an armed record that reached it with reason `hop-cap`, logs `killer-hop-cap` and signals nothing. The cases are `prepare declines at the hop limit without writing a relaunch record`, `context-nudge emits nothing at the hop limit` and `killer unarms an armed record at the hop limit without signalling`.

#### Zero limits and corrupt relaunch file (Automatable)

Run the CLI suite:

~~~bash
node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs
~~~

Evidence: zero `SESSION_RELAUNCH_MAX_HOPS` returns reason `hop-cap`. Zero `SESSION_RELAUNCH_MAX_AGE_MIN` returns reason `stale`. Corrupt JSON produces a decline with reason `no-file`. PASS when all three declines are returned as JSON without a thrown process error. FAIL when zero falls back to the default or corrupt JSON is treated as a relaunch.

#### Read failures return safe outcomes (Automatable)

Run the context and record suites:

~~~bash
node --test \
  .skilled/hooks/session-relaunch/tests/context-usage.test.cjs \
  .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
~~~

Evidence: context tests simulate transcript and settings read errors, then expect absent usage or the next settings source. The relaunch-core suite simulates `EACCES` while arming and expects no armable record. `should-relaunch` treats `EACCES`, `ENOTDIR` or `EISDIR` record reads as a no-file decline. Other CLI errors exit 2. PASS when the covered paths return their documented fallback or decline without an uncaught exception. FAIL when a read error escapes or blocks its fallback.

#### Adapter session and transcript gates (Automatable)

Run the Claude adapter suite:

~~~bash
node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
~~~

Evidence: a context-nudge payload with an invalid session id produces no output. A Stop payload without `transcript_path` leaves the record pending and logs `missing-transcript-path`. PASS when both cases keep their stated outputs and state. FAIL when the invalid id is injected or the Stop hook arms without a transcript path.

#### Killer lock and signal checks (Automatable)

Run the killer suite:

~~~bash
node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs
~~~

Evidence: the suite checks that only an armed record is signalled, that a held lock logs `killer-lock-held`, that a stale lock logs `killer-lock-stale`, and that a target lost during SIGTERM logs `target-gone`. The killer polls every 100 ms and starts a separate 5000 ms grace period after SIGTERM. PASS when the expected state and log lines match. FAIL when the killer signals an unarmed record or leaves a held or stale lock in the wrong state.

#### Killer transcript grace (Automatable)

Run the killer suite. One failed transcript read must not end supervision. A transcript that stays unreadable for 1 s must un-arm the record with reason `killer-timeout`.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs
~~~

Evidence: `killer survives one transient transcript stat failure and still signals` and `killer gives up when the transcript stays missing past the stat grace window` pass. PASS when both pass. FAIL when a single failed stat aborts the killer. FAIL also when a transcript that stayed missing past 1 s leaves the record armed.

#### Killer takeover mutex (Automatable)

Run the killer suite. The takeover cases cover a dead owner's mutex, a live owner's old mutex, the sweep of leftover `.stale-` directories, a mutex that holds extra or foreign files, an unreadable owner file and a failed mutex removal.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs
~~~

Evidence: each test below passes. The filtered run covers the same nine tests:

~~~bash
node --test --test-name-pattern "takeover|leftover|stray|owner cannot|removal throws" .skilled/hooks/session-relaunch/tests/killer.test.cjs
~~~

- `killer reclaims a takeover mutex whose recorded owner is dead`
- `killer leaves a takeover mutex to its live owner even when the directory is old`
- `killer sweeps an old leftover takeover directory but keeps a fresh one`
- `killer reclaims a stale takeover directory that holds extra files`
- `killer reclaims the takeover when a stale leftover already holds its pid`
- `killer releases a takeover directory that gained a stray file`
- `killer leaves a takeover directory a contender replaced while it was held`
- `killer exits non-zero when the takeover owner cannot be read`
- `killer keeps its result when the takeover removal throws`

PASS when all nine pass. FAIL when a live owner's mutex is reclaimed. FAIL also when a dead owner's mutex blocks the takeover. FAIL also when a killer deletes a takeover directory it did not create. FAIL also when a mutex release error overrides a successful takeover, meaning the killer exits non-zero, drops the lock it acquired or stops supervising the target.

#### Arm restarts a dead killer (Automatable)

Run the Claude adapter suite. A Stop that finds an armed record with no live killer must spawn exactly one killer. A Stop while a killer owns the lock must spawn none.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
~~~

Evidence: `stop-arm respawns one killer for an armed record whose killer is gone` passes. The Codex, Hermes, Pi and OpenCode suites carry the same respawn case for their arm events. PASS when the test passes. FAIL when a Stop leaves an armed record with no killer. FAIL also when a Stop spawns a second killer while one owns the lock.

#### relaunch.log line integrity (Automatable)

Run the relaunch-core suite. Concurrent writers must each keep one line. A partial last line must not merge with the next event. A permissive log must return to mode 0600.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
~~~

Evidence: each test below passes.

- `appendLog keeps every line when eight processes append concurrently`
- `appendLog starts the next event on its own line after a partial line`
- `appendLog restores private mode on an existing permissive log file`

PASS when all three pass. FAIL when a concurrent append is lost. FAIL also when a partial line merges with the next event. FAIL also when the log keeps a mode other than 0600.

#### Hop history records each hop (Automatable)

Run the hop-history suite. It drives the CLI in a sandbox repository with a stand-in `osascript` on PATH, so no notice reaches the screen.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/hop-history.test.cjs
~~~

Evidence: each test below passes.

- `a relaunch decision records a hand-over line with the note goal and hop number`
- `a declined relaunch records nothing`
- `claim and complete record the receiving session picking the note up and finishing it`
- `history prints the latest lines and says when no hop is recorded yet`
- `the hand-over notice stays off by default`
- `the hand-over notice fires once the switch is set in the hook-flags file`

PASS when all six pass. FAIL when a hop writes no `handed-over`, `claimed` or `done` line, when a declined relaunch writes one, or when the notice runs with `SESSION_RELAUNCH_NOTIFY_HOPS` unset.

#### Gate 3 Skip seed spelling (Automatable)

Run the nudge suite. The current Skip suffix and the older spelling must both read as `none` for the receiving session.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs
~~~

Evidence: `specFolderFromSeed reads only a valid carried folder and accepts suffixed seeds` passes. PASS when both the current and the legacy Skip seeds return `none`. FAIL when the legacy spelling returns an empty folder, so the receiver asks Gate 3 again.

#### Wrapper edge cases (Automatable)

Run the wrapper suite:

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
~~~

Evidence: tests cover the Claude default with no args or a prompt, first-launch `-n` preservation, `--` ending name scanning, exit 130 printing the manual command without a hop, missing cwd or CR/LF returning 1, consume failure warning while the wrapper continues, and decider failure preserving Claude's exit code. PASS when each case returns the expected arguments, warning or exit code. FAIL when the wrapper relaunches after exit 130 or changes the runtime exit code after a decider failure.

#### Note-only nudge outside skilled-loop (Automatable)

Run the adapter conformance cases for a session that has no `SKILLED_LOOP_ID`. Each adapter runs a turn at 90% fill with a 0.80 threshold. Only the wrapper can relaunch the session, so the nudge must ask for the note and `keep`, never for `prepare`.

~~~bash
node --test --test-name-pattern="outside skilled-loop" .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs
~~~

Evidence: the Claude, Codex, Hermes and OpenCode cases named `a nudge outside skilled-loop asks for keep and never prepare` pass. PASS when all four pass. FAIL when any adapter emits a `prepare` command without a loop id, or emits nothing.

#### Keep and the open-notes line (Automatable)

Run the two hop-history cases for a session outside the loop. `keep` must write a `note-kept` line, print the claim command and refuse inside the loop, and `history` must name an open note until it is claimed.

~~~bash
node --test --test-name-pattern="keep outside the loop|open-notes line" .skilled/hooks/session-relaunch/tests/hop-history.test.cjs
~~~

Evidence: `keep outside the loop records a note-kept line and prints the claim command` and `history adds an open-notes line until the note is claimed` pass. PASS when both pass. FAIL when `keep` exits 0 inside the loop, writes no `note-kept` line, or `history` omits an open note.

#### Compaction points at the open note (Automatable)

Run the compact-pointer cases. A `SessionStart` payload whose `source` is `compact` must reset the session's nudge level to 0 and add claim instructions for its open note. A fresh start, a session with no open note and a session whose hop is prepared must add nothing.

~~~bash
node --test --test-name-pattern="compact-pointer" .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
~~~

Evidence: the three tests whose names start with `compact-pointer` pass. PASS when all three pass. FAIL when the pointer claims a note a prepared hop owns, fires on a fresh start, or leaves the nudge level spent.

#### Shell shim resolution (Automatable)

Run the shell shim suite. It sources `.skilled/bin/skilled-loop-shell.sh` under bash and zsh in a sandbox repository whose `.skilled` is a symlink to this checkout's `.skilled`. It checks that every runtime's interactive forms resolve the wrapper from the repository root and a nested directory. Subcommands, print modes, version and help resolve nothing. A directory with no `.skilled` above it and a session that already has `SKILLED_LOOP_ID` resolve nothing too. Stub `bash`, `claude` and `cursor-agent` binaries then show that a terminal launch goes through the wrapper and a piped launch runs the binary.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs
~~~

Evidence: all 16 tests pass. PASS when the run reports 0 failures. FAIL when an interactive form resolves nothing, a pass-through form resolves the wrapper or the terminal test runs the binary directly.

#### Symlinked repository through the shell shim (Live)

Build a repository that links this checkout's `.skilled` and `.claude`, the way a second project shares the framework. Source the shim in a fresh shell, start plain `claude` there and let the hop run.

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
linked_repo="$(mktemp -d)/linked-repo"
mkdir -p "$linked_repo" && git -C "$linked_repo" init -q
ln -s "$repo_root/.skilled" "$linked_repo/.skilled"
ln -s "$repo_root/.claude" "$linked_repo/.claude"
tmux new-session -d -s shim-claude "zsh -c 'source \"$repo_root/.skilled/bin/skilled-loop-shell.sh\" && cd \"$linked_repo\" && export SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 && claude \"Carry this short task through the handoff and finish it in the receiving session.\"'"
tmux attach -t shim-claude
~~~

Evidence: inside the first session, `echo $SKILLED_LOOP_ID` through the Bash tool prints a loop id, so the shim started Claude under the wrapper. The nudge arrives, prepare exits 0, the killer ends the session and the wrapper starts Claude again with the claim seed in the same pane. PASS when the note under `.skilled/skills/.state/session-relaunch/handoffs/` reaches done. FAIL when `SKILLED_LOOP_ID` is empty, prepare exits 3 or the pane returns to the shell prompt without a relaunch.

#### Recorded Results, 2026-10-22

Claude Code 2.1.306 to 2.1.308 (it updated itself mid-run), live in tmux at a 0.05 threshold. All rows passed. The full situation matrix, commits and evidence paths are in the [runtime-certainty implementation summary](../../../../../specs/hooks/023-session-relaunch-loop/022-runtime-certainty-claude-pi-opencode/implementation-summary.md).

| Situation | Result |
|---|---|
| Full hop with model carry, spec-folder resume and a git worktree | Pass, rerun on the final code with full-id note names |
| One nudge and one re-nudge | Pass, levels at 14% and 18% |
| Keep, `/compact`, claim, complete | Pass, `compact-pointer` logged |
| Hop cap, stale record, busy at arm time, live shell child, kill switch | Pass |
| Agent sub-agent | Pass, the guard denied its claim and it got no nudge |
| Two loops at once | Pass, each claimed only its own note |
| Interrupt after relaunch, before claim | Pass, the wrapper warns that the note was not claimed |
| Nested `claude -p` inside a loop | Pass, `loop-nested-run` logged and the nested run got the outside-loop wording |
| Shell shim in a linked repository | Pass, the tool shell reported a loop id |

### Expected

During an eligible live handoff, prepare writes pending. Stop arms it only after the transcript path is present and background tasks have drained. The killer sends SIGTERM only for an armed record after transcript idle. skilled-loop starts a new process with the handoff path in its seed when the record is fresh and under both limits. The receiving session changes the note from open to claimed then done. On timeout, the killer disarms the record, logs `killer-timeout` and attempts the manual-claim notification. A transcript that stays unreadable for 1 s takes the same path. Every arm event restarts a killer for an armed record that has none. Each hop adds `handed-over`, `claimed` and `done` lines to `.skilled/skills/.state/session-relaunch/hop-history.log`, and a killer timeout adds `timed-out`.

### Evidence

Capture each command exit code. Save the tmux pane, handoff note path and status, relaunch.log path and relevant lines. Record each automatable test result. Store a manual run result under the system-spec-kit benchmark reports directory according to the playbook package rules.

### Pass / Fail

- **Pass**: every listed check meets its expected signal. The live hop must reach the claimed note's done state.
- **Fail**: a check contradicts its expected signal. Also fail when a scenario exits unexpectedly or the receiving session leaves the note unfinished.

### Failure Triage

1. Record the first failing command and its exit code.
2. Check the handoff note path, status, session id and required sections.
3. Read relaunch.log for prepare, arm, timeout, decline and hop-cap events.
4. Compare the recorded hops and armed time with SESSION_RELAUNCH_MAX_HOPS and SESSION_RELAUNCH_MAX_AGE_MIN.
5. Re-run only the failing scenario and capture its stdout, stderr and state files.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md | Root playbook directory and scenario index. |
| ../../feature-catalog/context-preservation/session-relaunch-loop.md | Feature catalog entry for the Claude handoff behavior. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | Reads context usage and emits the threshold and claim-seed context. |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | Arms a matching pending record on Stop. |
| .skilled/hooks/session-relaunch/claude/compact-pointer.mjs | After a compaction, resets the nudge level and points the session at its open note. |
| .skilled/hooks/session-relaunch/lib/killer.cjs | Waits for idle or timeout and signals the Claude process. |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Prepares and updates handoff state, and prints the hop history. |
| .skilled/hooks/session-relaunch/lib/hop-history.cjs | Records each hop event and sends the opt-in hand-over notice. |
| .skilled/bin/skilled-loop | Checks relaunch eligibility and starts Claude with a handoff seed. |
| .skilled/bin/skilled-loop-shell.sh | Starts a plain `claude` launch under the nearest wrapper, a symlinked `.skilled` included. |
| .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs | Automates the outside-loop note-only check for every Node adapter. |
| .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs | Automates the shell shim's resolution and terminal hand-off. |
| .skilled/hooks/session-relaunch/tests/context-usage.test.cjs | Covers transcript usage reads, settings fallback and I/O handling. |
| .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs | Automates threshold, seed and adapter checks. |
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | Covers handoff validation, record state and relaunch decisions. |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | Automates prepare refusal and CLI state checks. |
| .skilled/hooks/session-relaunch/tests/killer.test.cjs | Automates idle signaling and timeout disarming. |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | Automates wrapper and hop-cap behavior. |
| .skilled/hooks/session-relaunch/tests/hop-history.test.cjs | Automates the hop history, the history command and the notice switch. |

Provenance: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: session-relaunch-claude
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/session-relaunch-claude.md
