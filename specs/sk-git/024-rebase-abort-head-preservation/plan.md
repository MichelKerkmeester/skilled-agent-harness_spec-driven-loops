---
title: "Implementation Plan: Rebase-Abort HEAD Preservation"
description: "Approach for refusing foreign-rebase aborts and restoring the pre-rebase HEAD in the two live-sync reconcilers."
trigger_phrases:
  - "rebase abort head preservation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/024-rebase-abort-head-preservation"
    last_updated_at: "2026-08-20T08:35:00Z"
    last_updated_by: "sk-git"
    recent_action: "Captured the refuse-foreign-rebase + restore-HEAD approach"
    next_safe_action: "Implement the two script edits and the fail-first test"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-plan"
      parent_session_id: null
---
# Implementation Plan: Rebase-Abort HEAD Preservation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | POSIX bash (git plumbing) |
| **Components** | `git-primary-reconcile.sh`, `git-sync.sh` |
| **Testing** | Hermetic bash test with throwaway git repos |
| **Runtime** | SessionStart reconcile + post-commit sync across the multi-repo |

### Overview

The bug is a single missing distinction: a failed `git rebase` is treated as "my rebase conflicted" when it can instead mean "a rebase is already in progress." The fix adds two guards, not a redesign — refuse a rebase we did not start, and never leave a detected rewind in place. `git-live-follow.sh` needs no change; it is fast-forward-only.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed from reflog + reconcile log evidence
- [x] Both affected scripts identified and read in full
- [x] Fail-first reproduction designed before any edit

### Definition of Done
- [x] Fail-first test reproduces the rewind on both scripts
- [x] Both scripts refuse a foreign rebase and restore HEAD
- [x] Genuine-conflict and clean-publish paths proven unregressed
- [x] `bash -n` clean on both scripts

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two protective guards wrapped around the existing rebase/abort block, symmetric across both scripts.

### Key Components

- **Pre-existing-rebase refusal**: before `git rebase`, detect a `rebase-merge` / `rebase-apply` directory and refuse — record a block and exit without touching it.
- **Pre-rebase-HEAD restore**: after any `git rebase --abort`, compare HEAD to the recorded pre-rebase commit and `git reset --hard` it back if it moved, before the existing assertion runs.

### Data Flow

1. Reconcile captures the pre-rebase commit (`ORIGINAL_HEAD` / `HEAD_SHA`).
2. If a rebase state directory already exists → refuse and exit.
3. Else start the rebase; on failure, abort.
4. If the abort left HEAD off the pre-rebase commit → restore it.
5. Assert clean state; report block or publish.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reproduce
- [x] Hermetic test plants an authentic stale `rebase-merge` and asserts HEAD is preserved
- [x] Fail-first run shows the rewind on both scripts

### Phase 2: Core Implementation
- [x] `git-primary-reconcile.sh`: refusal + restore
- [x] `git-sync.sh`: refusal + HEAD-identity restore

### Phase 3: Verification
- [x] Test passes on both scripts after the fix
- [x] Genuine-conflict and clean-publish regression cases added and green
- [x] `bash -n` both scripts

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Stale-rebase rewind on both scripts | Hermetic bash + throwaway git repos |
| Regression | Genuine conflict preserves commit; clean divergence publishes | Same harness |
| Static | Shell syntax | `bash -n` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git rebase state layout | External | Green | Detection uses `git rev-parse --git-path rebase-merge/apply` |
| `git merge-base` / `rev-parse` plumbing | External | Green | Standard, stable across supported git |
| `git-live-follow.sh` | Internal | Green | Unchanged; fast-forward-only |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reconcilers refuse to publish in a case they previously handled, or the restore misfires.
- **Procedure**:
  1. Revert this packet's commit on `skilled/v4.0.0.0` and `main`.
  2. The scripts return to their prior behavior; no state migration to undo.
  3. Re-open this packet with the failing case captured in the hermetic test.

<!-- /ANCHOR:rollback -->
