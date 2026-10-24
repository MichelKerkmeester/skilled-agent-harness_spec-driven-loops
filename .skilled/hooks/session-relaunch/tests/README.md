---
title: "Session relaunch tests: regression suite for the relaunch loop"
description: "Node test files and captured runtime payloads that cover the session relaunch hooks, the handoff protocol, the killer process and the skilled-loop wrapper."
trigger_phrases:
  - "session relaunch tests"
  - "relaunch loop test suite"
  - "session relaunch fixtures"
  - "killer test harness"
version: 1.0.0.0
---

# Session relaunch tests: regression suite for the relaunch loop

---

## 1. OVERVIEW

This folder holds the regression suite for the session relaunch hooks in `.skilled/hooks/session-relaunch/`. The suite covers the runtime adapters for Claude, Codex, Hermes and Pi, the handoff note protocol, the context usage readers, the killer process that ends a session before a relaunch, and the `skilled-loop` wrapper that starts the next session.

Every test file runs without a live agent runtime. Each file creates its own temporary root under the operating system temp directory, points the hooks at that root and removes it in a cleanup hook. A run started inside a looped session inherits the wrapper's `SKILLED_LOOP_` variables, so each file whose cases read that environment drops all of them when it loads, and the suite gives the same result inside the loop and outside it. The `fixtures/` folder supplies captured payloads so the adapters see the same shapes a real runtime sends.

---

## 2. DIRECTORY TREE

```text
tests/
+-- adapter-conformance.test.cjs   # One case table run through the Claude, Codex, Hermes and OpenCode adapters
+-- claude-adapters.test.cjs       # Claude Code hook adapters: nudge, stop arm, seed prompt, compact pointer
+-- codex-adapters.test.cjs        # Codex adapters: nudge, stop arm, spawn recorder
+-- context-usage.test.cjs         # Context window readers for Claude, Codex, OpenCode and Pi
+-- hermes-adapters.test.cjs       # Hermes session hooks, usage payloads and target lookup
+-- hop-history.test.cjs           # Hop history: hand-over, claim, complete and keep lines
+-- killer.test.cjs                # Killer process: locks, takeover, timeouts, state modes
+-- nudge.test.cjs                 # Nudge text, seed detection, threshold and state round trip
+-- relaunch-core.test.cjs         # Core state: arm, unarm, handoff validation, claim, complete
+-- session-relaunch-cli.test.cjs  # CLI subcommands: prepare, claim, should-relaunch and others
+-- skilled-loop.test.cjs          # Wrapper that relaunches each runtime with its carried flags
+-- skilled-loop-shell.test.cjs    # Shell shim that starts plain runtime launches under the wrapper
`-- fixtures/                      # Captured runtime payloads and one recorder script
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `adapter-conformance.test.cjs` | Runs one table of seed and nudge cases through the Claude, Codex and Hermes hooks as child processes and through the OpenCode plugin in process. A well-formed seed adds the claim command, a seed with a relative note path adds nothing, an invalid carried folder is not resumed, the nudge writes `SYSTEM_SPEC_FOLDER` and drops an invalid one, a pending handoff or the hop cap keeps the nudge silent, and outside skilled-loop the nudge asks for `keep` and never for `prepare`. The Pi extension runs the same cases in `../pi/session-relaunch.test.ts`. |
| `claude-adapters.test.cjs` | Checks the Claude Code adapters. The nudge fires at the configured context level, the stop arm records a matching pending record and a synchronous killer spawn failure stays armed, and the `UserPromptSubmit` seed carries the claim and completion instructions. After a compaction the compact pointer resets the nudge level and points the session at its open note, and it adds nothing on a fresh start, with no open note or while a prepared hop owns the note. A Stop deferred by background tasks stamps the pending record, a typed prompt then withdraws it and answers with the notice alone, and one more nudge comes only once the fill rises a step above the withdraw. A task-notification prompt or a record that was never deferred stays as it is. After a compaction, a session whose hand-over was withdrawn is told not to claim the stale note, and one whose disarmed record is unrelated still gets the claim seed. |
| `codex-adapters.test.cjs` | Checks the Codex adapters. The nudge fires once at the threshold and again one step above it, the stop hook ignores an armed record whose killer lock owner is still alive, and the stop target lookup picks the ancestor directly below the loop process. |
| `context-usage.test.cjs` | Checks how each runtime reports context fill. Claude reads the last main-chain usage entry and ignores sidechain and cumulative totals. Codex prefers the shared window override over the rollout window. OpenCode and Pi read the usage fields of a completed assistant message, and missing fields count as zero. Settings read errors fall back to an absent window. |
| `hermes-adapters.test.cjs` | Checks the Hermes hooks against captured payloads. The payloads keep their shape with identifiers redacted, the reported and default windows name their source, and the target lookup selects the ancestor directly below the loop process. A seed path with a literal backslash round trips unchanged. |
| `hop-history.test.cjs` | Checks the hop history. An approved decision writes nothing, `hand-over` writes the hand-over line with the note's goal and the hop number, a note that is no longer open writes neither a line nor a notice, a declined relaunch writes nothing, claim and complete add their own lines with the claim naming its session, `history --last` prints the latest lines and rejects a bad count, and the hand-over notice stays off until `SESSION_RELAUNCH_NOTIFY_HOPS` is set in the hook-flags file. `keep` writes a `note-kept` line outside the loop and refuses inside it, and `history` adds an open-notes line until the note is claimed. A `withdrawn` line prints with its session, and the open-notes line reports a withdrawn note apart from an unclaimed one until the note is handed over again. |
| `killer.test.cjs` | Checks the killer process that ends the running session before the relaunch. It covers the ancestor walk and its repeated pid guard, the refusal to signal without a relaunch record or against a disarmed record, the lock shared by two killers, a takeover mutex that stays with its live owner, a transient transcript stat failure, the private mode restored on the state directory and a record that `cancel` disarmed while the killer watched it, which gets no timeout. |
| `nudge.test.cjs` | Checks the handoff text that the nudge prints. The text includes the note, the complete frontmatter, the four sections, the save step and the quoted prepare command, and outside the loop it asks for `keep` instead of `prepare`. Inside the loop it names the `cancel` command just before the closing exception line, and outside the loop it never does. It covers the extra nudge a withdraw grants: it waits for the floor, one step above the fill, whatever level was spent, and compaction clears it. The stale-note text and the check for a withdrawn note are covered too. It also checks seed prefix detection, the threshold rules (environment over config, values in `(0, 1]`, otherwise `0.8`) and the nudge state round trip. |
| `relaunch-core.test.cjs` | Checks the core state model. Paths resolve under the isolated runtime directory, `arm` and `unarm` change the record status, `shouldRelaunch` honors the hop cap, handoff validation rejects a note whose status is not open, and `completeHandoff` moves a claimed note to done with completion metadata. `shouldRelaunch` reports a cancelled or user-message record as `withdrawn`. `dropNestedLoop` removes every `SKILLED_LOOP_` variable, the manual template included. Record writes and note claim and complete each take the lock once and release it. The manual claim command places the quoted seed for each runtime. |
| `session-relaunch-cli.test.cjs` | Checks the command line entry point. It covers the exit codes of `prepare`, `claim` and `should-relaunch`, the runtime conflict check, the running-work check, the refusal to carry a spec folder the loop cannot carry, the note path resolution from a subdirectory, the refusal of a spec folder that is not a directory in the repository, and `cancel`. `cancel` disarms a prepared hand-over, records a `withdrawn` line, grants the extra nudge and exits 1 when there is none. From a nested run it drops the inherited loop id and refuses, unless `--loop-id` names the loop. |
| `skilled-loop.test.cjs` | Checks the wrapper that starts each runtime and relaunches it. It covers the first launch and each relaunch, the flags and model that carry between hops, the Pi provider and model export, the Codex daemon default, the declined stale armed record, the manual command printed after an exit code 130, and the consumption of a pending decline record. A relaunch writes one hand-over line, and a note that is no longer open writes none. A `withdrawn` decline prints one warning and no claim command, and a failing `hand-over` call leaves a clean runtime exit alone. |
| `skilled-loop-shell.test.cjs` | Checks the shell shim under bash and zsh in a sandbox repository whose `.skilled` is a symlink. Each runtime's interactive forms resolve the wrapper from the root and a nested directory. Subcommands, print modes, version and help resolve nothing, as do a directory with no `.skilled` and a session already inside a loop. Stub binaries and a pseudo-terminal from `script` show that a terminal launch goes through the wrapper and a piped one runs the binary. |

