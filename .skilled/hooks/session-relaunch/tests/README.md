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

Every test file runs without a live agent runtime. Each file creates its own temporary root under the operating system temp directory, points the hooks at that root and removes it in a cleanup hook. The `fixtures/` folder supplies captured payloads so the adapters see the same shapes a real runtime sends.

---

## 2. DIRECTORY TREE

```text
tests/
+-- adapter-conformance.test.cjs   # One case table run through the Claude, Codex, Hermes and OpenCode adapters
+-- claude-adapters.test.cjs       # Claude Code hook adapters: nudge, stop arm, seed prompt
+-- codex-adapters.test.cjs        # Codex adapters: nudge, stop arm, spawn recorder
+-- context-usage.test.cjs         # Context window readers for Claude, Codex, OpenCode and Pi
+-- hermes-adapters.test.cjs       # Hermes session hooks, usage payloads and target lookup
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
| `adapter-conformance.test.cjs` | Runs one table of seed and nudge cases through the Claude, Codex and Hermes hooks as child processes and through the OpenCode plugin in process. A well-formed seed adds the claim command, a seed with a relative note path adds nothing, an invalid carried folder is not resumed, the nudge writes `SYSTEM_SPEC_FOLDER` and drops an invalid one, and a pending handoff, the hop cap or a session outside skilled-loop keeps the nudge silent. The Pi extension runs the same cases in `../pi/session-relaunch.test.ts`. |
| `claude-adapters.test.cjs` | Checks the Claude Code adapters. The nudge fires at the configured context level, the stop arm records a matching pending record and a synchronous killer spawn failure stays armed, and the `UserPromptSubmit` seed carries the claim and completion instructions. |
| `codex-adapters.test.cjs` | Checks the Codex adapters. The nudge fires once at the threshold and again one step above it, the stop hook ignores an armed record whose killer lock owner is still alive, and the stop target lookup picks the ancestor directly below the loop process. |
| `context-usage.test.cjs` | Checks how each runtime reports context fill. Claude reads the last main-chain usage entry and ignores sidechain and cumulative totals. Codex prefers the shared window override over the rollout window. OpenCode and Pi read the usage fields of a completed assistant message, and missing fields count as zero. Settings read errors fall back to an absent window. |
| `hermes-adapters.test.cjs` | Checks the Hermes hooks against captured payloads. The payloads keep their shape with identifiers redacted, the reported and default windows name their source, and the target lookup selects the ancestor directly below the loop process. A seed path with a literal backslash round trips unchanged. |
| `killer.test.cjs` | Checks the killer process that ends the running session before the relaunch. It covers the ancestor walk and its repeated pid guard, the refusal to signal without a relaunch record or against a disarmed record, the lock shared by two killers, a takeover mutex that stays with its live owner, a transient transcript stat failure, and the private mode restored on the state directory. |
| `nudge.test.cjs` | Checks the handoff text that the nudge prints. The text includes the note, the complete frontmatter, the four sections, the save step and the quoted prepare command. It also checks seed prefix detection, the threshold rules (environment over config, values in `(0, 1]`, otherwise `0.8`) and the nudge state round trip. |
| `relaunch-core.test.cjs` | Checks the core state model. Paths resolve under the isolated runtime directory, `arm` and `unarm` change the record status, `shouldRelaunch` honors the hop cap, handoff validation rejects a note whose status is not open, and `completeHandoff` moves a claimed note to done with completion metadata. The manual claim command places the quoted seed for each runtime. |
| `session-relaunch-cli.test.cjs` | Checks the command line entry point. It covers the exit codes of `prepare`, `claim` and `should-relaunch`, the runtime conflict check, the running-work check, the refusal to carry a spec folder the loop cannot carry, and the note path resolution from a subdirectory. |
| `skilled-loop.test.cjs` | Checks the wrapper that starts each runtime and relaunches it. It covers the first launch and each relaunch, the flags and model that carry between hops, the Pi provider and model export, the Codex daemon default, the declined stale armed record, the manual command printed after an exit code 130, and the consumption of a pending decline record. |
| `skilled-loop-shell.test.cjs` | Checks the shell shim under bash and zsh in a sandbox repository whose `.skilled` is a symlink. Each runtime's interactive forms resolve the wrapper from the root and a nested directory. Subcommands, print modes, version and help resolve nothing, as do a directory with no `.skilled` and a session already inside a loop. Stub binaries and a pseudo-terminal from `script` show that a terminal launch goes through the wrapper and a piped one runs the binary. |

---

## 4. FIXTURES

The `fixtures/` folder holds captured runtime data. The adapter tests read these files by name, so renaming a fixture breaks the matching test.

| Group | Files | Used by |
|---|---|---|
| Claude hook payloads | `payload-user-prompt-submit.json`, `payload-stop.json`, `payload-post-tool-use.json` | `claude-adapters.test.cjs` |
| Codex hook payloads | `codex-user-prompt-submit.json`, `codex-stop.json`, `codex-rollout-token-count.json` | `codex-adapters.test.cjs`, `context-usage.test.cjs` |
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
