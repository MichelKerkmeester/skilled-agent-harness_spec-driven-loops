---
title: "Worktree Guard Hook: Git Worktree Safety"
description: "SessionStart guard that warns when a top-level AI session is running on the shared checkout instead of an isolated worktree, across Claude, Codex, Cursor, and Devin."
trigger_phrases:
  - "worktree guard hook"
  - "worktree safety"
  - "shared checkout warning"
importance_tier: "reference"
contextType: "reference"
---

# Worktree Guard Hook: Git Worktree Safety

---

## 1. OVERVIEW

`git-worktree-guard/` is the index for the SessionStart guard that warns when a top-level AI session is running directly on the shared checkout instead of an isolated worktree. Concurrent AI sessions on one shared working tree can collide — shared working files and shared MCP databases — so the repo's model is one worktree per session. This guard detects the off-model state and surfaces a one-line warning naming the branch and the isolation command, so the operator knows to launch the next session through `worktree-session.sh`.

It is the detect-and-warn companion to `worktree-session.sh`. A SessionStart hook cannot relocate an already-started process into a worktree, but it can warn. It is intentionally non-fatal: it prints one line to stderr and always exits 0, so it never blocks a session the operator chose to run there.

One real script backs all four editor runtimes; the per-runtime entries are relative symlinks into `.opencode/bin/`.

---

## 2. WHAT IT DOES

On each SessionStart, `worktree-guard.sh`:

1. Checks the caller-side silence switch (`SPECKIT_WORKTREE_GUARD=off`) and the shared kill-switch (the legacy `SYSTEM_WORKTREE_GUARD_DISABLED` alias, then `hook_enabled git-worktree-guard`; fail-open if the resolver is absent). Either disabled → exit 0.
2. Skips orchestrated children (`AI_SESSION_CHILD=1`) — they are expected to share the parent's tree, so they never warn.
3. Resolves `git-dir` and `git-common-dir`. Not a git repo → exit 0. Inside a linked worktree (`git-dir != git-common-dir`) → already isolated, exit 0 with no warning.
4. Otherwise prints one warning line to stderr:

   ```text
   [worktree-guard] This top-level session is running on the shared '<branch>' checkout, not an isolated worktree. Concurrent AI sessions here can collide (shared working tree + MCP databases). To isolate next time, launch via: bash .opencode/bin/worktree-session.sh <runtime>. (silence: SPECKIT_WORKTREE_GUARD=off)
   ```

It always exits 0.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/worktree-guard.sh` (symlink → `../../../bin/worktree-guard.sh`) | SessionStart hook chain (`bash /abs/path/.opencode/bin/worktree-guard.sh`) | One stderr warning line on the shared checkout; always exits 0 |
| **Codex** | `codex/worktree-guard.sh` (symlink) | SessionStart hook chain | One stderr warning line |
| **Cursor** | `cursor/worktree-guard.sh` (symlink) | SessionStart hook chain | One stderr warning line |
| **Devin** | `devin/worktree-guard.sh` (symlink) | SessionStart hook chain | One stderr warning line |
| **OpenCode** | — | — | Not applicable. OpenCode session guards run inside the owning `mk-*` plugins; this check is wired into the editor runtimes' SessionStart chains. |
| **Pi** | — | — | Not applicable. |

One real file backs all four runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

---

## 4. DIRECTORY TREE

```text
git-worktree-guard/
+-- README.md
+-- claude/   worktree-guard.sh (symlink -> ../../../bin/worktree-guard.sh)
+-- codex/    worktree-guard.sh (symlink)
+-- cursor/   worktree-guard.sh (symlink)
`-- devin/    worktree-guard.sh (symlink)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/bin/worktree-guard.sh` | The guard. Checks the silence switch and shared kill-switch, skips orchestrated children, detects a shared vs isolated checkout via `git-dir` / `git-common-dir`, and warns on stderr. Always exits 0. |
| `.opencode/bin/worktree-session.sh` | The companion launcher the warning names as the fix (launches a runtime inside an isolated worktree). Not in this folder. |
| `.opencode/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver (`hook_enabled git-worktree-guard`, plus the legacy `SYSTEM_WORKTREE_GUARD_DISABLED` alias). Sourced fail-open if absent. |

---

## 6. CONFIGURATION

The guard is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_GIT_WORKTREE_GUARD_DISABLED=1` | Canonical kill-switch. The shared resolver (`hook_enabled git-worktree-guard`) short-circuits to exit 0. |
| `SYSTEM_WORKTREE_GUARD_DISABLED=1` | Legacy alias (pre-rename). Honored as a backward-compatible disable for this concern. |
| `SPECKIT_WORKTREE_GUARD=off` | Caller-side alias. Checked first, before the shared resolver; silences the guard for one invocation or session. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `AI_SESSION_CHILD=1` | Not a kill-switch, but an exemption: orchestrated children share the parent's tree and are never warned. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory | Warns on stderr; never blocks git or a session. Always exits 0. |
| Scope | Warns only for a top-level session on the shared checkout. A linked worktree is already isolated (no warning); an orchestrated child is expected to share the parent's tree (no warning). |
| Fail-open | Not a git repo, or absent shared resolver → exit 0 with no warning. |
| Imports | Bash only; sources the shared `hook-flags.sh` fail-open. Nothing outside the repo. |
| Real code | Stays in `.opencode/bin/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
bash .opencode/bin/worktree-guard.sh; echo "exit: $?"
```

Expected result: `exit: 0`, with a `[worktree-guard] ...` warning line on stderr when run on the shared main checkout, or no output when run inside a linked worktree.

```bash
SPECKIT_WORKTREE_GUARD=off bash .opencode/bin/worktree-guard.sh; echo "exit: $?"
```

Expected result: `exit: 0`, no output (caller-side silence switch short-circuits).

```bash
AI_SESSION_CHILD=1 bash .opencode/bin/worktree-guard.sh; echo "exit: $?"
```

Expected result: `exit: 0`, no output (orchestrated-child exemption).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../../skills/sk-git/`](../../skills/sk-git/): the git workflow skill that owns worktree policy.
- [`../../bin/worktree-session.sh`](../../bin/worktree-session.sh): the companion launcher the warning names as the fix.
