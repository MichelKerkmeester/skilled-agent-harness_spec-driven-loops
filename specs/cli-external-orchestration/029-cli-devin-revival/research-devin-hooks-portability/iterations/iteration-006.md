# Iteration 6 — Bash-only hooks cwd/env and exit contract

## Focus

Determine whether the shell-only Claude handlers are portable into Devin unchanged, with emphasis on working-directory selection, environment variables, exit codes, and stdout/stderr behavior.

## Actions Taken

- Read the live Claude registration in `.claude/settings.json`, including the five SessionStart/SessionEnd commands and their `cd "${CLAUDE_PROJECT_DIR:-$PWD}"` wrappers.
- Read the handlers and their tests: `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh`, `install-codex-hooks.mjs --check`, and `session-cleanup.sh`.
- Checked the current Devin CLI hook documentation for command-hook stdin, `DEVIN_PROJECT_DIR`, output, exit codes, discovery of `.claude/settings.json`, and lifecycle payloads.
- Did not run Devin `/hooks` or authenticated smoke tests; the repository's pinned contract records that the local Devin CLI is installed but not authenticated. Those runtime checks remain open.

## Findings

### Devin's confirmed cwd and command contract

The current Devin hook documentation says command hooks receive event JSON on stdin and that `DEVIN_PROJECT_DIR` is automatically set to the project root. It does not promise that the hook process starts in the project root, does not document `PWD` as the project-root contract, and the lifecycle examples do not expose a universal `cwd` stdin field. The adapter must therefore anchor repository-relative commands to `DEVIN_PROJECT_DIR`; inheriting `PWD` is an implementation assumption, not a portable contract.

Devin's documented command result is:

| Result | Devin behavior |
|---|---|
| exit `0` | Continue normally |
| exit `2` | Block the action |
| other nonzero | Log the hook error; do not block |
| JSON stdout | May provide top-level `decision`, `reason`, `hookSpecificOutput.additionalContext`, or `updatedInput` |

This means a fail-open shell handler does not need a top-level approval JSON object merely to allow the event. It does need a thin output adapter if its human-readable stdout/stderr is intended to become agent-visible context; plain warning text is not the documented context-injection format.

### Per-handler verdicts

| Handler and Claude registration | Cwd/env and output behavior | Devin verdict | Required boundary |
|---|---|---|---|
| `worktree-guard.sh` — `SessionStart`, `.claude/settings.json:101-103` | Runs Git discovery from the inherited cwd; emits a warning on stderr; always exits `0` (`.opencode/bin/worktree-guard.sh:20-41`). | **Needs adaptation; not 1:1.** | Change the launch boundary to `cd "${DEVIN_PROJECT_DIR:-$PWD}"` (or use an absolute repo path). Preserve exit `0`; optionally convert the warning into `hookSpecificOutput.additionalContext` if Devin-visible context is required. |
| `check-git-hooks.sh` — `SessionStart`, `.claude/settings.json:106-108` | Resolves the repo and Git hooks path from cwd; emits a warning on stderr; always exits `0` (`.opencode/bin/check-git-hooks.sh:22-97`). | **Needs adaptation; not 1:1.** | Same cwd normalization. Do not map its warning to `decision: block`; the source behavior is advisory and fail-open. |
| `check-dist-staleness.sh --all` — `SessionStart`, `.claude/settings.json:111-113` | The command path itself is relative to cwd. The Python handler later falls back to a script-derived root, but that fallback cannot help if the relative script path cannot be launched. Stale/error banners go to stdout and the handler exits `0` (`.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:9-19,35-41,82-115`). | **Needs adaptation; not 1:1.** | Normalize cwd before launching. Wrap bounded banners as Devin JSON `additionalContext`, or deliberately keep them as non-contextual diagnostics; always preserve exit `0`. |
| `install-codex-hooks.mjs --check` — `SessionStart`, `.claude/settings.json:116-119` | The command path is relative to cwd. `--check` prints `OK` and exits `0`, or prints drift to stderr and sets exit `2` (`.opencode/bin/install-codex-hooks.mjs:340-363,403-408`). The Claude command suppresses both streams and converts drift into a plain stdout echo, so the effective Claude hook remains non-blocking. | **Needs adaptation; not 1:1.** | Normalize cwd and preserve the advisory policy explicitly: translate drift into `additionalContext` and exit `0`. Do not pass the raw `2` through unless Devin should block SessionStart, which would change the existing behavior. |
| `session-cleanup.sh` — `SessionEnd`, `.claude/settings.json:142-150` | The command path is relative to cwd. Cleanup identity comes only from `SESSION_CLEANUP_PID` or `CLAUDE_SESSION_PID`; without one, the script safely no-ops or runs the opt-in orphan sweeper. It can return `1` for a failed kill, but the Claude registration masks that with `|| true` (`.opencode/scripts/session-cleanup.sh:17-31,136-186`). | **Needs adaptation; full 1:1 parity is unavailable from the documented contract.** | Normalize the launch cwd, keep SessionEnd non-blocking, and do not infer an OS PID from Devin's `session_id` or from PPID. A Devin-specific launcher must provide an explicit process PID if real descendant cleanup is required; otherwise port the safe no-op/orphan-only behavior and record cleanup as reduced coverage. |

