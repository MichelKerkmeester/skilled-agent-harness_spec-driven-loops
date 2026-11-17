---
title: "Cursor Hooks: A Link Index Over the Shared Guard Cores"
description: "Twenty-five links that point at Cursor's hook files, while .cursor/hooks.json wires the real adapters and their shared cores under .skilled."
trigger_phrases:
  - "cursor hooks"
  - "cursor hook mirror"
  - "cursor hook entries"
---

# Cursor Hooks: A Link Index Over the Shared Guard Cores

---

## 1. OVERVIEW

`.cursor/hooks/` holds 25 links and this README. Cursor finds its hooks by reading `.cursor/hooks.json`, and every command in that file names a real path under `.skilled/`. Nothing in this folder runs on its own.

A link points at one of two things. Most point at an adapter that turns a Cursor event into a call on a shared core. The others point at the script that holds the work itself. The `Kind` column in the entry map says which. [The hook library](../../.skilled/hooks/README.md) holds the cores and the coverage matrix.

Every adapter fails open on an error. A payload it cannot read or a missing child becomes an allow, so a broken guard never stalls a session. `git-message-gate` is the exception: when the sk-git rulebook exists but cannot be read, it refuses the command. Six entries can still refuse a call when they find a violation, and the boundaries table below names them.

---

## 2. ARCHITECTURE

```text
Cursor event
   |
   v
.cursor/hooks.json
   |
   v
real adapter under .skilled/
   |
   v
shared core
   |
   v
Cursor answer: allow or deny
```

The runtime never reaches a file through this folder. `hooks.json` names the adapter in its real folder, so the drawing leaves the link out on purpose. A rule change belongs in the core, so every runtime that loads it gets the change.

---

## 3. ENTRY MAP

One row per link. The event and matcher come from `.cursor/hooks.json`, and the fourth column names the file that command runs.