---

## 4. FIXTURES

The `fixtures/` folder holds captured runtime data. The adapter tests read these files by name, so renaming a fixture breaks the matching test.

| Group | Files | Used by |
|---|---|---|
| Claude hook payloads | `payload-user-prompt-submit.json`, `payload-stop.json`, `payload-post-tool-use.json` | `claude-adapters.test.cjs` |
| Codex hook payloads | `codex-user-prompt-submit.json`, `codex-stop.json`, `codex-rollout-token-count.json` | `adapter-conformance.test.cjs`, `codex-adapters.test.cjs`, `context-usage.test.cjs` |
| Codex spawn recorder | `codex-spawn-recorder.cjs` | `codex-adapters.test.cjs` |
| Hermes hook payloads | `hermes-on-session-start.json`, `hermes-on-session-end.json`, `hermes-on-session-finalize.json`, `hermes-pre-api-request.json`, `hermes-post-api-request.json`, `hermes-pre-verify.json` | `hermes-adapters.test.cjs` |
| Hermes usage | `hermes-usage.json` | `hermes-adapters.test.cjs` |
| OpenCode and Pi usage | `opencode-assistant-message-updated.json`, `pi-assistant-message-end.json` | `context-usage.test.cjs` |
| Transcript usage | `transcript-usage.jsonl` | `context-usage.test.cjs` |

Hermes payloads carry redacted identifiers. Keep new captures redacted in the same way.

---

## 5. BOUNDARIES

- Tests do not install hooks into the repository. The killer tests start throwaway Node child processes as their targets and wrap `process.kill` to record the signals they send.
- Each test file removes its temporary root in a cleanup hook, so a failed run leaves no fixture behind.
- New adapter behavior needs a test here. New fixtures belong in `fixtures/`, not inline in a test file, when more than one test reads them.
- Test helpers stay inside each test file. This folder has no shared helper module.

---

## 6. VALIDATION

Run the suite from the repository root:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
```

Expected result: the run exits with status `0`, and its summary, which includes the OpenCode plugin suite, shows `pass` equal to `tests` with every other count at zero. The total grows as tests are added, so the invariant is the zeros, not a number. Node prints each summary line with an info marker. The run takes about one minute.

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
node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs
```

The Pi extension suite runs under vitest:

```bash
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```

---

## 7. RELATED

- [`Session relaunch`](../README.md): the hook overview, handoff protocol, state files and switches that these tests exercise.
- [`Session relaunch hook source`](../bin/session-relaunch.cjs): the entry point the CLI tests call.
- [`OpenCode plugin tests`](../../../../.opencode/plugins/tests/session-relaunch.test.cjs): the plugin's own suite, which lives beside the plugin and runs with the command in section 6.
- [`Pi extension tests`](../pi/session-relaunch.test.ts): the vitest suite for the Pi extension.
