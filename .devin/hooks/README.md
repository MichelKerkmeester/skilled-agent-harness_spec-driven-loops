---
title: "Devin Hooks: Links to the Shared Hook Cores"
description: "One symlink per Devin hook entry, with the real path that .devin/hooks.v1.json runs and what each adapter adds to a session."
trigger_phrases:
  - "devin hooks"
  - "devin hook mirror"
  - "devin hooks folder"
---

# Devin Hooks: Links to the Shared Hook Cores

---

## 1. OVERVIEW

`.devin/hooks/` is an index of the hooks a Devin session runs in this repository. Devin finds each one by reading its own config file, [`.devin/hooks.v1.json`](../hooks.v1.json). Every command in that file names a real path under `.skilled/`. Nothing in this folder runs. A broken link costs you a lookup and costs the session nothing.

The folder holds 29 links, one per entry. Twelve point into `.skilled/hooks/`, where a thin adapter reads the payload and hands the decision to a runtime-neutral core. Eleven point into an owning skill. The last six are whole programs under `.skilled/bin/` or `.skilled/scripts/`. `check-dist-staleness.sh` is Python despite the suffix.

Of the eleven, eight are spec-kit runtime hooks and two are `sk-git` hook scripts. The remaining one is the sk-code dist-staleness check. Three links land on compiled output in `runtime/dist/`, which the spec-kit package builds from the `.ts` sources in `.skilled/skills/system-spec-kit/runtime/hooks/devin/`.

One link needs a word of its own. `env-secret-guard-after.cjs` is a one-line re-export of the guard next to it, because the Codex installer identifies a hook by its script path and one file cannot sit on two events.

Every entry but `git-message-gate` and `permission-request-policy.mjs` approves when it cannot judge. Seven can refuse a call. Section 4 names them.

A compiled entry also runs when something launches it through its link. The runtime's `isMainModule` helper resolves the launch path and the module URL through every symlink before it compares them.

---

## 2. ARCHITECTURE

