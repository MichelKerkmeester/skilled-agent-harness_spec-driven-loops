---
title: "Claude Session Relaunch"
description: "Scenarios for Claude context nudges, prepared handoffs, Stop arming, killer timeouts, wrapper relaunches, withdrawn hand-overs and the hop history."
trigger_phrases:
  - "Claude session relaunch"
  - "session-relaunch-claude"
  - "skilled-loop handoff"
  - "Claude context nudge"
version: 1.0.12.0
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

- Objective: Verify threshold context, note validation, Stop arming, process shutdown, wrapper relaunch, note status changes, hop and age limits, the hop history and calling off a prepared hand-over with an operator prompt or `cancel`.
- Real user request: Carry this task into a new Claude session before context compaction, then finish the remaining work.
- Prompt: Start a short task. Follow the session-relaunch nudge. Finish the remaining work in the receiving Claude session.
- Expected execution process: Run Claude inside tmux with `SESSION_RELAUNCH_THRESHOLD=0.05`, prepare the note when the nudge appears, wait for Stop to arm the record when the transcript path is present and background tasks have drained, then confirm the wrapper relaunches with the claim seed.
- Expected signals: The relaunch record moves from pending to armed and is consumed by the wrapper. The receiving session starts with a `[session-relaunch]` claim seed. The note moves from open to claimed to done. `history` shows `handed-over`, `claimed ... by <id>` and `done` for that note. A hand-over the operator calls off ends disarmed with reason `user-message` or `cancelled`, `should-relaunch` reports `withdrawn`, the session earns one more context nudge and the wrapper prints one warning and no manual claim command.
- Pass/fail: PASS if the new session claims the same note and completes its remaining work after an armed handoff, and a called-off hand-over keeps its session running with the signals above. FAIL if Stop arms without a transcript path, the wrapper declines an eligible record, the receiving session cannot claim the note, an operator prompt leaves an armed or deferred record in place or a `<task-notification>` prompt withdraws a deferred one.

---

## 3. TEST EXECUTION

### Primary Scenario

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| session-relaunch-claude | Claude session relaunch | Live: follow a prepared note through a tmux relaunch. | Start a short task. Follow the session-relaunch nudge. Finish the remaining work in the receiving Claude session. | tmux new-session -d -s session-relaunch-check 'SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop claude "Carry this short task through the handoff and finish it in the receiving session."'<br>tmux attach -t session-relaunch-check | Prepare exits 0 and writes pending. Stop arms the record after the transcript path is present and background tasks have drained. The wrapper starts Claude with the claim seed. The note reaches done. `history --last 3` shows `handed-over` with `(hop 1)`, `claimed` with `by <id>` and `done` (CL-1). | Capture the tmux pane and handoff status changes. Save relevant relaunch.log entries and the output of `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history --last 3`. | PASS when the same handoff reaches done after a new Claude process starts with the seed and the three history lines name that note. FAIL when an eligible armed record is declined or the note cannot be claimed. | Check note frontmatter and sections. Check Stop session id, runtime log and hop or age decline reason. |

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

- `hand-over records a hand-over line with the note goal and hop number`
- `hand-over records nothing when the note is no longer open`
- `a declined relaunch records nothing`
- `claim and complete record the receiving session picking the note up and finishing it`
- `history prints the latest lines and says when no hop is recorded yet`
- `the hand-over notice stays off by default`
- `the hand-over notice fires once the switch is set in the hook-flags file`
- `history renders a withdrawn line with the session that withdrew the hand-over`
- `open notes report a withdrawn note apart from one nobody has claimed`

PASS when all nine pass. FAIL when a hop writes no `handed-over`, `claimed` or `done` line, when a declined relaunch or a note that is no longer open writes a `handed-over` line, when a withdrawn note counts as unclaimed work, or when the notice runs with `SESSION_RELAUNCH_NOTIFY_HOPS` unset.

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

Evidence: tests cover the Claude default with no args or a prompt, first-launch `-n` preservation, `--` ending name scanning, exit 130 printing the manual command without a hop, missing cwd or CR/LF returning 1, consume failure warning while the wrapper continues, a withdrawn decline printing one warning and no manual command, and decider failure preserving Claude's exit code. PASS when each case returns the expected arguments, warning or exit code. FAIL when the wrapper relaunches after exit 130 or changes the runtime exit code after a decider failure.

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

Run the compact-pointer cases. A `SessionStart` payload whose `source` is `compact` must reset the session's nudge level to 0 and add claim instructions for its open note. A fresh start, a session with no open note and a session whose hop is prepared must add nothing. A session whose hand-over was withdrawn or cancelled, and that has not updated the note since, must get a line telling it to read the note for background only and not to claim it.

