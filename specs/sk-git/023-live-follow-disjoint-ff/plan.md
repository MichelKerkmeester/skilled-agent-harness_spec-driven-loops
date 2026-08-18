---
title: "Plan: Live-Sync Disjoint Fast-Forward"
description: "Approach for relaxing the reconcile/follower dirty gate to git-native --ff-only while keeping the rebase path clean-gated."
trigger_phrases:
  - "live sync disjoint ff plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/023-live-follow-disjoint-ff"
    last_updated_at: "2026-08-17T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Captured the ff-only relax approach"
    next_safe_action: "Implement the two script edits and doc update"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-plan"
      parent_session_id: null
---
<!-- SPECKIT_LEVEL: 1 -->

# Plan: Live-Sync Disjoint Fast-Forward

<!-- ANCHOR:plan -->
## Insight

The behind-only fast-forward in both scripts **already** calls `git merge --ff-only`, which is self-protecting: git refuses to overwrite a locally-modified tracked file. The only reason a dirty checkout never follows is a blanket dirty pre-check that returns/exits before that safe call is reached. So the fix is to remove the redundant pre-check from the fast-forward path and let git's own guarantee stand — nothing new needs to be invented.

The one path that genuinely needs a clean tree is the **rebase/publish** step (reconciler only): it rewrites the operator's unpublished commits across the working tree, which is unsafe over uncommitted edits. That check is preserved, moved to gate only that path.

## Steps

1. **`git-primary-reconcile.sh`** — replace the blanket pre-fetch dirty skip with a `TRACKED_DIRTY` flag (no early exit). Leave the behind-only `git merge --ff-only` as-is. Add a `TRACKED_DIRTY` gate immediately before the rebase. Make the fast-forward-refused block message name the dirty-collision case.
2. **`git-live-follow.sh`** — delete the dirty pre-check inside the behind-only branch; let `git merge --ff-only` run and, on refusal, print a would-overwrite-local-changes message.
3. **`continuous-integration.md`** — update the two script descriptions and the "un-committed work is never touched" safety-contract row to describe the git-native ff-only guarantee and the retained rebase clean-gate.

## Verification

A throwaway-repo simulation proving the primitive both scripts rely on: behind + disjoint dirty → ff advances and preserves WIP; behind + colliding dirty → ff refused and preserves the local edit. Plus `bash -n` on both scripts.

## Risk

Blast radius is every operator's primary checkout. Mitigation: the change removes a redundant guard and leans entirely on git's native `--ff-only` refusal — strictly no weaker than the prior guarantee that un-committed work is never overwritten. The rebase path stays clean-gated.
<!-- /ANCHOR:plan -->