```text
╭───────────────────────────────╮
│ Devin event                   │
╰───────────────┬───────────────╯
                ▼
┌───────────────────────────────┐
│ .devin/hooks.v1.json          │
│ bash -c ... node <real path>  │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ adapter under .skilled/       │
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

Dependency direction: `hooks.v1.json` ───▶ adapter ───▶ core.

The link in `.devin/hooks/` points at the same adapter. It sits beside that path, not on it, so a session that never opens the folder behaves the same.

The config is generated. `hook-registry.json` names each hook once with its per-runtime bindings. `sync-hook-registrations.cjs` renders `.devin/hooks.v1.json` from it. A hand edit shows up as drift in the check in section 6.

---

## 3. ENTRY MAP

One row per link. The Event column names the Devin event and matcher that carries the entry. The core column is the file the link resolves to, written from the repository root. Two entries carry two registrations each: `goal-inject.mjs` on two events and `spec-gate-enforce.mjs` on two PreToolUse matchers, so the 29 links carry 31 registrations. The Event column writes `exec` for a matcher of `^exec$`. Only the two env-secret matchers also carry `bash`, `run-command` and `run_command`.

| Entry | Event | Real file or core | Effect |
|---|---|---|---|
| `session-start.js` | SessionStart | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js` | Adds the session context brief to the turn. |
| `worktree-guard.sh` | SessionStart | `.skilled/bin/worktree-guard.sh` | Warns that a top-level session runs on the shared checkout. Starts the numbered worktree sweep. |
| `check-git-hooks.sh` | SessionStart | `.skilled/bin/check-git-hooks.sh` | Warns when a versioned git hook has no effective link. Installs the missing hooks from the main checkout when live sync is on. |
| `check-dist-staleness.sh` | SessionStart | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Warns when a compiled package is older than its source, scanning every package. |
| `install-codex-hooks.mjs` | SessionStart | `.skilled/bin/install-codex-hooks.mjs` | Runs its own `--check` in silence and prints a drift line when Codex hooks differ. |
| `goal-inject.mjs` | SessionStart, UserPromptSubmit | `.skilled/hooks/goal/devin/goal-inject.mjs` | Adds the bound packet goal brief, plus the resend reminder while the operator copy is behind. |
| `git-primary-reconcile.sh` | SessionStart | `.skilled/bin/git-primary-reconcile.sh` | Converges the primary checkout in the background with output discarded. |
| `git-live-follow.sh` | SessionStart | `.skilled/bin/git-live-follow.sh` | Starts one live-branch follower for this checkout. |
| `user-prompt-submit.js` | UserPromptSubmit | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js` | Adds the advisor's context on the turn. |
| `spec-gate-classify.mjs` | UserPromptSubmit | `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | Records the gate question for the session with no output on the prompt. |
| `dispatch-preflight-lint.mjs` | PreToolUse exec | `.skilled/hooks/cli-dispatch/devin/dispatch-preflight-lint.mjs` | Denies a dispatch that breaks a skill's hard rule. Warns on a lower-severity one. |
| `spec-gate-enforce.mjs` | PreToolUse exec, edit, write | `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Delivers the saved gate question on the first mutation. Denies when enforcement is on. |
| `git-preflight-advisory.mjs` | PreToolUse exec | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Adds the git rule that applies to the typed command. |
| `git-message-gate.mjs` | PreToolUse exec | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Denies a commit message, a PR body or a new branch name that breaks the contract. |
| `overlay-guard.cjs` | PreToolUse edit, write | `.skilled/hooks/overlay-guard/devin/overlay-guard.cjs` | Denies a write to a file an overlay owns and names the overlay to edit. |
| `task-dispatch-guard.cjs` | PreToolUse run_subagent | `.skilled/hooks/subagent-dispatch-guard/devin/task-dispatch-guard.cjs` | Denies a dispatch whose mode does not match the loop. |
| `mcp-route-guard.cjs` | PreToolUse `mcp__.*` | `.skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` | Adds a routing advisory and never a decision. |
| `env-secret-guard.cjs` | PreToolUse read, edit, write, grep, exec, multiedit, patch, apply_patch, apply-patch, bash, run-command, run_command | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs` | Denies a call that would print or change a guarded dotenv value. |
| `post-edit-quality.cjs` | PostToolUse edit, write | `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | Adds the quality warning for the edited file. |
| `dispatch-audit-posttooluse.mjs` | PostToolUse exec | `.skilled/hooks/cli-dispatch/devin/dispatch-audit-posttooluse.mjs` | Appends a redacted audit line for a completed dispatch. |
| `classifier-injection-screen-posttooluse.mjs` | PostToolUse webfetch | `.skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs` | Adds a warning when fetched text reads as instructions. |
| `decision-capture-posttooluse.mjs` | PostToolUse ask_user_question | `.skilled/hooks/decision-capture/devin/decision-capture-posttooluse.mjs` | Queues the answered question for the capture log. |
| `env-secret-guard-after.cjs` | PostToolUse exec | `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard-after.cjs` | Undoes a dotenv write and reports a dotenv value in the output. |
| `permission-request-policy.mjs` | PermissionRequest | `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | Approves an exempt write or a clean exec call. Everything else is denied. |
| `session-stop.js` | Stop | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js` | Stores the token snapshot and updates session state. |
| `completion-evidence-stop.cjs` | Stop | `.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | Reports a completion claim with no packet evidence on stderr. |
| `ask-surface-stop.cjs` | Stop | `.skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs` | Reports a question asked in prose on stderr. |
| `post-compaction.cjs` | PostCompaction | `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | Adds the spec-folder continuity after a compaction. |
| `session-cleanup.sh` | SessionEnd | `.skilled/scripts/session-cleanup.sh` | Ends the MCP helper processes this session owns. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An adapter imports its own tree's `lib/` and `shared/` helpers by relative path. A link changes nothing here, because Node resolves a module to its real path before it loads a relative import. |
| Ownership | The core owns the policy. The adapter reads the payload and writes Devin's envelope around the answer. A rule change belongs in the core, not in the link or the adapter. A new hook starts in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, because the config is rendered from it. |
| Failure | A payload an adapter cannot read, or an error inside its core, approves the call. The shell programs print a warning and exit 0 on the failures they can absorb. `git-live-follow.sh` exits 1 without git or outside a repository, and `session-cleanup.sh` exits 1 when a kill fails. |

Seven entries can refuse a call instead of approving. They are `dispatch-preflight-lint.mjs`, `spec-gate-enforce.mjs`, `git-message-gate.mjs`, `overlay-guard.cjs`, `env-secret-guard.cjs`, `task-dispatch-guard.cjs` and `permission-request-policy.mjs`. The first six return a PreToolUse denial. The last returns a PermissionRequest denial and fails closed, so a shape it does not cover is refused rather than allowed.

Three entries look like guards and are not. `mcp-route-guard.cjs` never emits a permission decision. `completion-evidence-stop.cjs` never emits a block. `ask-surface-stop.cjs` writes its advisory to stderr. The turn ends either way.

---

## 5. CONFIGURATION

The adapters read their switches through [the hook flags](../../.skilled/hooks/shared/hook-flags.cjs). A switch set in the environment wins over the same name in `hook-flags.env`, so you can persist a default and override it for one session. `env-secret-guard` is the exception: its core reads `SYSTEM_ENV_SECRET_GUARD_DISABLED` and `SYSTEM_HOOKS_DISABLED` from the environment only, so neither switch reaches it from `hook-flags.env`.

| Switch | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Turns every hook concern off except `git-message-gate`, which has no switch and still runs. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Lets the spec gate deny a mutation instead of advising. Unset means advise only. |
| `SPECKIT_WORKTREE_GUARD=off` | Silences the worktree warning and stops the worktree sweep. |
| `SPECKIT_GIT_HOOKS_GUARD=off` | Silences the missing-git-hook warning and its self-heal. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Stops the dispatch audit line. |
| `OPENCODE_GOAL_DISABLED=1` | Stops goal injection on both events. |

Every concern except `git-message-gate` also carries its own kill switch, such as `SYSTEM_TASK_DISPATCH_DISABLED` or `MCP_ROUTE_GUARD_DISABLED`. The flags module holds the full list of names. A concern whose flag file cannot be read stays on, so a missing flag never silences a hook you did not turn off.

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .devin/hooks/README.md
```

Expected: `✅ VALID`, `Total issues: 0` and exit 0.

```bash
find .devin/hooks -maxdepth 1 -type l | wc -l
```

Expected: `29`, the number of links in the folder.

```bash
find .devin/hooks -maxdepth 1 -type l ! -exec test -e {} \; -print
```

Expected: no output, exit 0. A printed name is a link whose target is gone.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

Expected: a `[hook-registration-sync] PASS` line and exit 0. Exit 1 means the config drifted from the registry.

---

## 7. RELATED

- [`../hooks.v1.json`](../hooks.v1.json): the file Devin runs, with one command per registration.
- [`../SYNC.md`](../SYNC.md): how `.devin/` derives from `.skilled/` and the commands that refresh it.
- [`../../.skilled/hooks/README.md`](../../.skilled/hooks/README.md): the guard cores, the concern behind each one and the coverage matrix.
- [`../../.skilled/hooks/injection-contract.md`](../../.skilled/hooks/injection-contract.md): what each hook adds to a session and whether a human sees it.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md): the same kind of index for Claude Code.
