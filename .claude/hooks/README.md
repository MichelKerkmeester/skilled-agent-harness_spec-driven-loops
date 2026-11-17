---
title: "Claude Code Hooks: Links to the Shared Hook Cores"
description: "One symlink per Claude Code hook entry, with the real path settings.json runs and what each adapter adds to a session."
trigger_phrases:
  - "claude code hooks"
  - "claude hook mirror"
  - "claude hooks folder"
---

# Claude Code Hooks: Links to the Shared Hook Cores

---

## 1. OVERVIEW

`.claude/hooks/` holds one symlink for each hook that Claude Code runs in this repository. It is an index for reading. The wiring lives in [the Claude settings](../settings.json), and every command there names a real path under `.skilled/`.

Most links are thin adapters over a runtime-neutral core. The scripts under `.skilled/bin/`, `check-dist-staleness.sh` (Python despite the suffix) and `session-cleanup.sh` are whole programs that carry their own logic. `env-secret-guard-after.cjs` is a one-line re-export of the guard beside it, because the installer identifies a hook by its script path and one file cannot sit on two events.

Every entry follows one rule. It approves when it cannot judge, so a broken hook never stops work. `git-message-gate` is the exception: when the sk-git rulebook exists but cannot be read, it refuses the command. Nine entries can still refuse a call, and BOUNDARIES AND FLOW names them.

The links are honest about their targets. A module's own URL resolves through every symlink, and the two direct-entry guards these entries use compare real paths on both sides, so an adapter launched through its link behaves like the adapter launched from its real path. Run the real path when you quote a command, because that is what `settings.json` runs.

---

## 2. ARCHITECTURE

```text
╭───────────────────────────────╮
│ Claude Code event             │
╰───────────────┬───────────────╯
                ▼
┌───────────────────────────────┐
│ .claude/settings.json         │
│ bash -c ... node <real path>  │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ adapter under .skilled        │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ runtime-neutral core          │
└───────────────┬───────────────┘
                ▼
╭───────────────────────────────╮
│ deny, advisory, added context │
│ or silence                    │
╰───────────────────────────────╯
```

Dependency direction: `settings.json` ───▶ adapter ───▶ core.

The link in `.claude/hooks/` points at the same adapter. It sits beside that path, not on it, so a broken link costs a reader a lookup and costs the runtime nothing.

---

## 3. ENTRY MAP

One row per link. The Event column names the Claude Code event and matcher that carries the entry. The core column is the file the link resolves to, written from the repository root.

