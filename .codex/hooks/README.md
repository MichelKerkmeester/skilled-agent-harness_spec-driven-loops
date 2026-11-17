---
title: "Codex Hooks: A Link Index Over the Hook Entries"
description: "Twenty-seven links that point at Codex's hook files, while .codex/hooks.json wires the real adapters and their shared cores under .skilled."
trigger_phrases:
  - "codex hooks"
  - "codex hook mirror"
  - "codex hook entries"
---

# Codex Hooks: A Link Index Over the Hook Entries

---

## 1. OVERVIEW

`.codex/hooks/` holds 27 links and this README. Codex finds its hooks by reading `.codex/hooks.json` in a trusted checkout. Every command in that file names a real path under `.skilled/`, so nothing in this folder runs on its own.

Each link exists so you can find an entry and compare it with another runtime. Most point at a script that holds the work. Some point at a thin adapter that turns a Codex event into a call on a shared core. A few point at a compiled runtime adapter or at a one-line re-export. [The hook library](../../.skilled/hooks/README.md) holds the cores and the coverage matrix.

A link is not a second copy of the file. It resolves to the same path Codex runs. A compiled ESM entry runs through the link as well. The entry guard resolves both the launch path and the module URL before it compares them, so a linked path still counts as the entrypoint.

---

## 2. ARCHITECTURE

```text
Codex event
   |
   v
.codex/hooks.json
   |
   v
real adapter under .skilled/
   |
   v
shared core
   |
   v
Codex answer: context or deny
```

The runtime never reaches a file through this folder. `hooks.json` names the adapter in its real folder, so the drawing leaves the link out on purpose. A rule change belongs in the core, and every runtime that loads it gets the change.

---

## 3. ENTRY MAP

One row per link. The event and matcher come from `.codex/hooks.json`, and the fourth column names the file that command runs.