~~~bash
node --test --test-name-pattern="compact-pointer" .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
~~~

Evidence: every test whose name starts with `compact-pointer` passes, including the one that tells a withdrawn session not to claim the stale note. PASS when all of them pass. FAIL when the pointer claims a note a prepared hop owns, fires on a fresh start, leaves the nudge level spent or tells a withdrawn session to claim its stale note.

#### Shell shim resolution (Automatable)

Run the shell shim suite. It sources `.skilled/bin/skilled-loop-shell.sh` under bash and zsh in a sandbox repository whose `.skilled` is a symlink to this checkout's `.skilled`. It checks that every runtime's interactive forms resolve the wrapper from the repository root and a nested directory. Subcommands, print modes, version and help resolve nothing. A directory with no `.skilled` above it and a session that already has `SKILLED_LOOP_ID` resolve nothing too. Stub `bash`, `claude` and `cursor-agent` binaries then show that a terminal launch goes through the wrapper and a piped launch runs the binary.

~~~bash
node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs
~~~

Evidence: all 18 tests pass, nine cases each run under bash and zsh. PASS when the run reports 0 failures. FAIL when an interactive form resolves nothing, a pass-through form resolves the wrapper or the terminal test runs the binary directly.

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

### Live Withdraw, Cancel And History Checks

These checks call a prepared hand-over off, or let it run, and read the result from the record, the logs and the hop history. They run Claude through `skilled-loop` in a detached tmux session so one shell can type into it and read it. Each check says what it was written against. The code paths are covered by the adapter, CLI, wrapper and killer suites listed under CL-7. The live steps were authored from that code and the sandbox probe in CL-6, so record your own run before you rely on a timing.

#### CL-0 Live setup shared by CL-1 to CL-5 (Live)

Run from the repository root with `tmux`, `node` and a Claude Code install that has the repository hooks. A shell that is itself inside a loop works, because the launch command drops the inherited hop count. Paste this block once per shell:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
session_name="relaunch-claude-$$"

