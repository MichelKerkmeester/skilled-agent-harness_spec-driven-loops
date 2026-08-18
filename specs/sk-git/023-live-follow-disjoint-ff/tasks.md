---
title: "Tasks: Live-Sync Disjoint Fast-Forward"
description: "Executor-ready task list for the reconcile/follower ff-only relax and the doc update."
trigger_phrases:
  - "live sync disjoint ff tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/023-live-follow-disjoint-ff"
    last_updated_at: "2026-08-17T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Listed and completed the three edits + proof"
    next_safe_action: "Land on main and v4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-tasks"
      parent_session_id: null
---
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Live-Sync Disjoint Fast-Forward

> `[x]` done · `[ ]` open.

<!-- ANCHOR:tasks -->
- [x] T001 [P0] `git-primary-reconcile.sh`: replace the blanket pre-fetch dirty skip with a `TRACKED_DIRTY` flag; keep the behind-only `git merge --ff-only`; add the `TRACKED_DIRTY` gate before the rebase; add the dirty-collision block message. (SC-1, SC-3, SC-5)
- [x] T002 [P0] `git-live-follow.sh`: drop the dirty pre-check in the behind-only branch; let `git merge --ff-only` decide; refusal prints a would-overwrite-local-changes message. (SC-1, SC-2)
- [x] T003 [P1] `references/continuous-integration.md`: update the two script descriptions and the safety-contract row. (SC-4)
- [x] T004 [P0] Prove the primitive in a throwaway repo: disjoint dirty → ff advances + WIP preserved; colliding dirty → ff refused + edit preserved. `bash -n` both scripts. (SC-1, SC-2)
<!-- /ANCHOR:tasks -->

