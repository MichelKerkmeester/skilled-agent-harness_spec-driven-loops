---
title: "shims: Hermetic Stand-In Binaries for the External CLIs"
description: "Fake CLI executables the adapter stress suites spawn in place of real providers, driven by a shim mode and an optional capture record."
trigger_phrases:
  - "cli adapter shims"
  - "hermetic cli stand-in binaries"
  - "shim mode switch"
---

# shims: Hermetic Stand-In Binaries for the External CLIs

---

## 1. OVERVIEW

`shims/` holds the fake executables that the adapter stress suites spawn instead of a real provider. Each file is a small Node script that picks a shim mode, writes an optional capture record, and then emits the stdout, stderr, exit code, signal, termination behavior or artifact set that its edge case expects.

Current state:

- `adapter-shim-core.cjs` holds the shared behavior. The six thin shims are one call each into `runAdapterShim(kind)`.
- `codex-shim.cjs` does not use the core. It keeps its own mode switch, writes its last message to the `-o` output path, and doubles as a `pkill` stand-in.
- The mode resolves from `~/.cli-adapter-control.json`, then `CLI_ADAPTER_SHIM_MODE`, then `success`.
- Capture and pid targets resolve from the control file, then `CLI_ADAPTER_SHIM_CAPTURE` and `CLI_ADAPTER_SHIM_PID_FILE`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `adapter-shim-core.cjs` | Shared `runAdapterShim(kind)` driver. Reads stdin, resolves mode, capture path, pid path and the per-kind state directory, appends the capture record, and runs the mode switch. Exports `runAdapterShim`. |
| `opencode-shim.cjs` | Calls `runAdapterShim('cli-opencode')`. |
| `pi-shim.cjs` | Calls `runAdapterShim('cli-pi')`. |
| `claude-code-shim.cjs` | Calls `runAdapterShim('cli-claude-code')`. |
| `devin-shim.cjs` | Calls `runAdapterShim('cli-devin')`. |
| `cursor-shim.cjs` | Calls `runAdapterShim('cli-cursor')`. |
| `hermes-shim.cjs` | Calls `runAdapterShim('cli-hermes')`. |
| `codex-shim.cjs` | Self-contained codex stand-in with its own mode switch, last-message output path and `pkill` forwarding. |

---

## 3. SHIM MODES

Core modes, used by every shim except codex:

| Mode | Behavior |
|---|---|
| `success` | Writes `research.md` and `review-report.md`, then prints a `{"type":"text"...}` line for opencode and `shim-success` for the rest. |
| `auth-denial` | Prints `<kind> OAuth authentication unavailable` to stdout and stderr, exit 1. |
| `model-not-found` | Prints `<kind> model not found or insufficient balance`, exit 1. |
| `rate-limit` | Prints `<kind> 429 rate limit: throttled`, exit 1. |
| `stdin-wait` | Writes the artifacts, then prints `stdin-closed:<stdin length>`. |
| `timeout` | Keeps a timer alive and never exits. |
| `malformed-output` | Writes the artifacts, then prints `{not-json`. |
| `missing-artifact` | Prints `completed-without-artifact` and writes no artifact. |
| `non-zero-artifact` | Writes the artifacts, prints `<kind> provider diagnostic retained`, exit 23. |
| `signal-exit` | Sends `SIGTERM` to itself. |
| `orphan-tree` | Spawns a child that spawns a grandchild, records all three pids, then stays alive. |
| unknown mode | Prints `unknown shim mode: <mode>`, exit 64. |

Codex modes differ where its CLI contract differs. `success` writes `shim-success` to the `-o` path and prints `completed`. `stdin-wait` writes `stdin-closed` or `stdin-closed-empty` depending on stdin length. `malformed-output` writes `{not-json` to the `-o` path. `missing-artifact` prints `completed-without-last-message` and writes no last message. The exit-23 diagnostic mode is named `non-zero`. `orphan-tree`, `signal-exit`, `timeout`, `auth-denial`, `model-not-found`, `rate-limit` and the unknown-mode fallback match the core shape.

---

## 4. CONFIGURATION

| Setting | Source |
|---|---|
| Shim mode | `mode` in `~/.cli-adapter-control.json`, then `CLI_ADAPTER_SHIM_MODE`, then `success`. |
| Capture path | `capturePath` in the control file, then `CLI_ADAPTER_SHIM_CAPTURE`. The core appends one JSON record per run with kind, pid, cwd, args, stdin and selected environment values. Codex writes a single record instead. |
| Pid path | `pidPath` in the control file, then `CLI_ADAPTER_SHIM_PID_FILE`. Holds the root pid, plus child and grandchild pids for `orphan-tree`. |
| Artifact location | The parent of the state directory named by the per-kind variable (`SPECKIT_OPENCODE_STATE_DIR`, `SPECKIT_PI_STATE_DIR`, `SPECKIT_CLAUDE_CODE_STATE_DIR`, `SPECKIT_DEVIN_STATE_DIR`, `SPECKIT_CURSOR_STATE_DIR`, `SPECKIT_HERMES_STATE_DIR`), otherwise the current working directory. |
| Reap capture | `CLI_ADAPTER_REAP_CAPTURE`, codex only. Records the arguments when codex is invoked as `pkill`, then forwards to `/usr/bin/pkill` or `/bin/pkill`. |

---

## 5. RELATED

- [`cli-adapter` overview](../README.md)
- [`fixtures`](../fixtures) shim, suite, process and worktree fixtures
- [`tests` overview](../../../README.md)
