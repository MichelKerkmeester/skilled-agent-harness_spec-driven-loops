---
title: "Feature Specification: Rebase-Abort HEAD Preservation"
description: "Stop the live-sync reconcilers from silently rewinding a branch when a stale or foreign rebase state directory is present: refuse to abort a rebase they did not start, and actively restore the pre-rebase commit if any abort moves HEAD."
trigger_phrases:
  - "commit disappeared after autosync"
  - "git hook reset local head"
  - "rebase abort rewound branch"
  - "stale rebase-merge lost commit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/024-rebase-abort-head-preservation"
    last_updated_at: "2026-08-20T08:35:00Z"
    last_updated_by: "sk-git"
    recent_action: "Hardened reconcile + git-sync against foreign-rebase aborts that rewind HEAD"
    next_safe_action: "Land on main and v4; watch the reconcile log for a refused pre-existing rebase"
    blockers: []
    key_files:
      - ".opencode/bin/git-primary-reconcile.sh"
      - ".opencode/bin/git-sync.sh"
      - ".opencode/bin/tests/git-rebase-abort-head-preservation.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-spec"
      parent_session_id: null
---
# Feature Specification: Rebase-Abort HEAD Preservation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-20 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The live-sync reconcilers publish a session's commits onto the shared live branch. When the live branch has moved, both `git-primary-reconcile.sh` (SessionStart, primary checkout) and `git-sync.sh` (post-commit, worktrees) rebase the local commits onto the remote tip, and on any rebase failure they run `git rebase --abort` to restore the pre-sync state.

The abort is unconditional, and that is the defect. A failed `git rebase` has two very different causes the scripts cannot tell apart: (1) our own rebase hit a conflict — abort correctly returns HEAD to the pre-rebase commit; or (2) our rebase never started because a pre-existing `rebase-merge` / `rebase-apply` state directory (a stale or killed rebase) already exists. In case 2 the blanket `git rebase --abort` aborts that foreign rebase, resetting the branch to its orig-head and silently discarding every commit made since.

This actually happened: a fresh commit on `skilled/v4.0.0.0` was rewound ~18 s later. The reconcile log recorded `rebase abort assertion failed; original=<new> current=<stale-orig-head>`, the fast-forward-only follower then advanced the now-behind branch, and the commit vanished locally (it survived on the remote). The same signature appears a day earlier — it is recurring. `git-primary-reconcile.sh` detects the anomaly but only warns and exits, leaving HEAD rewound; `git-sync.sh` captures no pre-rebase SHA, so it records the rewind as `aborted cleanly`.

### Purpose

Make it impossible for these reconcilers to lose a local commit to a rebase they did not start: refuse a pre-existing rebase, and restore the pre-rebase HEAD if any abort moves it.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `git-primary-reconcile.sh`: detect a pre-existing `rebase-merge` / `rebase-apply` directory before rebasing and refuse; after its own abort, `git reset --hard` back to the captured `ORIGINAL_HEAD` if HEAD moved.
- `git-sync.sh`: the same pre-existing-rebase refusal; add HEAD-identity to the abort assertion using the existing `HEAD_SHA` and restore it if the abort moved HEAD.
- A hermetic fail-first regression test covering both scripts plus the genuine-conflict and clean-publish paths.

### Out of Scope

- `git-live-follow.sh` — fast-forward-only; it was the collateral fast-forward, not the cause.
- The `post-commit` / SessionStart hook wiring and the enablement flags — unchanged.
- The provenance of a stale rebase directory — refusing to touch a foreign rebase is correct regardless of how it appeared.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/git-primary-reconcile.sh` | Modify | Refuse a pre-existing rebase; restore `ORIGINAL_HEAD` after any abort |
| `.opencode/bin/git-sync.sh` | Modify | Same refusal; add HEAD-identity restore around the abort |
| `.opencode/bin/tests/git-rebase-abort-head-preservation.test.sh` | Create | Hermetic fail-first regression coverage |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reconcile never aborts a foreign rebase | With a pre-existing rebase directory present, `git-primary-reconcile.sh` leaves HEAD on the local commit and records a refusal |
| REQ-002 | git-sync never aborts a foreign rebase | Same guarantee for `git-sync.sh` on a session branch |
| REQ-003 | Any abort that moves HEAD is undone | If HEAD is not the pre-rebase commit after an abort, the script restores the pre-rebase commit before reporting |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Genuine conflict path unchanged | An own-rebase conflict still aborts cleanly and preserves the local commit; no false assertion/abort failure is recorded |
| REQ-005 | Clean-publish path unchanged | A clean divergence still rebases and publishes to the remote |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With a stale/foreign rebase directory present, neither reconciler rewinds HEAD off the local commit.
- **SC-002**: A genuine own-rebase conflict aborts cleanly, preserves the commit, and records no false failure.
- **SC-003**: A clean divergence still rebases and publishes; the refusal does not block the normal path.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared blast radius (every SessionStart + every worktree commit) | A regression would affect all sessions | Both additions are strictly protective — a refusal and a restore; neither weakens an existing guarantee |
| Risk | `git reset --hard` on the restore path | Could discard work if misapplied | Only runs on a clean tree, targeting the exact pre-rebase commit already checked out |
| Dependency | git rebase state layout (`rebase-merge` / `rebase-apply`) | Detection relies on `git rev-parse --git-path` | Standard, stable git plumbing across supported versions |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The provenance of the stale rebase directory is intentionally not chased here; refusing to touch a foreign rebase is correct regardless of source.

<!-- /ANCHOR:questions -->
