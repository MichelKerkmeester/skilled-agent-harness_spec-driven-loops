---
title: "Session handover tests: regression suite for the relaunch loop"
description: "Node test files and captured runtime payloads that cover the session handover hooks, the handoff protocol, the killer process and the skilled-loop wrapper."
trigger_phrases:
  - "session handover tests"
  - "relaunch loop test suite"
  - "session handover fixtures"
  - "killer test harness"
version: 1.0.0.0
---

# Session handover tests: regression suite for the relaunch loop

---

## 1. OVERVIEW

`tests/` holds the regression suite for the session handover hooks in `.skilled/hooks/session-handover/`. The suite covers the runtime adapters, the handoff note protocol, the context usage readers, the killer process and the `skilled-loop` wrapper.

Five runtimes register the hook, each through its own file. Claude registers it in `.claude/settings.json` and Codex in `.codex/hooks.json`. Pi runs the extension the hook registry names. OpenCode loads `.opencode/plugins/session-handover.js`. Vibe's `.vibe/hooks.toml` runs the session-lifecycle Vibe hooks, which load `../vibe/handover-parts.mjs` from this concern.

Every test file runs without a live agent runtime. Each file creates its own temporary root under the operating system temp directory. It points the hooks at that root and removes it in a cleanup hook. A run started inside a looped session inherits the wrapper's `SKILLED_LOOP_` variables. Each file whose cases read that environment drops all of them when it loads, so the suite gives the same result inside the loop and outside it.

Each sandbox also drops every relaunch switch it does not set itself. That covers the seven per-runtime flags, the global flag, the kill and master switches and `HOOK_FLAGS_CONFIG`. A switch exported in the developer's shell therefore cannot decide a case. The `fixtures/` folder supplies captured payloads, so the adapters see the shapes a real runtime sends.

---

## 2. DIRECTORY TREE

