---
title: "Loop Lock"
description: "loop-lock.cjs wraps the runtime acquireLoopLock/refreshLoopLock/releaseLoopLock helpers to provide single-writer advisory locking for the context loop. Auto and confirm YAMLs invoke it at step_acquire_lock and step_release_lock."
trigger_phrases:
  - "loop lock"
  - "acquireLoopLock"
  - "releaseLoopLock"
  - "refreshLoopLock"
  - "loop-lock.cjs"
  - "advisory lock"
  - "stale lock reclaim"
  - "step_acquire_lock"
  - "step_release_lock"
---

# Loop Lock

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Provides best-effort single-writer advisory locking for the context loop: a second session targeting the same spec folder should find the lock held and fail closed at acquire. It is advisory, not a hard mutex — the host-driven loop runs as discrete `node` invocations rather than one long-lived process, so the owner PID is short-lived and a later run can reclaim a lock that stale-detection judges dead. The lock is acquired at the start of the YAML workflow and released on every exit path (synthesis, halt, cancel, workflow-exit).

`loop-lock.cjs` is a thin host-facing CLI wrapper over the runtime `loop-lock.ts` helper, loaded in-process via the tsx CJS register. The runtime provides stale-lock detection (owner-PID check + TTL), atomic lock writes, and clean owner-scoped release. It also exposes `refreshLoopLock` for heartbeat renewal, but the context loop does not call it per-iteration, so staleness is governed by the TTL rather than an active heartbeat.

---

## 2. HOW IT WORKS

### CLI Contract

`loop-lock.cjs <action> --lock <path> [--packet <id>] [--owner <int>] [--ttl <ms>] [--runtime <kind>]`

| Action | Exits | Emits |
|---|---|---|
| `acquire` | 0 (acquired) or 1 (held by another) | `{ action, acquired, lock?, reclaimed?, holder? }` |
| `refresh` | 0 | `{ action, refreshed: bool }` |
| `release` | 0 | `{ action, released: bool }` |

### Stale Lock Reclaim

`acquireLoopLock` reads any existing lock file and calls `isStaleLoopLock`: a lock is stale when the owner PID no longer exists (`kill(pid, 0)` → ESRCH) or when the last heartbeat is more than `2 × ttlMs` milliseconds old. Stale locks are reclaimed atomically (temp+rename) and the reclaimed data is returned for auditing.

### YAML Integration

Both `deep_context_auto.yaml` and `deep_context_confirm.yaml` invoke `loop-lock.cjs`:

- **`step_acquire_lock`** (phase_init) — `acquire` action; exits 1 on a live conflicting lock, halting the workflow.
- **`step_release_lock`** (phase_synthesis, after synthesis completes) — `release` action; idempotent even if already released.
- Lock release is also wired into the halt, cancel, and completed-session exit paths in both YAMLs.

### macOS Advisory Note

The lock is a JSON file-based advisory lock, not a kernel fcntl lock. macOS/BSD locking is advisory: stale-lock override requires confirm-only or explicit recovery. The note appears in the YAML `step_acquire_lock` field.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/scripts/loop-lock.cjs` | Script | CLI wrapper: `acquire`, `refresh`, `release` actions; loads `loop-lock.ts` via tsx CJS register |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Shared | `acquireLoopLock`, `refreshLoopLock`, `releaseLoopLock`, `isStaleLoopLock`, `processAlive`; `LoopLockData` type; `LoopLockHeldError` |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_acquire_lock` / `step_release_lock` invocations with `loop-lock.cjs` |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | Workflow | `step_acquire_lock` / `step_release_lock` invocations with `loop-lock.cjs` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/07--runtime-robustness/loop-lock.md` | Manual playbook | Verifies `loop-lock.cjs` syntax; confirms `step_acquire_lock`/`step_release_lock` references exist in both YAML files |

---

## 4. SOURCE METADATA

- Group: Runtime Robustness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--runtime-robustness/loop-lock.md`

Related references:
- [frontier-initialization.md](../01--frontier-seeding/frontier-initialization.md) — `phase_init` within which `step_acquire_lock` runs
- [atomic-state.md](atomic-state.md) — atomic file writes used internally by `writeLoopLockAtomic` in the runtime