| Entry | Event | Real file or core | Effect |
|---|---|---|---|
| `session-prime.js` | SessionStart | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` | Adds the session context brief to the turn. |
| `worktree-guard.sh` | SessionStart | `.skilled/bin/worktree-guard.sh` | Warns that a top-level session shares the primary checkout. |
| `check-git-hooks.sh` | SessionStart | `.skilled/bin/check-git-hooks.sh` | Warns when a git hook the repo expects is missing. |
| `git-primary-reconcile.sh` | SessionStart | `.skilled/bin/git-primary-reconcile.sh` | Converges the primary checkout in the background, with output discarded. |
| `git-live-follow.sh` | SessionStart | `.skilled/bin/git-live-follow.sh` | Starts the live-branch follower for this checkout. |
| `check-dist-staleness.sh` | SessionStart | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Warns when a compiled package is older than its source. |
| `install-codex-hooks.mjs` | SessionStart | `.skilled/bin/install-codex-hooks.mjs` | Runs `--check` and reports Codex hook drift as a warning. |
| `handover-compact-pointer.mjs` | SessionStart | `.skilled/hooks/session-handover/claude/handover-compact-pointer.mjs` | Adds a pointer to the handoff note after a compaction. |
| `sync-claude-user-hooks.mjs` | SessionStart | `.skilled/bin/sync-claude-user-hooks.mjs` | Copies this registration into the user settings, silently. |
| `user-prompt-submit.js` | UserPromptSubmit | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` | Spawns the advisor build and relays its JSON. |
| `spec-gate-classify.mjs` | UserPromptSubmit | `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | Records the prompt's gate state, with no output on the turn. |
| `handover-context-nudge.mjs` | UserPromptSubmit, PostToolUse | `.skilled/hooks/session-handover/claude/handover-context-nudge.mjs` | Adds the handoff text when the context window fills. |
| `dispatch-preflight-lint.mjs` | PreToolUse Bash | `.skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs` | Denies a dispatch command that breaks a skill's hard rules. |
| `spec-gate-enforce.mjs` | PreToolUse Bash, Write, Edit | `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Delivers the saved gate question on the first mutation. |
| `git-preflight-advisory.mjs` | PreToolUse Bash | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Adds the git rule that applies to the typed command. |
| `git-message-gate.mjs` | PreToolUse Bash | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Denies a commit message, a PR body or a new branch name that breaks the contract. |
| `handover-subagent-guard.mjs` | PreToolUse Bash, AskUserQuestion | `.skilled/hooks/session-handover/claude/handover-subagent-guard.mjs` | Denies a handover command from a subagent and a question over a pending handoff. |
| `task-dispatch-guard.cjs` | PreToolUse Task | `.skilled/hooks/subagent-dispatch-guard/claude/task-dispatch-guard.cjs` | Denies a dispatch whose mode does not match the loop. |
| `fable-subagent-guard.mjs` | PreToolUse Task, Agent | `.skilled/hooks/subagent-dispatch-guard/claude/fable-subagent-guard.mjs` | Denies a subagent launch that would inherit the guarded parent model. |
| `mcp-route-guard.cjs` | PreToolUse `mcp__claude_ai_.*` | `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` | Adds a routing advisory and never a decision. |
| `overlay-guard.cjs` | PreToolUse Write, Edit, MultiEdit | `.skilled/hooks/overlay-guard/claude/overlay-guard.cjs` | Denies a write to a file an overlay owns, and names the overlay to edit. |
| `env-secret-guard.cjs` | PreToolUse Read, Write, Edit, MultiEdit, NotebookEdit, Grep, Bash | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs` | Denies a call that would print or change a guarded dotenv value. |
| `post-edit-quality.cjs` | PostToolUse Write, Edit | `.skilled/hooks/post-edit-quality/claude/post-edit-quality.cjs` | Adds the quality warning for the edited file. |
| `dispatch-audit-posttooluse.mjs` | PostToolUse Bash | `.skilled/hooks/cli-dispatch/claude/dispatch-audit-posttooluse.mjs` | Appends a redacted audit line for a completed dispatch. |
| `classifier-injection-screen-posttooluse.mjs` | PostToolUse WebFetch | `.skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs` | Adds a warning when fetched text carries instructions. |
| `decision-capture-posttooluse.mjs` | PostToolUse AskUserQuestion | `.skilled/hooks/decision-capture/claude/decision-capture-posttooluse.mjs` | Queues the answered question for the capture log. |
| `env-secret-guard-after.cjs` | PostToolUse Bash | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard-after.cjs` | Runs the after-call branch of the guard, undoing a dotenv write and reporting a leaked value. |
| `session-stop.js` | Stop | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` | Stores the token snapshot and updates session state. |
| `completion-evidence-stop.cjs` | Stop | `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | Advises when a completion claim carries no packet evidence. |
| `handover-stop-arm.mjs` | Stop | `.skilled/hooks/session-handover/claude/handover-stop-arm.mjs` | Arms the relaunch and writes the operator notice. |
| `ask-surface-stop.cjs` | Stop | `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs` | Blocks the turn when a question belongs in the question tool. |
| `session-cleanup.sh` | SessionEnd | `.skilled/scripts/session-cleanup.sh` | Ends the MCP helper processes this session owns. |
| `compact-inject.js` | PreCompact | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js` | Precomputes the context to carry across the compaction. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An adapter imports its own tree's `lib/` and `shared/` helpers by relative path. A link changes nothing here, because Node resolves the module to its real path before it loads a relative import. |
| Ownership | The core owns the policy. The adapter reads the payload, calls the core and writes the runtime's envelope. A rule change belongs in the core, not in the link or the adapter. |
| Failure | A payload the adapter cannot read or an error inside the core approves the call. `git-message-gate` is the exception: when the sk-git rulebook exists but cannot be read, it refuses the command. A failure before the adapter reaches its own handler exits non-zero, and most registrations carry a fallback that prints an `mk-hook-drift` line and an advisory. `git-primary-reconcile.sh` is the exception, because it runs detached with its output discarded. |

Nine entries can refuse a call instead of approving. They are `dispatch-preflight-lint.mjs`, `spec-gate-enforce.mjs`, `git-message-gate.mjs`, `handover-subagent-guard.mjs`, `task-dispatch-guard.cjs`, `fable-subagent-guard.mjs`, `overlay-guard.cjs`, `env-secret-guard.cjs` and `ask-surface-stop.cjs`. The first eight return a PreToolUse denial. `ask-surface-stop.cjs` returns a Stop block. The entry map says what each one refuses.

Two entries look like guards and are not. `mcp-route-guard.cjs` never emits a permission decision. `completion-evidence-stop.cjs` never emits a block. A session that sees neither is working as designed.

---

## 5. CONFIGURATION

The adapters read their switches through [the hook flags](../../.skilled/hooks/shared/hook-flags.cjs). `env-secret-guard` is the exception: its core reads `SYSTEM_ENV_SECRET_GUARD_DISABLED` and `SYSTEM_HOOKS_DISABLED` from the environment only, so neither switch reaches it from `hook-flags.env`. One master switch covers every concern but `git-message-gate`, which has no switch, and each concern also reads its own name.

| Switch | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Turns every hook concern off except `git-message-gate`. |
| `SYSTEM_<CONCERN>_DISABLED=1` | Turns one concern off, for example `SYSTEM_SESSION_HANDOVER_DISABLED`. The rows below name the concerns that read another name. |
| `MCP_ROUTE_GUARD_DISABLED=1` | Turns the MCP route guard off. Its `SYSTEM_` spelling changes nothing. |
| `SK_GIT_PREFLIGHT_DISABLED=1` | Turns the git preflight advisory off. Its `SYSTEM_` spelling changes nothing. |
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | Turns the post-edit quality check off. Its `SYSTEM_` spelling changes nothing. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Turns the dispatch audit off. `SYSTEM_DISPATCH_DISABLED` does the same and also turns off `dispatch-preflight-lint.mjs`. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Lets the spec gate deny instead of advise. `settings.json` sets it to `0`, so the gate here advises only. |
| `SPECKIT_USER_PROMPT_TARGET=<absolute path>` | Sends the prompt shim to a different advisor build. |
| `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=<ms>` | Caps the advisor child the prompt shim spawns. |

A concern whose flag file cannot be read stays on. A missing flag is a working hook, and silence is how an operator turns one off.

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .claude/hooks/README.md
```

Expected: `✅ VALID` with zero issues, exit 0.

```bash
find .claude/hooks -maxdepth 1 -type l | wc -l
```

Expected: `33`. That is the number of links in the folder.

```bash
grep -oE '(node|bash|python3) \.skilled/[^ ]+' .claude/settings.json | sort -u | wc -l
```

Expected: `33`. The two numbers agree when every link has a registration and every registration has a link.

```bash
find .claude/hooks -maxdepth 1 -type l ! -exec test -e {} \; -print
```

Expected: no output, exit 0. A printed name is a link whose target is gone.

---

## 7. RELATED

- [`../settings.json`](../settings.json): the file that registers every entry as a real path.
- [`../../.skilled/hooks/README.md`](../../.skilled/hooks/README.md): the guard cores, the concern behind each one and the coverage matrix.
- [`../../.skilled/hooks/injection-contract.md`](../../.skilled/hooks/injection-contract.md): what each hook adds to a session and whether a human sees it.
- [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): the same kind of index for Codex.