### Native Claude import is useful, but not sufficient

Current Devin documentation explicitly lists `.claude/settings.json` hook entries as a supported source and says Claude-directory hooks are loaded when `read_config_from.claude` is enabled. That makes native import a legitimate wiring baseline for the SessionStart and SessionEnd rows.

It does not make the existing commands portable automatically. Native import preserves the command string, while these commands reference `CLAUDE_PROJECT_DIR` and `$PWD`; the Devin contract guarantees `DEVIN_PROJECT_DIR` instead. The imported `PreCompact` row also has no Devin lifecycle equivalent, and the Claude `async` property is outside the documented Devin hook-entry fields. Import therefore reduces registration duplication but cannot replace a cwd/output adapter or supply session-cleanup identity. The authoritative Devin path should remain explicit `.devin/hooks.v1.json` entries or shared wrappers that understand both runtimes.

### ADR-001 implication

The shell-only rows are not evidence for a pure native-import strategy. Treat native import as a compatibility probe and optional baseline. For production parity, use thin Devin wrappers that:

1. anchor execution at `DEVIN_PROJECT_DIR`;
2. preserve each handler's fail-open/blocking intent rather than blindly forwarding exit `2`;
3. convert warnings intended for the agent into Devin's JSON context envelope; and
4. keep session cleanup disabled or explicitly PID-bound unless Devin exposes a safe process-identity bridge.

Evidence: [Devin Hooks](https://docs.devin.ai/cli/extensibility/hooks/overview), [Devin Lifecycle Hooks](https://docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks), `.claude/settings.json:91-150`, `.opencode/bin/worktree-guard.sh:20-41`, `.opencode/bin/check-git-hooks.sh:22-97`, `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:9-115`, `.opencode/bin/install-codex-hooks.mjs:340-408`, and `.opencode/scripts/session-cleanup.sh:17-186`.

## Questions Answered

- **Q3:** Refined. Devin guarantees `DEVIN_PROJECT_DIR`, stdin JSON, top-level decision semantics, and exit behavior; it does not document inherited `PWD` or a universal hook `cwd` field.
- **Q4:** Updated the five bash-only handler rows: none is portable 1:1 under the documented contract; four need thin cwd/output adapters, and session cleanup additionally lacks a documented PID bridge.
- **Q5:** Updated. Native Claude import can load the existing Claude hook registrations, but it does not normalize environment variables, rewrite relative commands, translate warning output, supply session PID identity, or create a Devin equivalent for `PreCompact`/`async`.
- **Q6:** Added cwd/env/exit rationale ready to merge into the complete per-hook matrix and ADR-001 evidence.

## Questions Remaining

- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` and `async` entries are ignored, warned on, or rejected.
- Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit Devin wrappers.
- Confirm the actual process cwd used by Devin command hooks; the docs guarantee `DEVIN_PROJECT_DIR`, but not the inherited cwd.
- Determine whether the implementation phase can provide an explicit Devin-owned cleanup PID, or whether SessionEnd cleanup must remain safe no-op/orphan-only.

## Next Focus

Iteration 7 — live import and representative output/exit smoke tests, prioritizing the five shell-only rows and the native-import boundary.

## SCOPE VIOLATIONS

None.