```text
tests/
+-- adapter-conformance.test.cjs   # One case table run through the Claude, Codex and OpenCode adapters
+-- claude-adapters.test.cjs       # Claude Code adapters: nudge, stop arm, seed prompt, compact pointer
+-- codex-adapters.test.cjs        # Codex adapters: nudge, stop arm, seed prompt, compact pointer
+-- context-usage.test.cjs         # Context window readers for Claude, Codex, OpenCode, Pi and Vibe
+-- goal-handover.test.cjs         # Goal slice a Claude receiver is started on: render, limit and refusals
+-- history-lookup-entry.test.cjs  # History lookup entry: refusal codes and the offer gate
+-- hop-history.test.cjs           # Hop history: hand-over, claim, complete and keep lines
+-- killer.test.cjs                # Killer process: locks, takeover, timeouts, state modes
+-- nudge.test.cjs                 # Nudge text, seed detection, threshold and state round trip
+-- relaunch-core.test.cjs         # Core state: arm, unarm, handoff validation, claim, complete
+-- session-handover-cli.test.cjs  # CLI subcommands: prepare, claim, should-relaunch and others
+-- skilled-loop-shell.test.cjs    # Shell shim that starts plain runtime launches under the wrapper
+-- skilled-loop-wrapper-claim-goal.test.cjs        # Wrapper: claim state, withdrawn hand-overs and goal packets
+-- skilled-loop-wrapper-decline-manual.test.cjs    # Wrapper: exit codes, declined hops and the printed manual command
+-- skilled-loop-wrapper-harness.cjs                # Shared sandbox and runtime stubs for the wrapper test files
+-- skilled-loop-wrapper-launch-arguments.test.cjs  # Wrapper: first launch and the arguments a hop replays
+-- skilled-loop-wrapper-model-effort.test.cjs      # Wrapper: model, effort and runtime options carried between hops
+-- subagent-guard.test.cjs        # Sub-agent guard: lifecycle commands and the question dialog
+-- vibe-adapters.test.cjs         # Vibe adapters: turn start, post tool, turn end and the switch
+-- withdraw.test.cjs              # Shared withdraw helper: disarm, policy, history line
`-- fixtures/                      # Captured runtime payloads, helper scripts and the sandbox env helper
```

---

## 3. FILES

| File | Responsibility |
|---|---|
| `adapter-conformance.test.cjs` | Runs one table of seed, nudge and arm cases through the Claude, Codex and OpenCode adapters. |
| `claude-adapters.test.cjs` | Checks the Claude Code adapters: the nudge, the stop arm, the `UserPromptSubmit` seed and the compact pointer. |
| `codex-adapters.test.cjs` | Checks the Codex adapters: the nudge, the stop arm, the seed prompt and the compact pointer. |
| `context-usage.test.cjs` | Checks how each runtime reports context fill and how a window is resolved. |
| `goal-handover.test.cjs` | Checks the helper that renders the goal slice for a Claude receiver, against the real goal command in a throwaway checkout. |
| `history-lookup-entry.test.cjs` | Checks the history lookup entry and the offer that decides whether a session may run it. |
| `hop-history.test.cjs` | Checks the hop history lines and the notices built from them. |
| `killer.test.cjs` | Checks the killer process that ends the running session before the relaunch. |
| `nudge.test.cjs` | Checks the handoff text the nudge prints, the seed prefix and the threshold rules. |
| `relaunch-core.test.cjs` | Checks the core state model: paths, `arm`, `unarm`, `shouldRelaunch`, `completeHandoff` and `dropNestedLoop`. |
| `session-handover-cli.test.cjs` | Checks the command line entry point and its exit codes. |
| `skilled-loop-shell.test.cjs` | Checks the shell shim under bash and zsh in a sandbox repository whose `.skilled` is a symlink. |
| `skilled-loop-wrapper-claim-goal.test.cjs` | Checks the wrapper's claim state, withdrawn hand-overs and goal packets. |
| `skilled-loop-wrapper-decline-manual.test.cjs` | Checks the wrapper's exit codes, declined hops and printed manual command. |
| `skilled-loop-wrapper-harness.cjs` | Holds the shared sandbox and runtime stubs the wrapper test files load. |
| `skilled-loop-wrapper-launch-arguments.test.cjs` | Checks the wrapper's first launch and the arguments a hop replays. |
| `skilled-loop-wrapper-model-effort.test.cjs` | Checks the model, effort and runtime options the wrapper carries between hops. |
| `subagent-guard.test.cjs` | Checks the sub-agent guard on the lifecycle commands and on the question dialog. |
| `vibe-adapters.test.cjs` | Checks the Vibe adapters: turn start, post tool and turn end. |
| `withdraw.test.cjs` | Checks the shared withdraw helper. |
| `fixtures/` | Holds the captured runtime payloads and the helper scripts the suites read. |

The Claude and Codex seed and nudge cases run as child processes, and every arm case runs in-process. A well-formed seed adds the claim command, and a seed with a relative note path adds nothing. An invalid carried folder is not resumed. The nudge writes `SYSTEM_SPEC_FOLDER` and drops an invalid one.

A pending handoff or the hop cap keeps the nudge silent. Outside skilled-loop the nudge asks for `keep` and never for `prepare`. The Pi extension runs the same cases in `../pi/session-handover.test.ts`.

The Claude nudge fires at the configured context level. The stop arm records a matching pending record, and a synchronous killer spawn failure stays armed. The `UserPromptSubmit` seed carries the claim and completion instructions. After a compaction the compact pointer resets the nudge level and points the session at its open note. It adds nothing on a fresh start, with no open note or while a prepared hop owns the note.

A Stop deferred by background tasks stamps the pending record. A typed prompt then withdraws it and answers with the notice alone. One more nudge comes only once the fill rises a step above the withdraw. A typed prompt also withdraws a record the Stop already armed. A task-notification prompt, a seed prompt, another session's prompt or a record that was never deferred leaves it as it is.

After a compaction, a session whose hand-over was withdrawn is told not to claim the stale note. One whose disarmed record is unrelated still gets the claim seed. At a fresh start the compact pointer delivers the claim of a receiver started on the goal command. It does that only for the `startup` source, with a usable seed, the switch on, outside a dispatched child and outside a runtime started from the loop session's shell.

The Codex nudge fires once at the threshold and again one step above it. A prompt withdraws an armed record, while a seed prompt and a tool call leave it alone. The stop hook ignores an armed record whose killer lock owner is still alive. The stop target lookup picks the ancestor directly below the loop process. A registration case asserts that each event maps to a unique adapter.

Claude reads the last main-chain usage entry and ignores sidechain and cumulative totals. Codex prefers the shared window override over the rollout window. OpenCode and Pi read the usage fields of a completed assistant message, and missing fields count as zero. Vibe reads the last model call of the newest journal segment. Settings read errors fall back to an absent window.

The goal slice is the `chat_slice` byte for byte with no frontmatter or comments. A slice of 4,000 characters passes and 4,001 do not. A budget that cannot be checked, an empty durable slice and a missing `goal.md` are each one-line refusals.

So are a goal command that fails and output that carries frontmatter, markup, a control character or too many characters. A bad packet path is refused before any command runs, and a packet only the working directory holds is found.

An approved decision writes nothing. `hand-over` writes the hand-over line with the note's goal and the hop number. A note that is no longer open writes neither a line nor a notice, and a declined relaunch writes nothing. `claim` and `complete` add their own lines, with the claim naming its session. `history --last` prints the latest lines and rejects a bad count. The hand-over notice stays off until `SESSION_HANDOVER_NOTIFY_HOPS` is set in the hook-flags file.

`keep` writes a `note-kept` line outside the loop and refuses inside it. `history` adds an open-notes line until the note is claimed. A `withdrawn` line prints with its session. The open-notes line reports a withdrawn note apart from an unclaimed one until the note is handed over again.

The killer cases cover the ancestor walk and its repeated pid guard. They cover the refusal to signal without a relaunch record or against a disarmed record. They cover the lock shared by two killers and a takeover mutex that stays with its live owner.

They cover a transient transcript stat failure and the private mode restored on the state directory. A record that `cancel` disarmed while the killer watched it gets no timeout. A withdraw by an operator prompt after the freshness check stops the signal the same way.

The nudge text includes the note, the complete frontmatter, the four sections, the save step and the quoted prepare command. Outside the loop it asks for `keep` instead of `prepare`. Inside the loop it names the `cancel` command just before the closing exception line, and outside the loop it never does.

It covers the extra nudge a withdraw grants. That nudge waits for the floor, one step above the fill, whatever level was spent. Compaction clears it. The stale-note text and the check for a withdrawn note are covered too.

The nudge cases also check seed prefix detection and the threshold rules. The environment wins over config. A value sits in `(0, 1]`, and anything else falls back to `0.8`. The nudge state round trip is covered as well.

The core paths resolve under the isolated runtime directory. `arm` and `unarm` change the record status, and `shouldRelaunch` honors the hop cap. Handoff validation rejects a note whose status is not open. `completeHandoff` moves a claimed note to done with completion metadata.

`shouldRelaunch` reports a cancelled or user-message record as `withdrawn`. `dropNestedLoop` removes every `SKILLED_LOOP_` variable, the manual template included. Preparing, arming, disarming, deferring and withdrawing a record each take the lock once and release it. The note claim and complete do the same. The manual claim command places the quoted seed for each runtime.

The CLI cases cover the exit codes of `prepare`, `claim` and `should-relaunch`. They cover the runtime conflict check and the running-work check. They cover the refusal to carry a spec folder the loop cannot carry. They cover the note path resolution from a subdirectory and the refusal of a spec folder that is not a directory in the repository.

`consume` removes the record under its lock. The `prepare` usage line says the runtime arms the pending record. `cancel` disarms a prepared hand-over, records a `withdrawn` line and grants the extra nudge. It exits 1 when there is none. From a nested run it drops the inherited loop id and refuses, unless `--loop-id` names the loop.

The `skilled-loop-wrapper-*.test.cjs` files share `skilled-loop-wrapper-harness.cjs` and run side by side, so no single file sets the suite's wait. They check the wrapper that starts each runtime and relaunches it. They cover the first launch and each relaunch. They also cover the flags and model that carry between hops.

They cover the Pi provider and model export and the Codex daemon default. They cover the declined stale armed record and the manual command printed after an exit code 130. They cover the consumption of a pending decline record. A relaunch writes one hand-over line, and a note that is no longer open writes none.

A `withdrawn` decline prints one warning and no claim command. A failing `hand-over` call leaves a clean runtime exit alone. A Claude hop whose note carries a sendable goal starts on the goal command and carries the claim seed in the environment. Every hop that cannot send one keeps the claim seed as the start prompt, with one warning line when a named packet is refused. Other runtimes are untouched.

Each runtime's interactive forms resolve the wrapper from the root and a nested directory. Subcommands, print modes, version and help resolve nothing. So do a directory with no `.skilled` and a session already inside a loop.

Stub binaries and a pseudo-terminal from `script` show that a terminal launch goes through the wrapper and a piped one runs the binary. The shim also refuses a checkout it cannot vouch for, such as one an inherited `GIT_DIR` names or one with a `.git` file alone. A registered linked worktree resolves, and a symlink cycle at the wrapper path returns 1.

A sub-agent carries its parent's session id, so a lifecycle command run there would touch the parent's note. The guard denies `claim`, `complete`, `keep`, `prepare`, `cancel`, `consume` and `hand-over` from a sub-agent. It stays silent for the main session, for a whitespace-only agent id and for a sub-agent that only reads `history`.

It also stays silent for an unrelated command, a non-Bash tool and stdin that is not valid JSON. A question dialog is denied while a hand-over is pending or armed without a live killer. It passes when no hand-over is prepared, when the record names no note or when another session owns it. It also passes when a live killer holds the record, when the record read throws, outside a loop and when the concern is off.

The Vibe turn start nudges past the threshold and stays quiet below it. Post tool nudges and leaves an armed hand-over untouched. A claim seed expands at turn start and beats a nudge.

Turn start withdraws an armed hand-over and answers with the notice alone, and the withdraw prompt still records the re-arm floor. Turn end arms the record and spawns the killer on the newest journal file. It ignores a journal lock and picks the numbered segment. A subagent payload neither nudges nor arms, and the switch silences both parts.

The withdraw helper disarms an armed record with a pending extra nudge and a `withdrawn` history line. A pending record counts only as the caller's policy says. Another session's record and an already disarmed one are left alone. A call with no session id withdraws any session's record as `cancel` does. A failing follow-up is reported without undoing the withdrawal.

The history lookup entry exits 2 with the CLI refusal code on an empty invocation. A core that cannot load exits 2 with a different code, so bad arguments stay distinct. The offer is withheld when the compiled core is missing and granted when the entry and the core both exist.

The `fixtures/` folder holds captured runtime data, and the adapter tests read those files by name. Renaming a fixture breaks the suite that reads it. `relaunch-env.cjs` is read by almost every suite here, by `../pi/session-handover.test.ts` and by `.opencode/plugins/tests/session-handover.test.cjs`.

`payload-user-prompt-submit.json`, `payload-stop.json` and `payload-post-tool-use.json` are Claude payloads. `codex-user-prompt-submit.json`, `codex-stop.json` and `codex-rollout-token-count.json` are Codex payloads. `codex-spawn-recorder.cjs` records a killer launch. `opencode-assistant-message-updated.json` and `pi-assistant-message-end.json` carry usage. `transcript-usage.jsonl` holds assistant rows with token usage, one of them a sidechain row. `relaunch-env.cjs` strips inherited relaunch switches before a sandbox sets its own.

New adapter behavior needs a test here. New fixtures belong in `fixtures/`, not inline in a test file, when more than one test reads them.

The tests do not install hooks into the repository. The killer cases start throwaway Node child processes as their targets and wrap `process.kill` to record the signals they send. Each test file removes its temporary root in a cleanup hook, so a failed run leaves no fixture behind.

---

## 4. VALIDATION

Run the suite from the repository root:

```bash
node --test .skilled/hooks/session-handover/tests/*.test.cjs .opencode/plugins/tests/session-handover.test.cjs
```

Expected result: the run exits with status `0`. Its summary, which includes the OpenCode plugin suite, shows `pass` equal to `tests` with every other count at zero. The total grows as tests are added, so the invariant is the zeros, not a number. Node prints each summary line with an info marker. The run takes about one minute.

```text
ℹ tests <N>
ℹ pass <N>
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

Run one file on its own while you work on a single adapter:

```bash
node --test .skilled/hooks/session-handover/tests/killer.test.cjs
```

The Pi extension suite runs under vitest:

```bash
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-handover/pi/session-handover.test.ts
```

---

## 5. RELATED

- [`Session handover`](../README.md): the hook overview, handoff protocol, state files and switches that these tests exercise.
- [`Session handover hook source`](../bin/session-handover.cjs): the entry point the CLI tests call.
- [`OpenCode plugin tests`](../../../../.opencode/plugins/tests/session-handover.test.cjs): the plugin's own suite, which lives beside the plugin and runs with the command above.
- [`Pi extension tests`](../pi/session-handover.test.ts): the vitest suite for the Pi extension.
- [`Test fixtures`](fixtures/README.md): the captured payloads and helper scripts this folder reads.
