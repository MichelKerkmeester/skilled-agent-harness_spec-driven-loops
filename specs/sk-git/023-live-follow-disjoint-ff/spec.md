---
title: "Feature Specification: Live-Sync Disjoint Fast-Forward"
description: "Relax the primary-checkout reconcile and follower so a behind-only checkout fast-forwards through git's own --ff-only even while carrying unrelated work-in-progress, instead of hard-skipping on any tracked change; only the rebase/publish path keeps the clean-tree boundary."
trigger_phrases:
  - "live sync dirty checkout"
  - "primary reconcile disjoint fast forward"
  - "checkout not following live branch"
  - "auto follow skips dirty tree"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/023-live-follow-disjoint-ff"
    last_updated_at: "2026-08-17T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Relaxed reconcile/follower to git-native ff-only; kept rebase clean-gated"
    next_safe_action: "Confirm auto-follow advances a dirty checkout on next disjoint push"
    blockers: []
    key_files:
      - ".opencode/bin/git-primary-reconcile.sh"
      - ".opencode/bin/git-live-follow.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-spec"
      parent_session_id: null
---
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Live-Sync Disjoint Fast-Forward

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-08-17 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 1. PROBLEM & PURPOSE

The continuous-integration live-sync keeps the operator's primary checkout current by fast-forwarding it to the live branch as concurrent sessions publish. Both the SessionStart reconciler (`git-primary-reconcile.sh`) and the optional follower (`git-live-follow.sh`) treated **any** modified or staged tracked file as a hard stop: they skipped before doing anything.

In practice a primary checkout very often carries unrelated work-in-progress from another session. Under the old rule that WIP **permanently** blocked auto-follow — the reconcile log showed a steady stream of `skip: uncommitted tracked changes; checkout untouched` — so the operator kept seeing stale files and had to fast-forward by hand.

The block was stricter than necessary. Git's own `git merge --ff-only` already refuses to overwrite a modified tracked file: it advances only files that differ between HEAD and the target and aborts if any of those is locally dirty. So a behind-only fast-forward is safe even with unrelated WIP present — it follows disjoint commits and is refused (never clobbers) on a real collision.

**Purpose:** let a behind-only checkout follow the live branch through git-native `--ff-only` regardless of unrelated dirty files, while keeping the rebase/publish path — which rewrites commits across the working tree — gated on a clean tree.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 2. SCOPE

### In scope
- `git-primary-reconcile.sh`: replace the blanket pre-fetch dirty skip with a captured flag; let the behind-only fast-forward run through `git merge --ff-only`; gate only the rebase/publish path on the clean-tree flag; add a dirty-collision-aware block message.
- `git-live-follow.sh`: drop the dirty pre-check in the behind-only branch and let `git merge --ff-only` decide; report a refusal as a would-overwrite-local-changes message.
- `references/continuous-integration.md`: update the two script descriptions and the safety-contract row to match.

### Out of scope
- The autosync publish leg (`git-sync.sh`, the `post-commit` hook) — unchanged.
- The rebase/publish clean-tree requirement — deliberately retained.
- The diverged-branch handling — still reported, never auto-merged.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## 3. SUCCESS CRITERIA
- SC-1: A behind-only checkout carrying tracked WIP **disjoint** from the incoming commits fast-forwards; the WIP is preserved.
- SC-2: A behind-only checkout whose WIP **collides** with an incoming commit is refused (blocked), and the local edit is preserved — never clobbered.
- SC-3: A checkout with unpublished local commits **and** a dirty tree defers the rebase (commits preserved, unpublished) rather than rebasing over the dirty tree.
- SC-4: Clean-tree behaviour (behind→ff, ahead→rebase+publish) is unchanged.
- SC-5: The reconcile/follow paths never `git rebase`, `reset`, or force over a dirty tree.

<!-- /ANCHOR:success-criteria -->

## RELATED DOCUMENTS
- Plan: `plan.md` · Tasks: `tasks.md` · Summary: `implementation-summary.md`
- Behaviour doc: `../../../.opencode/skills/sk-git/references/continuous-integration.md`