| Entry | Event | Kind | Real file or core | Effect |
|---|---|---|---|---|
| `check-dist-staleness.sh` | `sessionStart` | full script | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | A banner when a watched build output is stale. Exit 0 either way. |
| `check-git-hooks.sh` | `sessionStart` | full script | `.skilled/bin/check-git-hooks.sh` | One warning naming each git hook whose link is missing. |
| `completion-evidence-response.mjs` | `afterAgentResponse` | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | A log row when a completion claim lacks evidence. Core: `completion-evidence-sentinel.cjs`. |
| `dispatch-preflight-lint.mjs` | `preToolUse` (`Shell`) | thin adapter | `.skilled/hooks/cli-dispatch/cursor/dispatch-preflight-lint.mjs` | A refusal before a broken `cli-*` dispatch runs. Core: the Claude adapter it spawns. |
| `env-secret-guard-after.cjs` | `postToolUse` | one-line re-export | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard-after.cjs` | Undoes a dotenv write and reports a dotenv value in the output. |
| `env-secret-guard.cjs` | `preToolUse` | thin adapter | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs` | A refusal when a call would expose a dotenv secret. Core: `env-secret-guard.cjs`. |
| `git-live-follow.sh` | `sessionStart` (`--start`) | full script | `.skilled/bin/git-live-follow.sh` | One follower per checkout and a status line. Refuses inside a linked worktree. |
| `git-message-gate.mjs` | `preToolUse` (`Shell`) | full script | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | A refusal when a git message breaks the sk-git contract. |
| `git-preflight-advisory.mjs` | `preToolUse` (`Shell`) | full script | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | An advisory block of up to three findings before a git command. Never a refusal. |
| `git-primary-reconcile.sh` | `sessionStart` (detached) | full script | `.skilled/bin/git-primary-reconcile.sh` | Brings the primary checkout's live branch up to date, fast-forward first, rebase and publish second. It skips when the checkout sits on another branch and stops on a dirty collision. |
| `goal-inject.mjs` | `sessionStart` | thin adapter | `.skilled/hooks/goal/cursor/goal-inject.mjs` | The goal brief and the resend command as `agent_message`. Core: `goal-core.cjs`. |
| `install-codex-hooks.mjs` | `sessionStart` (`--check`) | full script | `.skilled/bin/install-codex-hooks.mjs` | On drift, a message naming the `--check` command that reports it. The same command without `--check` clears it. |
| `mcp-route-guard.mjs` | `beforeMCPExecution` | thin adapter | `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | An advisory note for a misrouted MCP tool. Never a refusal. |
| `overlay-guard.mjs` | `preToolUse` (`Write`) | thin adapter | `.skilled/hooks/overlay-guard/cursor/overlay-guard.mjs` | A refusal when an overlay manifest protects the path. Core: `overlay-guard.cjs`. |
| `post-tool-use.mjs` | `postToolUse` | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | Quality findings after a write and an audit row after a shell call. |
| `precompact.js` | `preCompact` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js` | A cached context file for the next session start. No message. |
| `session-cleanup.sh` | `sessionEnd` | full script | `.skilled/scripts/session-cleanup.sh` | Kills the session's own MCP helper processes and logs what it reaped. |
| `session-end.js` | `sessionEnd` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js` | The completion evidence check at teardown. `stop` never fires in this runtime. |
| `session-start.js` | `sessionStart` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js` | A primed context brief as `agent_message`. |
| `spec-gate-classify.mjs` | `beforeSubmitPrompt` | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Classifies the turn for the gate. Core: `spec-gate-core.mjs`. |
| `spec-gate-enforce.mjs` | `preToolUse` | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | A refusal on a mutation until the spec folder is named, only when `SYSTEM_SPEC_GATE_ENFORCE=1`. `.cursor/hooks.json` does not set it, so by default the entry advises instead. Core: `spec-gate-core.mjs`. |
| `spec-gate-prebind.mjs` | `sessionStart` | thin adapter | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Binds or opens the gate state before the first tool call. Core: `spec-gate-core.mjs`. |
| `task-dispatch-guard.mjs` | `preToolUse` (`Task`) | thin adapter | `.skilled/hooks/subagent-dispatch-guard/cursor/task-dispatch-guard.mjs` | A refusal or note when a Task dispatch breaks the dispatch rules. |
| `user-prompt-submit.js` | `beforeSubmitPrompt` | compiled adapter | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js` | An advisor brief in the envelope. Dormant under the tested CLI build. |
| `worktree-guard.sh` | `sessionStart` | full script | `.skilled/bin/worktree-guard.sh` | A warning on the shared checkout and at most one worktree sweep per six hours. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An adapter imports its core or spawns a sibling under `.skilled/`. The runtime imports nothing from this folder. |
| Ownership | Policy sits in the core. The adapter translates the Cursor payload and builds the reply envelope. |
| Failure | Fail open is the default. `git-message-gate` is the exception: when the sk-git rulebook exists but cannot be read, it refuses the command. Six entries can refuse, each with `permission: deny` and exit 2. |
| Wiring | `.cursor/hooks.json` names the real paths. A link that resolves is a convenience for a reader, not a runtime dependency. |

The six that can refuse are `spec-gate-enforce.mjs` (only under `SYSTEM_SPEC_GATE_ENFORCE=1`), `overlay-guard.mjs`, `task-dispatch-guard.mjs`, `dispatch-preflight-lint.mjs`, `env-secret-guard.cjs` and `git-message-gate.mjs`.

---

## 5. CONFIGURATION

Most guards share one switch resolver, `.skilled/hooks/shared/hook-flags.cjs`, and its shell twin reads the same names. A switch can arrive as an environment variable or from `.skilled/hooks/hook-flags.env`, and the environment value wins when both hold one.

| Switch or file | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master kill switch. Every guard that reads the resolver goes silent. |
| `.skilled/hooks/hook-flags.env` | Keeps switches between sessions. An environment value overrides the file. |
| `SYSTEM_SPEC_FOLDER` | Binds the spec folder at session start when the path is valid, so the spec-folder question is already answered. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Opens the gate at session start, so `spec-gate-enforce.mjs` applies the gate for the rest of the session. |
| `SPECKIT_WORKTREE_GUARD=off` | Silences the worktree warning and its sweep. |
| `SPECKIT_GIT_HOOKS_GUARD=off` | Silences the git hook check. |
| `OPENCODE_GOAL_DISABLED=1` | Silences goal injection. |

---

## 6. VALIDATION

Run both commands from the repository root.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

Expected result: exit 0. The last line begins `[runtime-mirror-sync] PASS:` and reports every mirror in sync.

```bash
find .cursor/hooks -type l ! -exec test -e {} \; -print
```

Expected result: no output. Any line here names a link that no longer resolves.

---

## 7. RELATED

- [Cursor hook wiring](../hooks.json): the file Cursor loads, with every event and matcher
- [The Cursor sync manifest](../SYNC.md): what is linked and what is generated
- [The hook library](../../.skilled/hooks/README.md): the cores and the coverage matrix
- [The injection contract](../../.skilled/hooks/injection-contract.md): what each hook injects and whether you see it
- [The Codex hook mirror](../../.codex/hooks/README.md): the same pattern in another runtime