| Entry | Event | Kind | Real file or core | Effect |
|---|---|---|---|---|
| `ask-surface-stop.cjs` | `Stop` | thin adapter | `.skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs` | A stderr line when the last message ends on a prose menu. Never a block. |
| `check-dist-staleness.sh` | `SessionStart` (`--all`) | full script | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | A bounded banner when a watched build output is stale. Exit 0 either way. |
| `check-git-hooks.sh` | `SessionStart` | full script | `.skilled/bin/check-git-hooks.sh` | One warning naming each git hook link that is missing or broken. It can repair them from the main checkout. Exit 0. |
| `compact-inject.js` | `PreCompact` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js` | A cached brief for the next session start. No message on this event. |
| `completion-evidence-stop.cjs` | `Stop` | full script | `.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | A warning on stderr and a log row when a completion claim lacks evidence. Never a block. |
| `dispatch-audit-posttooluse.mjs` | `PostToolUse` (`exec\|Bash`) | full script | `.skilled/hooks/cli-dispatch/codex/dispatch-audit-posttooluse.mjs` | One redacted JSONL audit line for the shell call. No decision. |
| `dispatch-preflight-lint.mjs` | `PreToolUse` (`exec\|Bash`) | thin adapter | `.skilled/hooks/cli-dispatch/codex/dispatch-preflight-lint.mjs` | A refusal before a dispatch that breaks a hard rule. A warning for a `warn`-severity violation. Core: `dispatch-rule-checks.mjs`. |
| `env-secret-guard-after.cjs` | `PostToolUse` (`exec\|Bash`) | one-line re-export | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard-after.cjs` | Undoes a dotenv write and reports a dotenv value found in the output. |
| `env-secret-guard.cjs` | `PreToolUse` (`exec\|Bash\|apply_patch\|edit\|read_file`) | thin adapter | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs` | A refusal when a call would expose a dotenv secret. Core: `env-secret-guard.cjs`. |
| `git-live-follow.sh` | `SessionStart` (`--start`) | full script | `.skilled/bin/git-live-follow.sh` | One follower per checkout and a status line. It refuses inside a linked worktree. |
| `git-message-gate.mjs` | `PreToolUse` (`exec\|Bash`) | full script | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | A refusal when a git message or a branch name breaks the sk-git contract. |
| `git-preflight-advisory.mjs` | `PreToolUse` (`exec\|Bash`) | full script | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Up to three advisory lines before a git command. Never a refusal. |
| `git-primary-reconcile.sh` | `SessionStart` (detached) | full script | `.skilled/bin/git-primary-reconcile.sh` | Fast-forwards its live branch, then rebases and publishes its own commits. It skips a checkout on another branch and stops on a dirty collision. |
| `handover-compact-pointer.mjs` | `SessionStart` (`source=compact`) | full script | `.skilled/hooks/session-handover/codex/handover-compact-pointer.mjs` | A pointer back to the handoff note and a reset nudge level. |
| `handover-context-nudge.mjs` | `PostToolUse` (no matcher) | thin adapter | `.skilled/hooks/session-handover/codex/handover-context-nudge.mjs` | A handoff note request once the transcript fills past the threshold. |
| `handover-prompt-seed.mjs` | `UserPromptSubmit` | thin adapter | `.skilled/hooks/session-handover/codex/handover-prompt-seed.mjs` | The seed instructions for a relaunch prompt. An operator prompt withdraws a pending hop. |
| `handover-stop-arm.mjs` | `Stop` | full script | `.skilled/hooks/session-handover/codex/handover-stop-arm.mjs` | Arms the relaunch record and starts the killer. Without `SKILLED_LOOP_ID` it does nothing. |
| `mcp-route-guard.cjs` | `PreToolUse` (`mcp__.*`) | thin adapter | `.skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` | An advisory note for a misrouted MCP tool. Never a refusal. |
| `overlay-guard.cjs` | `PreToolUse` (`apply_patch\|edit`) | thin adapter | `.skilled/hooks/overlay-guard/codex/overlay-guard.cjs` | A refusal when an overlay manifest owns any file in the call. |
| `post-edit-quality.cjs` | `PostToolUse` (`apply_patch\|edit`) | full script | `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` | Checker warnings for the edited file and one dist-staleness banner per patch. |
| `session-cleanup.sh` | `Stop` | full script | `.skilled/scripts/session-cleanup.sh` | Kills the MCP helper processes owned by `SESSION_CLEANUP_PID`. Without that pid it logs a skip unless the orphan sweep is enabled. |
| `session-start.js` | `SessionStart` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` | A primed context brief. |
| `session-stop.js` | `Stop` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js` | A token-usage snapshot and updated session state. No message. |
| `spec-gate-classify.mjs` | `UserPromptSubmit` | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Gate state for the turn. It emits no question. |
| `spec-gate-enforce.mjs` | `PreToolUse` (`exec\|Bash\|apply_patch\|edit`) | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | A refusal until the spec folder is named when `SYSTEM_SPEC_GATE_ENFORCE=1`. Otherwise a notice on the first mutation. |
| `user-prompt-submit.js` | `UserPromptSubmit` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js` | An advisor brief in the envelope. |
| `worktree-guard.sh` | `SessionStart` | full script | `.skilled/bin/worktree-guard.sh` | A warning on the shared checkout and at most one worktree sweep per six hours. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An adapter imports its core or a sibling under `.skilled/`. Codex imports nothing from this folder. |
| Ownership | Policy sits in the core. The adapter reads the Codex payload and builds the reply envelope. |
| Failure | Fail open is the default. A payload it cannot read becomes an allow. So does an internal error. `git-message-gate` is the exception: when the sk-git rulebook exists but cannot be read, it refuses the command. |
| Wiring | `.codex/hooks.json` names the real paths. A link is a convenience for a reader, not a runtime dependency. |

Five entries can refuse a call instead: `dispatch-preflight-lint.mjs`, `spec-gate-enforce.mjs`, `overlay-guard.cjs`, `env-secret-guard.cjs` and `git-message-gate.mjs`. Each writes `permissionDecision: deny` with a reason and exits 0. `spec-gate-enforce.mjs` refuses only when `SYSTEM_SPEC_GATE_ENFORCE=1`.

---

## 5. CONFIGURATION

Most adapters ask the switch resolver, `.skilled/hooks/shared/hook-flags.cjs`, whether their concern is on. A switch arrives as an environment variable or from `.skilled/hooks/hook-flags.env`. The environment wins when both hold a value.

| Switch or variable | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master kill switch. Every entry that checks it goes silent. |
| `SYSTEM_SESSION_HANDOVER_ENABLED=1` | Turns the four handover entries on. Codex stays off without it. |
| `SYSTEM_SESSION_HANDOVER_CODEX_ENABLED=1` | Turns them on in Codex alone and answers before the global switch. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Lets `spec-gate-enforce.mjs` refuse a mutation. Without it the gate only advises. |
| `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` | Silences both env-secret entries. Environment only, and the master switch reaches them from the environment only too. |
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | Silences `post-edit-quality.cjs`. |
| `MCP_ROUTE_GUARD_DISABLED=1` | Silences `mcp-route-guard.cjs`. |
| `SPECKIT_WORKTREE_GUARD=off` | Silences the worktree warning and its sweep. `SPECKIT_WORKTREE_AUTOREAP=0` stops only the sweep. |
| `SPECKIT_GIT_HOOKS_GUARD=off` | Silences the git hook check and its repair. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Stops both git session-start scripts. `SYSTEM_LIVE_FOLLOW_DISABLED=1` stops only the follower. |
| `SESSION_CLEANUP_PID` | Names the session whose MCP helpers `session-cleanup.sh` may kill. |

`git-message-gate.mjs` has no switch. The resolver file lists each per-concern name beside the aliases it still honors.

---

## 6. VALIDATION

Run each command from the repository root.

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .codex/hooks/README.md
```

Expected result: `VALID: .codex/hooks/README.md`, `Total issues: 0` and exit 0.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

Expected result: exit 0, and the last line begins `[runtime-mirror-sync] PASS:`.

```bash
node .skilled/bin/install-codex-hooks.mjs --check
```

Expected result: `install-codex-hooks: OK <path to ~/.codex/hooks.json>` and exit 0. A `DRIFT` line with exit 1 means the user-global file still carries a copy of these entries.

---

## 7. RELATED

- [Codex project hook wiring](../hooks.json): the file Codex loads, with every event and matcher
- [The Codex sync manifest](../SYNC.md): what is linked and what is generated
- [The hook library](../../.skilled/hooks/README.md): the cores and the coverage matrix
- [The injection contract](../../.skilled/hooks/injection-contract.md): what each hook injects and whether you see it
- [The Cursor hook mirror](../../.cursor/hooks/README.md): the same pattern in another runtime