start_claude() {
  tmux new-session -d -s "$session_name" "cd '$repo_root' && env -u SKILLED_LOOP_HOPS SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop claude"
  tmux set-option -w -t "$session_name" remain-on-exit on
}
say() { tmux send-keys -t "$session_name" -l "$1"; sleep 0.5; tmux send-keys -t "$session_name" Enter; }
screen() { tmux capture-pane -p -S -120 -t "$session_name"; }
wait_for_record() {  # waits up to 5 minutes, prints the loop id of the first record in one of the given states
  local pattern="$1" file="" tries=0
  while [ -z "$file" ] && [ "$tries" -lt 3000 ]; do
    file=$(find "$state" -maxdepth 1 -name 'relaunch-*.json' -exec grep -lE "\"status\":\"($pattern)\"" {} + 2>/dev/null | head -1)
    [ -n "$file" ] || { sleep 0.1; tries=$((tries + 1)); }
  done
  [ -n "$file" ] || return 1
  file=${file##*/relaunch-}
  echo "${file%.json}"
}
record_field() { grep -oE "\"$2\":\"[^\"]*\"" "$state/relaunch-$1.json"; }
~~~

The three switches are test overrides. `SESSION_RELAUNCH_THRESHOLD=0.05` and `SESSION_RELAUNCH_WINDOW_TOKENS=100` make the first tool call cross the threshold, and `SESSION_RELAUNCH_MAX_HOPS=1` stops the chain after one hop. The files the checks read:

| Path | Holds |
|---|---|
| `$state/relaunch.log` | One line per hook, wrapper and killer event |
| `$state/relaunch-<loop id>.json` | The relaunch record. The loop id is the wrapper's pid |
| `$state/nudge-<session id>.json` | The session's nudge level and any extra nudge it is owed (`rearm`) |
| `.skilled/skills/.state/session-relaunch/hop-history.log` | The persistent hop history that `history` prints |
| `.skilled/skills/.state/session-relaunch/handoffs/` | The handoff notes |

Run one check at a time and only one looped session at once, because `wait_for_record` takes the first record it finds. Claude may ask you to trust the folder on first start, so answer that in `tmux attach -t "$session_name"` and detach with Ctrl-B then D. Every check leaves a gitignored note and history lines behind. End each check with `tmux kill-session -t "$session_name"`.

#### CL-1 Hop history after a live hop (Live)

Run the primary scenario above, or any hop that reaches `done`, then read the history:

~~~bash
cli history --last 3
~~~

Expected, with the time and your folder name in place of the examples:

~~~text
2026-10-24T15:06:21.723Z  handed-over  claude    my-repo (hop 1)  <first line of the note Goal>  [<stamp>-<sender session id>.md]
2026-10-24T15:06:21.856Z  claimed      claude    my-repo by 3f1c9a7e  <same Goal>  [<same note>]
2026-10-24T15:06:21.909Z  done         claude    my-repo  <same Goal>  [<same note>]
~~~

The `handed-over` line comes from the wrapper, which writes it through `hand-over --handoff <note> --hop 1 --runtime claude` only after it read an open note. The `by <id>` on the `claimed` line is the first eight characters of the receiving session's id, which the receiving session prints with `echo $CLAUDE_CODE_SESSION_ID`. The sender's id is the suffix of the note file name. `relaunch.log` holds `prepare loopId=<id> status=pending`, then `relaunch loopId=<id> reason=ready`.

Evidence: the three history lines and the two log lines. PASS when the three lines name the same note in the order `handed-over`, `claimed`, `done`, the `handed-over` line carries `(hop 1)` and the `by <id>` value matches the receiving session and differs from the sender's. FAIL when a line is missing, when `claimed` shows no `by <id>` or the sender's id, or when a `handed-over` line exists for a hop the wrapper declined.

#### CL-2 An operator prompt withdraws an armed hand-over (Live)

Stop arms the record, and the killer ends the session after the transcript has been quiet for 3 s. A prompt typed inside that window must withdraw the record, so the check types it as soon as the record is armed.

~~~bash
start_claude
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none, run prepare and end your turn."
loop_id=$(wait_for_record armed)
say "Stay in this session. Reply with the single word STAYING."
sleep 8
record_field "$loop_id" status; record_field "$loop_id" disarmReason
cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
grep -E ' (withdrawn|killer-signal|relaunch) ' "$state/relaunch.log" | tail -5
cli history --last 2
screen | tail -20
~~~

Expected:

- The record reads `"status":"disarmed"` and `"disarmReason":"user-message"`.
- `should-relaunch` prints `{"relaunch":false,"reason":"withdrawn",...}` and `exit 1`.
- `relaunch.log` holds `withdrawn loopId=<id> sessionId=<uuid> reason=user-message` and no `killer-signal` line after it.
- `history` ends with a `withdrawn` line that carries `by <first eight characters of the session id>`, then `open notes: 1 withdrawn note still with its session`.
- The pane shows Claude answering STAYING in the same session. Claude was told `[session-relaunch] The prepared hand-over was withdrawn because a new prompt arrived before it took effect...`.

Then end the session and read the wrapper:

~~~bash
say "/exit"
sleep 5
screen | grep -E 'warning|claim and continue'
tmux display -p -t "$session_name" '#{pane_dead_status}'
~~~

Expected: one line `warning: the prepared hand-over was withdrawn in the session; <note path> stays open and out of date`, no line that carries `claim and continue handoff` (the manual claim command) and `0` for the pane status, which is Claude's own exit code.

Evidence: the command output above, the pane text and `relaunch.log`. PASS when the record is disarmed with `user-message`, `should-relaunch` reports `withdrawn`, the session kept running and the wrapper printed the single warning without a claim command. FAIL when the record stays armed, the log shows `killer-signal`, a second Claude starts with a seed or the wrapper prints a manual claim command. Triage: if the pane shows the relaunch already, the prompt landed after the killer's 3 s idle wait, so rerun. If `wait_for_record armed` never returns, read `relaunch.log` for `deferred-background-tasks`, `missing-transcript-path` or `prepare-declined`.

#### CL-3 An operator prompt withdraws a deferred hand-over and the extra nudge arrives (Live)

Stop defers while a background task runs and stamps `deferredAt` on the pending record. The prompt below must withdraw it. The task starts after prepare, because prepare refuses while the session has a live child shell.

~~~bash
start_claude
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none and run prepare. Only after prepare exits 0, start 'sleep 90' as a background shell task and end your turn."
loop_id=$(wait_for_record pending)
until grep -q deferredAt "$state/relaunch-$loop_id.json"; do sleep 1; done
session_id=$(grep -oE '"sessionId":"[^"]*"' "$state/relaunch-$loop_id.json" | cut -d'"' -f4)
record_field "$loop_id" status; record_field "$loop_id" deferredAt
cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
~~~

Expected before you type: `"status":"pending"`, a `deferredAt` stamp, `{"relaunch":false,"reason":"not-armed",...}` with `exit 1` and a `deferred-background-tasks` line in `relaunch.log`. Now spend the session's nudge levels, so a nudge can only come from the extra one, then type the prompt:

~~~bash
printf '{"level":2}\n' > "$state/nudge-$session_id.json"
say "Run the shell command 'sleep 3; echo staying'. Then quote, word for word, the first sentence of every [session-relaunch] message you received since my last message, and reply STAYING."
sleep 25
record_field "$loop_id" disarmReason
cat "$state/nudge-$session_id.json"
screen | tail -30
cli history --last 2
~~~

Expected:

- `"disarmReason":"user-message"` and a `withdrawn loopId=<id> sessionId=<uuid> reason=user-message` line in `relaunch.log`.
- Claude quotes two sentences. The first is the withdraw notice, `The prepared hand-over was withdrawn because a new prompt arrived before it took effect.` The second is the extra nudge, `Context is past the configured window (over 100% full).` Level 2 never nudges again on its own, so the second sentence proves the grant.
- The nudge file ends as `{"level":2}`. Right after the withdraw it held a `rearm` field, and the nudge that was delivered removed it.
- `history` ends with the `withdrawn` line and the `open notes:` line.

The tool call has to last about a second or more. Claude writes an assistant entry to its transcript roughly 0.2 s after the entry's own timestamp, and the nudge reads the context fill from that transcript. A `PostToolUse` hook that starts sooner reads the fill from before the prompt, sees no growth past the withdraw floor and stays quiet, so the extra nudge waits for the next hook. Seven runs of this check with `echo staying` (Claude Code 2.1.310, `claude-sonnet-5-5`, 2026-10-24) delivered the nudge on the first tool call 0 times, and the nudge arrived with the next prompt instead. Three runs with `sleep 3; echo staying` delivered it on the first tool call 3 times, 5 to 6 s after the notice. Of 57 `PostToolUse` hooks across the ten runs, 38 read a transcript that was missing an entry older than the hook, always by an entry younger than about 0.18 s.

The extra nudge asks for a fresh note. Ignore it and end the check with `tmux kill-session`.

Evidence: the record field, the nudge file, the pane text and the history lines. PASS when the record is disarmed with `user-message`, the prompt carried the withdraw notice and the later tool call carried the extra nudge. FAIL when the record stays pending, the notice is missing, no extra nudge arrives after the tool call or `nudge-<session id>.json` still holds `rearm` after Claude quoted the nudge. Triage: when the quote lists only the notice, the tool call was too short for the transcript to catch up, so rerun with a longer tool call or send one more prompt that runs a tool.

#### CL-4 A task-notification prompt leaves a deferred hand-over alone (Live)

The completion of the background task reaches Claude as a prompt that starts with `<task-notification>`. It is what the deferred hand-over waits for, so it must not withdraw the record. Type nothing after the first prompt.

~~~bash
start_claude
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none and run prepare. Only after prepare exits 0, start 'sleep 25' as a background shell task and end your turn."
loop_id=$(wait_for_record pending)
until grep -q deferredAt "$state/relaunch-$loop_id.json"; do sleep 1; done
sleep 45
grep -E ' (deferred-background-tasks|withdrawn|killer-signal|relaunch) ' "$state/relaunch.log" | tail -6
cli history --last 3
screen | tail -20
~~~

Expected: `deferred-background-tasks` first, then no `withdrawn` line, then `killer-signal` and `relaunch loopId=<id> reason=ready`. The pane shows a second Claude with the claim seed. `history` shows `handed-over` with `(hop 1)` and, once the receiving session claims, `claimed`. This is also a hop through the deferred path, so give the receiving session its turn and end it with `/exit`.

Evidence: the log lines and the history. PASS when the hop completes and no `withdrawn` line exists in the log or the history. FAIL when the completion prompt writes `withdrawn` or the session never relaunches. Triage: the completion arrives only when the task ends, so `sleep 25` plus Claude's reaction time must fit inside the `sleep 45` wait.

#### CL-5 Cancel a prepared hand-over (Live)

`cancel` withdraws a pending or armed record from outside the session. A deferred record stays pending while its task runs, which gives this check time to run it from the second shell.

~~~bash
start_claude
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none and run prepare. Only after prepare exits 0, start 'sleep 40' as a background shell task and end your turn."
loop_id=$(wait_for_record pending)
until grep -q deferredAt "$state/relaunch-$loop_id.json"; do sleep 1; done
cli cancel --loop-id "$loop_id"; echo "exit $?"
cli cancel --loop-id "$loop_id"; echo "exit $?"
record_field "$loop_id" disarmReason
cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
grep -E ' (cancel|decline) ' "$state/relaunch.log" | tail -3
cli history --last 1
sleep 45
screen | tail -15
~~~

Expected:

- The first `cancel` prints `cancelled the prepared hand-over for <note file name>; the note stays open` and `exit 0`. The second prints `no prepared hand-over to cancel` and `exit 1`.
- `"disarmReason":"cancelled"`, then `should-relaunch` prints `{"relaunch":false,"reason":"withdrawn",...}` with `exit 1`.
- `relaunch.log` holds `cancel loopId=<id> status=pending` and `decline loopId=<id> reason=withdrawn`.
- `history` ends with a `withdrawn` line and the `open notes:` line.
- After the task ends (`sleep 45`) the pane shows Claude answering the completion in the same session, and no relaunch starts.

Inside the session the same command works without `--loop-id`, because `SKILLED_LOOP_ID` is set. A nested run needs the explicit flag, as CL-6 shows.

Evidence: the command output, the log lines and the pane. PASS when both exit codes match, the record ends `cancelled` and the session keeps running. FAIL when the first `cancel` exits 1, the second exits 0, a relaunch starts or `should-relaunch` reports `not-armed`.

#### CL-6 Withdraw and cancel probe without a model (Automatable)

This probe feeds real hook payloads to the Claude context-nudge adapter in a sandbox repository and runtime directory, so it touches neither your relaunch state nor your hop history. It checks the Claude rules for an operator prompt over a pending record, a `<task-notification>` over an armed one, an operator prompt over an armed one and `cancel`. Run it from the main session. The Claude sub-agent guard denies `prepare`, `claim`, `keep` and `complete` commands from a sub-agent.

~~~bash
bash <<'BASH'
set -euo pipefail
repo_root="$(git rev-parse --show-toplevel)"
sandbox="$(mktemp -d)"
trap 'rm -rf "$sandbox"' EXIT
unset SKILLED_LOOP_HOPS SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_NAME SKILLED_LOOP_MODEL SKILLED_LOOP_PROVIDER
export XDG_RUNTIME_DIR="$sandbox/run" SESSION_RELAUNCH_REPO_ROOT="$sandbox/repo" SKILLED_LOOP_ID=$$ SKILLED_LOOP_RUNTIME=claude
mkdir -p "$XDG_RUNTIME_DIR" "$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/handoffs"
hooks="$repo_root/.skilled/hooks/session-relaunch"
cli() { node "$hooks/bin/session-relaunch.cjs" "$@"; }
state="$XDG_RUNTIME_DIR/skilled-relaunch"
record="$state/relaunch-$SKILLED_LOOP_ID.json"
sid=probe-claude-0001
note="$SESSION_RELAUNCH_REPO_ROOT/.skilled/skills/.state/session-relaunch/handoffs/20260101T000000Z-$sid.md"
printf -- '---\nstatus: open\nsession_id: %s\nloop_id: %s\nruntime: claude\ncwd: %s\nspec_folder: \ncreated_at: 2026-01-01T00:00:00Z\n---\n## Goal\nProbe the withdraw path\n## Done\nNothing.\n## Remaining work\nNothing.\n## In-flight state\nNothing.\n' "$sid" "$SKILLED_LOOP_ID" "$sandbox" > "$note"

check() { if eval "$2"; then echo "PASS: $1"; else echo "FAIL: $1"; exit 1; fi; }
prompt() { printf '{"hook_event_name":"UserPromptSubmit","session_id":"%s","cwd":"%s","prompt":"%s"}' "$sid" "$sandbox" "$1" | node "$hooks/claude/context-nudge.mjs"; }
arm() { node -e "require('$hooks/lib/relaunch-core.cjs').arm({loopId: process.env.SKILLED_LOOP_ID, cwd: '$sandbox'})"; }

cli prepare --handoff "$note" --session "$sid" --runtime claude > /dev/null
check "an operator prompt leaves a pending record that no Stop deferred" \
  '[ -z "$(prompt "keep going")" ] && grep -q "\"status\":\"pending\"" "$record"'
arm
check "a task-notification prompt leaves an armed record alone" \
  '[ -z "$(prompt "<task-notification>build finished</task-notification>")" ] && grep -q "\"status\":\"armed\"" "$record"'
out="$(prompt "keep going, one more thing")"
check "an operator prompt withdraws the armed record" \
  'grep -q "\"disarmReason\":\"user-message\"" "$record"'
check "the session is told it was withdrawn" \
  'printf "%s" "$out" | grep -q "The prepared hand-over was withdrawn"'
decision="$(cli should-relaunch --loop-id "$SKILLED_LOOP_ID")" && status=0 || status=$?
check "should-relaunch reports withdrawn and exits 1" \
  '[ "$status" = 1 ] && printf "%s" "$decision" | grep -q "\"reason\":\"withdrawn\""'
check "the nudge state holds one extra nudge" 'grep -q "\"rearm\"" "$state/nudge-$sid.json"'
shown="$(cli history --last 1)"
check "the hop history lists a withdrawn line" 'printf "%s" "$shown" | grep -q " withdrawn "'
check "the log holds a withdrawn line and no killer signal" \
  'grep -q " withdrawn " "$state/relaunch.log" && ! grep -q "killer-signal" "$state/relaunch.log"'

cli prepare --handoff "$note" --session "$sid" --runtime claude > /dev/null
cancel_out="$(cli cancel)"
check "cancel names the note and says it stays open" \
  'printf "%s" "$cancel_out" | grep -q "cancelled the prepared hand-over for .*; the note stays open"'
check "the record is disarmed with reason cancelled" 'grep -q "\"disarmReason\":\"cancelled\"" "$record"'
again="$(cli cancel)" && status=0 || status=$?
check "a second cancel finds nothing and exits 1" \
  '[ "$status" = 1 ] && [ "$again" = "no prepared hand-over to cancel" ]'
BASH
~~~

Evidence: the eleven `PASS:` lines and exit code 0. PASS when all eleven print and the shell exits 0. FAIL on the first `FAIL:` line, which exits 1.

#### CL-7 Withdraw suites (Automatable)

Run the suites and read the named cases:

~~~bash
node --test \
  .skilled/hooks/session-relaunch/tests/withdraw.test.cjs \
  .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs \
  .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs \
  .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs \
  .skilled/hooks/session-relaunch/tests/killer.test.cjs \
  .skilled/hooks/session-relaunch/tests/nudge.test.cjs \
  .skilled/hooks/session-relaunch/tests/hop-history.test.cjs
~~~

Evidence: exit code 0 and these cases pass.

- `withdraw.test.cjs`: `an armed record is withdrawn with a pending grant and a history line`, `a pending record counts only as the caller's policy says`, `a follow-up that fails is reported and never undoes the withdrawal`.
- `claude-adapters.test.cjs`: `context-nudge withdraws a deferred handoff when the operator sends a prompt`, `context-nudge withdraws an armed handoff when the operator sends a prompt`, `the withdraw prompt carries only the notice, then one nudge comes a step above its fill`, `compact-pointer tells a session whose hand-over was withdrawn not to claim the stale note`. The cases `context-nudge keeps a deferred handoff when a background task reports back`, `context-nudge keeps an armed handoff when a background task reports back` and `context-nudge keeps a handoff that was prepared and never deferred` check that neither withdraws anything.
- `session-relaunch-cli.test.cjs`: `cancel disarms the loop prepared hand-over named by the loop environment`, `cancel exits one when the loop has no prepared hand-over`, `cancel from a nested run without a loop id refuses and leaves the outer hand-over armed`, `cancel from a nested run honors an explicit loop id`, `cancel records a withdrawn hop and grants the session one more nudge`.
- `skilled-loop.test.cjs`: `wrapper reports a cancelled hand-over as withdrawn and prints no claim command`, the same case for `user-message`, `wrapper prints only the withdrawn line when a relaunched session calls off its next hand-over` and `wrapper still warns about an unclaimed seed note when a different next hand-over is withdrawn`.
- `killer.test.cjs`: `killer does not signal when an operator prompt withdraws the arm after its freshness check` and `killer does not signal when a cancel lands after its freshness check`.
- `nudge.test.cjs`: `a withdrawn hand-over grants one more nudge, one step above the fill it was withdrawn at` and `a re-arm waits behind the hop cap and stays pending until a run can fix its floor`.
- `hop-history.test.cjs`: `history renders a withdrawn line with the session that withdrew the hand-over` and `open notes report a withdrawn note apart from one nobody has claimed`.

PASS when every named case passes. FAIL when a case is missing from the run or fails.

### Goal Carry-Over Checks

A hand-over note can carry the sender's goal as a `goal_packet` line, and a Claude receiver then starts on `/goal <slice>` with the claim delivered through `SessionStart` context. These checks follow that goal through a real hop and show that it stays out when it should. They run in a throwaway checkout that holds copies of the real hooks, wrapper and goal command, because a goal sent to a receiver in this repository would start real work. The harness is kept with the packet that recorded the runs: `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/`. The relaunch CLI is refused to a sub-agent, so from an agent session the harness script is what runs `prepare`, against its own note and its own runtime directory.

#### GR-1 A Claude hop carries the goal (Live)

Run from the repository root with `tmux`, `node` and `claude`:

~~~bash
repo_root="$(git rev-parse --show-toplevel)"
harness="$repo_root/specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness"
sandbox="$(mktemp -d)/sandbox"; out="$(mktemp -d)"
bash "$harness/build-sandbox.sh" claude "$sandbox" 3990 "$repo_root"
bash "$harness/run-hop.sh" claude "$sandbox" "$out" goal
bash "$harness/finish-run.sh" claude "$out"
~~~

`run-hop.sh` starts the sender on `/goal <slice>` under `skilled-loop`, writes a note, runs `prepare`, sends one prompt so Stop arms, and lets the wrapper relaunch. It drops the host session's `SKILLED_LOOP_*`, `CLAUDE*` and `SESSION_RELAUNCH_GOAL*` variables, uses its own tmux socket and `XDG_RUNTIME_DIR`, and kills its tmux server on exit. `finish-run.sh` reduces the transcripts to an extract and deletes the raw files, which hold the operator's instruction files.

Evidence, read from the receiver and not the sender:

- `summary.txt` shows `note goal_packet line: goal_packet: specs/demo/001-demo`, so the sender's goal was proven from its session log.
- The receiver extract shows a `goal_status` entry with `condition_chars=3990` before the first tool call, and a `SessionStart:startup` hook entry. `relaunch.log` holds a `goal-start-claim` line.
- The note went `open -> claimed -> done`, and `GOALENV.marker` holds `specs/demo/001-demo`, the value the receiver's own `printenv SESSION_RELAUNCH_GOAL_PACKET` printed.

PASS when all three hold. FAIL when the receiver has no `goal_status` entry, when the note never leaves `open` or when `GOALENV.marker` is empty.

#### GR-2 The controls leave the receiver with no goal (Live)

Build a fresh checkout for each run, then run both controls:

~~~bash
bash "$harness/build-sandbox.sh" claude "$sandbox-b" 3990 "$repo_root"
bash "$harness/run-hop.sh" claude "$sandbox-b" "$out-b" switch-off SESSION_RELAUNCH_GOAL=0
bash "$harness/build-sandbox.sh" claude "$sandbox-c" 3990 "$repo_root"
NO_GOAL=1 bash "$harness/run-hop.sh" claude "$sandbox-c" "$out-c" no-goal
~~~

In the switch-off run the note still carries the `goal_packet` line, because only the launch environment is switched off, and the receiver starts on the claim seed: the extract has no `goal_status` entry and `GOALENV.marker` holds `EMPTY`. In the no-goal run the sender never had a goal, so the note has no `goal_packet` line and the receiver again has no `goal_status` entry. Both controls still claim and complete the note, so a missing goal does not break the hand-over.

PASS when both controls show no `goal_status` entry in the receiver and `EMPTY` in `GOALENV.marker`. FAIL when either receiver holds a goal.

A goal over the 4,000-character limit is the third control. The harness kept with `specs/hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex/scratch/harness/run-hop.sh` grows `goal.md` after the note names it when `GOAL_AFTER_PREPARE=4100` is set: the wrapper prints one `warning: the goal was not set in the relaunched session` line and the receiver claims through the seed with no goal.

#### GR-3 Goal carry-over suites (Automatable)

~~~bash
node --test \
  .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs \
  .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs \
  .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs \
  .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs \
  .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
~~~

Evidence: exit code 0 and these cases pass.

- `goal-handover.test.cjs`: `renders exactly the chat slice the goal command prints, without frontmatter or comments` and `sends a slice of exactly 4000 characters and refuses 4001`.
- `claude-adapters.test.cjs`: `compact-pointer delivers the claim at the start of a goal-command receiver` and `compact-pointer adds no start claim for a dispatched child, a switched-off goal or a disabled hook`.
- `skilled-loop.test.cjs`: `a Claude hop with a goal starts on the goal command and carries the claim in the environment`, `a Claude hop keeps the claim seed as its start prompt when no goal can be sent` and `wrapper exports no goal packet when SESSION_RELAUNCH_GOAL is 0`.

PASS when every named case passes. FAIL when a case is missing from the run or fails.

#### Recorded Results, 2026-10-25

Claude Code 2.1.310 with `claude-sonnet-5-5`, live in tmux with a private runtime directory per run. The 3,990-character slice is the harness goal. Evidence lives in `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/`.

| Run | Result | Receiver | Evidence folder |
|---|---|---|---|
| Goal (GR-1) | Pass | `goal_status` with a 3,990-character condition, `goal-start-claim` logged, note `done`, `GOALENV.marker` is `specs/demo/001-demo` | `claude-a-goal/` |
| Switch off (GR-2) | Pass | Note carried the packet, receiver had no `goal_status`, `GOALENV.marker` is `EMPTY`, note `done` | `claude-b-switch-off/` |
| No goal (GR-2) | Pass | Note had no `goal_packet`, receiver had no `goal_status`, `GOALENV.marker` is `EMPTY`, note `done` | `claude-c-no-goal/` |
| Over the limit (GR-2) | Pass, recorded earlier | Receiver had no goal and claimed through the seed | `specs/hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex/scratch/claude-live-c-over-budget/` |

### Expected

During an eligible live handoff, prepare writes pending. Stop arms it only after the transcript path is present and background tasks have drained. The killer sends SIGTERM only for an armed record after transcript idle. skilled-loop starts a new process with the handoff path in its seed when the record is fresh and under both limits. The receiving session changes the note from open to claimed then done. On timeout, the killer disarms the record, logs `killer-timeout` and attempts the manual-claim notification. A transcript that stays unreadable for 1 s takes the same path. Every arm event restarts a killer for an armed record that has none. Each hop adds `handed-over`, `claimed` (with `by <id>`) and `done` lines to `.skilled/skills/.state/session-relaunch/hop-history.log`, a killer timeout adds `timed-out` and a called-off hand-over adds `withdrawn`. An operator prompt over a deferred or armed record, or `cancel` over a pending or armed one, disarms it with reason `user-message` or `cancelled`. `should-relaunch` then reports `withdrawn`, the killer stands down, the session gets one more nudge a step above its fill and the wrapper prints `warning: the prepared hand-over was withdrawn in the session; <note> stays open and out of date` with no manual claim command. A `<task-notification>` prompt withdraws nothing.

### Evidence

Capture each command exit code. Save the tmux pane, handoff note path and status, relaunch.log path and relevant lines, the record fields and the `history` output. Record each automatable test result. Store a manual run result under the system-spec-kit benchmark reports directory according to the playbook package rules.

### Pass / Fail

- **Pass**: every listed check meets its expected signal. The live hop must reach the claimed note's done state. A called-off hand-over must end disarmed with the right reason and keep its session running, and a `<task-notification>` prompt must leave a deferred hand-over in place.
- **Fail**: a check contradicts its expected signal. Also fail when a scenario exits unexpectedly or the receiving session leaves the note unfinished.

### Failure Triage

1. Record the first failing command and its exit code.
2. Check the handoff note path, status, session id and required sections.
3. Read relaunch.log for prepare, arm, timeout, decline and hop-cap events.
4. Compare the recorded hops and armed time with SESSION_RELAUNCH_MAX_HOPS and SESSION_RELAUNCH_MAX_AGE_MIN.
5. For a withdraw check, read the record's `status`, `deferredAt` and `disarmReason`, the `withdrawn`, `cancel` and `killer-signal` lines in relaunch.log and the nudge file for the session. A signal after the prompt means the prompt landed late.
6. Re-run only the failing scenario and capture its stdout, stderr and state files.

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
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | Reads context usage, emits the threshold and claim-seed context and withdraws a deferred or armed hand-over on an operator prompt. |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | Arms a matching pending record on Stop. |
| .skilled/hooks/session-relaunch/claude/compact-pointer.mjs | After a compaction, resets the nudge level and points the session at its open note. |
| .skilled/hooks/session-relaunch/lib/killer.cjs | Waits for idle or timeout and signals the Claude process. |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Prepares and updates handoff state, and prints the hop history. |
| .skilled/hooks/session-relaunch/lib/hop-history.cjs | Records each hop event and sends the opt-in hand-over notice. |
| .skilled/hooks/session-relaunch/lib/withdraw.cjs | Calls off a prepared hand-over for every runtime and `cancel`: a guarded disarm, the extra nudge and the withdrawn history line. |
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
| .skilled/hooks/session-relaunch/tests/withdraw.test.cjs | Automates the shared withdraw helper and its follow-ups. |
| .skilled/hooks/session-relaunch/lib/goal-handover.cjs | Renders the goal slice a Claude receiver starts on, with the packet, budget and size checks. |
| .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs | Covers the slice helper against the real goal command. |
| specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/ | The throwaway-checkout harness behind the goal carry-over checks and their recorded runs. |

Provenance: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: session-relaunch-claude
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/session-relaunch-claude.md
