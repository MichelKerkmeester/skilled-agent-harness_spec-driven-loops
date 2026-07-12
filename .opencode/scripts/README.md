---
title: "Repository Scripts"
description: "Developer and operator reference for repository maintenance scripts, Git hooks, session cleanup and scheduled orphan-process checks."
trigger_phrases:
  - "repository scripts"
  - "git hook scripts"
  - "session cleanup scripts"
importance_tier: "important"
---

# Repository Scripts

> Repository-level maintenance scripts for local development, runtime cleanup and Git workflow automation.

---

## 1. OVERVIEW

`.opencode/scripts/` owns repository-wide shell scripts that support local operators and automated workflows.

The folder covers four areas:

- Session-scoped MCP helper cleanup
- Orphan MCP process review and cleanup
- Repository Git hook installation and execution
- Skill Advisor distribution data copying

Review script options and mutation boundaries before running cleanup tools in live mode.

---

## 2. DIRECTORY TREE

```text
.opencode/scripts/
+-- claude-session-cleanup.sh
+-- copy-skill-advisor-dist-data.sh
+-- git-hooks/
|   +-- README.md
|   +-- commit-msg
|   +-- post-commit
|   +-- post-merge
|   +-- post-rewrite
|   +-- lib/
|   |   +-- README.md
|   |   +-- autostash-orphan-guard.sh
|   |   `-- memory-drift-marker.sh
|   `-- tests/
|       +-- README.md
|       +-- install-git-hooks-worktree-harness.sh
|       +-- memory-drift-marker-lock-harness.sh
|       `-- post-commit-code-graph-invalidation.sh
+-- install-git-hooks.sh
+-- launchagents/
|   +-- README.md
|   `-- com.michelkerkmeester.orphan-sweep.plist
+-- orphan-mcp-sweeper.sh
+-- session-cleanup.sh
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `session-cleanup.sh` | Cleans up MCP helper descendants associated with the current session. |
| `claude-session-cleanup.sh` | Preserves the former Claude-specific entrypoint as a compatibility shim. |
| `orphan-mcp-sweeper.sh` | Finds stale MCP helpers and temporary dispatch artifacts, with dry-run support. |
| `copy-skill-advisor-dist-data.sh` | Copies required Skill Advisor data into compiled distribution output. |
| `install-git-hooks.sh` | Installs the repository-managed hooks into the active Git hooks directory. |
| `git-hooks/` | Contains hook entrypoints, shared hook helpers and test harnesses. |
| `launchagents/` | Contains the macOS LaunchAgent template for scheduled orphan-process checks. |

---

## 4. CLEANUP FLOW

The session cleanup path uses the current session identity when one is available:

```text
Stop hook
   |
   v
session-cleanup.sh
   |
   +-- session PID available --> inspect descendants --> terminate matching MCP helpers
   |
   `-- no session PID --> optional orphan-sweeper fallback
```

`SPECKIT_STOP_HOOK_ORPHAN_SWEEP` controls the fallback:

| Value | Behavior |
|---|---|
| `off` | Skip the global fallback. This is the default. |
| `dry-run`, `dryrun` or `dry` | Report the orphan-sweeper decisions without mutation. |
| `1`, `on` or `live` | Run the orphan sweeper in live mode. |

Run the orphan sweeper in dry-run mode before enabling any live cleanup path:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh \
  --dry-run \
  --verbose \
  --log-path /tmp/orphan-sweeper-review.log
```

---

## 5. GIT HOOK FLOW

`install-git-hooks.sh` installs the managed hooks from `git-hooks/` into the active repository hook directory.

The hooks delegate shared behavior to scripts under `git-hooks/lib/`. Test harnesses under `git-hooks/tests/` cover worktree installation, memory drift locking and code-graph invalidation.

Read the folder-level documentation before changing hook behavior:

- [`git-hooks/README.md`](./git-hooks/README.md)
- [`git-hooks/lib/README.md`](./git-hooks/lib/README.md)
- [`git-hooks/tests/README.md`](./git-hooks/tests/README.md)

---

## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Cleanup scope | Prefer session-scoped cleanup over global process selection. |
| Live orphan sweep | Review dry-run output before enabling process termination or file removal. |
| LaunchAgent template | Keep the repository template in dry-run mode. Apply machine-specific live settings only to an installed copy. |
| Git hooks | Change hook behavior in `git-hooks/` and use `install-git-hooks.sh` for installation. |
| Distribution data | Use `copy-skill-advisor-dist-data.sh` instead of copying generated data by hand. |

---

## 7. VALIDATION

Run syntax checks from the repository root:

```bash
bash -n .opencode/scripts/claude-session-cleanup.sh
bash -n .opencode/scripts/copy-skill-advisor-dist-data.sh
bash -n .opencode/scripts/install-git-hooks.sh
bash -n .opencode/scripts/orphan-mcp-sweeper.sh
bash -n .opencode/scripts/session-cleanup.sh
plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist
```

Run cleanup review mode without changing processes or temporary files:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh \
  --dry-run \
  --verbose \
  --log-path /tmp/orphan-sweeper-review.log
```

Expected result: shell syntax checks pass, the plist passes validation and the dry run reports decisions without applying them.

---

## 8. RELATED

- [`git-hooks/README.md`](./git-hooks/README.md)
- [`git-hooks/lib/README.md`](./git-hooks/lib/README.md)
- [`git-hooks/tests/README.md`](./git-hooks/tests/README.md)
- [`launchagents/README.md`](./launchagents/README.md)
- [Spec Kit MCP environment reference](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md)
- [Spec Kit MCP runtime README](../skills/system-spec-kit/mcp_server/README.md)
