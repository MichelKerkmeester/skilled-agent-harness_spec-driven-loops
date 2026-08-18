---
title: "Implementation Summary: Live-Sync Disjoint Fast-Forward"
description: "Shipped the reconcile/follower ff-only relax so a dirty primary checkout follows disjoint commits; rebase stays clean-gated. Proven by throwaway-repo simulation."
trigger_phrases:
  - "live sync disjoint ff summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/023-live-follow-disjoint-ff"
    last_updated_at: "2026-08-17T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Shipped ff-only relax across reconcile + follower + doc; simulation green"
    next_safe_action: "Watch the reconcile log advance a dirty checkout on the next disjoint push"
    blockers: []
    key_files:
      - ".opencode/bin/git-primary-reconcile.sh"
      - ".opencode/bin/git-live-follow.sh"
      - ".opencode/skills/sk-git/references/continuous-integration.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-implementation-summary"
      parent_session_id: null
---
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Live-Sync Disjoint Fast-Forward

**Status:** Complete

<!-- ANCHOR:final-state -->
## Final state — shipped

- **`git-primary-reconcile.sh`**: the blanket pre-fetch dirty skip is now a `TRACKED_DIRTY` flag that no longer exits. The behind-only path fast-forwards through the existing `git merge --ff-only`; the rebase/publish path is gated on `TRACKED_DIRTY` (defers with the local commits preserved and unpublished). A fast-forward refused while dirty reports a would-overwrite-local-changes block.
- **`git-live-follow.sh`**: the dirty pre-check inside the behind-only branch is removed; `git merge --ff-only` decides, and a refusal prints a would-overwrite-local-changes message.
- **`continuous-integration.md`**: the two script descriptions and the "un-committed work is never touched" safety-contract row now describe the git-native ff-only guarantee and the retained rebase clean-gate.

## Why this is safe

`git merge --ff-only` updates only files that differ between HEAD and the target and aborts if any of those is locally modified. The guarantee "un-committed work is never overwritten" is therefore enforced by git itself, not by a pre-check — strictly no weaker than before. The only path that rewrites commits across the tree, the rebase, keeps its clean-tree requirement.

## Verification evidence

Throwaway-repo simulation (global git config isolated so repo hooks did not interfere):
- **Disjoint**: behind + dirty `wip.txt`, incoming touches `other.txt` → `git merge --ff-only` **SUCCEEDED**, `wip.txt` dirty preserved, `other.txt` pulled. (SC-1)
- **Collision**: behind + dirty `shared.txt`, incoming touches `shared.txt` → `git merge --ff-only` **REFUSED**, local edit preserved. (SC-2)
- `bash -n` clean on both scripts.
- Real-world precedent from the same session: a manual `git merge --ff-only` on the primary checkout advanced 7 clean files while preserving 28 unrelated dirty files (28 → 28).

## Landing

Shipped in this packet's own commit on `main` and `skilled/v4.0.0.0` (the two scripts were byte-identical across both branches before the change, so the port is a clean cherry-pick).

<!-- /ANCHOR:final-state -->

## Continuation notes

The fix is passive — it takes effect at the next SessionStart reconcile / follower poll. To confirm live: after another session publishes a disjoint commit to the live branch, the primary checkout's `git-primary-reconcile.log` should show `advance` instead of `skip` even while carrying WIP.
