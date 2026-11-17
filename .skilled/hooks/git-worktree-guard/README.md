---
title: "Git Worktree Guard: Warns on a Shared Checkout"
description: "Warns when Claude, Codex, Cursor, Devin, OpenCode, Pi, DSH or Vibe starts on the shared checkout."
trigger_phrases:
  - "worktree guard hook"
  - "worktree safety"
  - "shared checkout warning"
  - "claude worktree guard"
  - "sessionstart isolation guard"
  - "codex worktree guard"
  - "cursor worktree guard"
  - "devin worktree guard"
importance_tier: "normal"
contextType: "reference"
---

# Git Worktree Guard: Warns on a Shared Checkout

---

## 1. OVERVIEW

`git-worktree-guard/` warns when a top-level session starts in the shared checkout. Its shared shell script lives at `.skilled/bin/worktree-guard.sh`.

Claude, Codex, Cursor and Devin register `.skilled/bin/worktree-guard.sh` directly, and this folder holds a symlink to it for each of them. OpenCode, Pi, DSH and Vibe call the script through their session-start adapters. The concern key is `git-worktree-guard`. Its concern switch is `SYSTEM_GIT_WORKTREE_GUARD_DISABLED`. `SYSTEM_HOOKS_DISABLED=1` turns off concerns that use the shared resolver.

---

## 2. HOW IT WORKS

The script checks `SPECKIT_WORKTREE_GUARD=off` first and returns without output when set. Inside a repository, it loads `.skilled/hooks/shared/hook-flags.sh`. It checks the legacy alias `SYSTEM_WORKTREE_GUARD_DISABLED` before it calls `hook_enabled git-worktree-guard`. The resolver also checks the master switch and the concern switch. A child with `AI_SESSION_CHILD=1` exits before the sweep or warning.

The script calls `__guard_sweep_numbered()` before checking the worktree. It starts `worktree-reaper.sh --numbered` in the background and writes a stamp under the shared git directory. The stamp limits starts to one per six hours. `SPECKIT_WORKTREE_AUTOREAP=0` skips the sweep while the guard still checks the checkout.

The guard compares `git-dir` with `git-common-dir`. A missing git directory returns quietly. If the paths differ, the checkout is a linked worktree and the guard exits without a warning. Otherwise, it writes the current branch warning to stderr and exits 0.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart` | `claude/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | Guard warning on stderr when the checkout is shared. |
| Codex | `SessionStart` | `codex/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | Guard warning on stderr when the checkout is shared. |
| Cursor | `sessionStart` | `cursor/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | Guard warning on stderr when the checkout is shared. |
| Devin | `SessionStart` | `devin/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | Guard warning on stderr when the checkout is shared. |
| OpenCode | `session.created` | `.opencode/plugins/session-cleanup.js` | `.opencode/plugins/session-cleanup.js` | Startup warning in system context. |
| Pi | `session_start` | `.pi/extensions/session-start-advisories.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Warning notification when the script writes output. |
| DSH | `agent/created` with source `startup` | `.dsh/plugins/repo-guards/adapters/session-start-advisories.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Injected notice with the guard warning. |
| Vibe | `session_start` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Warning in additional context. |

The registry records id `worktree-guard`. Claude fires `SessionStart`. Its registry matcher is `""` and its timeout is 3 seconds. Codex fires `SessionStart`. Its registry matcher is `null` and its timeout is 3 seconds. Cursor fires `sessionStart`. Its registry matcher is `null` and its timeout is 10 seconds. Devin fires `SessionStart`. Its registry matcher is `""` and its timeout is 3 seconds.

The generated registrations are in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`. OpenCode loads its `.opencode/plugins/*.js` glob. The `session-cleanup.js` plugin runs the guard on `session.created` and adds its output to system context.

The registry's Pi extension entry is `session-start-advisories.ts`. Pi loads entries from `.pi/extensions/`, where `session-start-advisories.ts` re-exports the adapter in `.skilled/skills/system-spec-kit/runtime/hooks/pi/`. The DSH guards patch loads `.dsh/plugins/repo-guards/index.mjs`, which registers adapter links such as `session-start-advisories.mjs`. Vibe registers `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` for `session_start` in `.vibe/hooks.toml`. That adapter gets guard warnings from `.vibe/plugins/repo-guards/session-cleanup.mjs`.

