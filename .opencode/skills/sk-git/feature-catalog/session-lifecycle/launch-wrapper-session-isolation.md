---
title: "Launch-wrapper session isolation"
description: "Operator-opted-in launch wrapper that gives every top-level AI session its own worktree, branch, and isolated MCP databases."
trigger_phrases:
  - "launch-wrapper session isolation"
  - "worktree-session.sh"
  - "per-session isolated MCP databases"
  - "top-level session worktree wrapper"
importance_tier: "important"
version: 1.0.0.0
---

# Launch-wrapper session isolation (worktree-session.sh)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

An operator opts into per-session isolation at the shell, not inside a running AI session — for example by aliasing `claude='bash .opencode/bin/worktree-session.sh claude'`. Because the wrapper acts before the AI session starts, at operator opt-in, it does not violate the in-session rule that an AI must never autonomously create a worktree; the operator made that choice by aliasing the launch.

Each top-level (human-launched) session gets its own worktree, its own branch, and its own isolated MCP databases, so concurrent sessions on different runtimes never share a working tree or contend on a single-writer database lease. An orchestrated child (subagent, dispatched task, deep-loop iteration) shares its parent's worktree instead of nesting.

---

## 2. HOW IT WORKS

### Child Detection

The wrapper execs in place — no new worktree — whenever either signal is present: `AI_SESSION_CHILD=1` in the environment (set at dispatch sites for orchestrated children), or a structural backstop that the process is already inside a linked git worktree (`git --git-dir` differs from `--git-common-dir`). An unknown or ambiguous signal defaults to top-level isolation, the safe failure mode. A child session also has `MK_SPEC_GATE_ENFORCE=0` neutralized on its way in, as a belt-and-suspenders backstop for the case where a dispatched child has no user turn available to answer a spec-gate question.

### Worktree Allocation and Basing

A top-level session gets a short unique slug (`epoch-pid`), a numbered ephemeral directory `.worktrees/<runtime>-<slug>`, and a `work/<runtime>/<slug>` branch — a separate, machine-owned lane from the owner-first task-worktree grammar, intentionally not numbered or owner-scoped. The session worktree is based on whatever branch the primary checkout currently has open (the "live branch"); when the primary checkout is on a detached HEAD, the wrapper falls back to basing on `HEAD` and skips autosync wiring for that session.

### Dependency Sharing and DB Isolation

Shared build artifacts (`node_modules`, compiled `dist` output) are symlinked from the main checkout into the new worktree rather than reinstalled, so session startup stays fast. Each worktree still gets its own MCP databases via `SPEC_KIT_DB_DIR` and `SPECKIT_CODE_GRAPH_DB_DIR`, and its own short per-session socket directory under `$HOME` (rather than nested inside the worktree) to stay under the platform's unix-domain-socket path-length limit.

### Session Marker and Continuous-Integration Wiring

A PID-stamped marker file is written under the shared common git directory (never inside the worktree, so it cannot dirty the tree) before the session's runtime is exec'd; the reaper later reads this marker to prove a wrapper session is truly finished rather than merely idle. When a live branch was resolved, the wrapper also exports `SPECKIT_LIVE_BRANCH` and `SPECKIT_AUTOSYNC` so the session's commits publish automatically — see the continuous-integration autosync feature. A `--dry-run` flag previews the full allocation plan (paths, branch, DB dirs, socket-length check) without creating anything.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/worktree-session.sh` | Script | Child detection, worktree allocation, dependency symlinking, DB/socket isolation, session-marker write, continuous-integration env wiring |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/bin/tests/worktree-session.test.sh` | Automated test | Exercises child detection, allocation, and dry-run behavior |

---

## 4. SOURCE METADATA

- Group: Session Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session_lifecycle/launch_wrapper_session_isolation.md`

Related references:
- [worktree_reaper.md](worktree-reaper.md) — Worktree reaper
- [continuous_integration_autosync.md](continuous-integration-autosync.md) — Continuous integration autosync