When the shared checkout check fires, the shell script writes one warning line to stderr and exits 0. Claude and Codex return an `additionalContext` drift notice if their command fails. Cursor returns `permission: "allow"` with an `agent_message`. Devin has no fallback. Pi shows a returned warning as a notification and stays silent when `ctx.exec` throws. DSH injects the output of a check that exits nonzero and logs a check that throws, then continues. OpenCode logs child-process failures and keeps the session boundary. Vibe catches a failed context part and keeps the others.

---

## 4. DIRECTORY TREE

```text
git-worktree-guard/
+-- README.md
+-- claude/
|   `-- worktree-guard.sh -> ../../../bin/worktree-guard.sh
+-- codex/
|   `-- worktree-guard.sh -> ../../../bin/worktree-guard.sh
+-- cursor/
|   `-- worktree-guard.sh -> ../../../bin/worktree-guard.sh
`-- devin/
    `-- worktree-guard.sh -> ../../../bin/worktree-guard.sh
```

Each runtime folder links to the shared script in `.skilled/bin/`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/worktree-guard.sh` | Reads the switches and checks the checkout. Starts the numbered sweep when enabled. |
| `.skilled/hooks/shared/hook-flags.sh` | Resolves the master and concern switches. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Defines the guard id and runtime bindings. Its `pi` field names the extension entry. |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Hold the generated shell-hook entries for Claude, Codex, Cursor and Devin. |
| `.opencode/plugins/session-cleanup.js` | Runs the guard for OpenCode and adds its output to system context. |
| `.pi/extensions/session-start-advisories.ts` | Re-exports the Pi adapter from the system-spec-kit runtime hooks folder. |
| `.dsh/plugins/repo-guards/index.mjs` | Loads the DSH adapter links through the guard bundle. |
| `.vibe/hooks.toml` and `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Register and compose Vibe session-start context. |
| `.skilled/bin/worktree-session.sh` and `.skilled/bin/worktree-reaper.sh` | The launcher named by the warning and the numbered sweep it starts. |

---

## 6. CONFIGURATION

Set the shared-resolver switches in the environment or in `.skilled/hooks/hook-flags.env`. The script reads `SPECKIT_WORKTREE_GUARD`, `AI_SESSION_CHILD` and `SPECKIT_WORKTREE_AUTOREAP` from the environment only. Environment values win over the config file. The shared resolver treats `1`, `true`, `yes` and `on` as on, without regard to case. The caller-side `SPECKIT_WORKTREE_GUARD` setting must equal `off` exactly.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_GIT_WORKTREE_GUARD_DISABLED=1` | `git-worktree-guard` | Disables the guard and its sweep. |
| `SYSTEM_WORKTREE_GUARD_DISABLED=1` | `git-worktree-guard` | Legacy alias that disables the guard and its sweep. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off hooks that use the shared resolver. |
| `MK_HOOKS_DISABLED=1` | Every concern | Legacy master switch alias. |
| `SPECKIT_WORKTREE_GUARD=off` | Caller opt-out | Returns immediately without output. |
| `SPECKIT_WORKTREE_AUTOREAP=0` | Numbered sweep | Skips the sweep while the guard still warns. |
| `AI_SESSION_CHILD=1` | Child sessions | Exits before the sweep and warning. |

---

## 7. VALIDATION

Run from the repository root.

```bash
bash -n .skilled/bin/worktree-guard.sh
```

Expected result: no output and exit status 0.

```bash
SPECKIT_WORKTREE_GUARD=off bash .skilled/bin/worktree-guard.sh
```

Expected result: no output and exit status 0.

---

## 8. RELATED

- [hooks index](../README.md): coverage matrix and switch list.
- [shared hook flags](../shared/README.md): resolver behavior and switch precedence.
- [worktree session launcher](../../bin/worktree-session.sh): starts a runtime in an isolated worktree.
- [numbered worktree reaper](../../bin/worktree-reaper.sh): the sweep started by the guard.
