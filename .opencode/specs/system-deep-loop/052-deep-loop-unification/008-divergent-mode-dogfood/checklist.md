---
title: "Verification Checklist: Divergent-Mode Live Dogfood — Research + Review"
description: "Verification checklist for the parallel 10-iteration research + review dogfood run."
trigger_phrases:
  - "divergent mode dogfood checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Retry complete: both loops verified 10/10 real iterations, no pivot fired"
    next_safe_action: "Merge wt/0028-divergent-dogfood-retry to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `stopPolicy`/`convergenceMode` precedence traced against the real shipped YAML before configuring either loop, confirming `stopPolicy: "max-iterations"` would suppress the divergent branch for review (verified: `deep_review_auto.yaml:579,601,705-709`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

N/A — this packet makes no code changes. Both loops are structurally read-only against the reviewed/researched target (`treat_review_target_as_read_only` for review; no mutation path for research).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Both loops' real config files (`research/deep-research-config.json`, `review/deep-review-config.json`) confirmed `antiConvergence.convergenceMode: "divergent"` and the `cli-opencode`/`openai/gpt-5.6-sol-fast`/high executor throughout the retry run (verified directly, post-completion)
- [x] CHK-011 [P0] Raw `deep-research-state.jsonl` and `deep-review-state.jsonl` independently read end-to-end and reconciled against each loop's own completion claim: both show exactly 10 `type:"iteration"` records and a real terminal `loopStopped`/`loop_stop` event with `stopReason:"maxIterationsReached"` and `divergentPivotFired:false` — not trusted from either agent's self-report
- [x] CHK-012 [P1] Real wall-clock concurrency confirmed between the two loops throughout the retry via interleaved dispatch-receipt and checkpoint-commit timestamps in both `research/dispatch-receipts/` and `review/dispatch-receipts/`
- [x] CHK-013 [P1] Multiple iterations per loop spot-checked for genuine (not fabricated/templated) dispatched content across the retry (e.g. `research/iterations/iteration-001.md` and `iteration-010.md` read directly, both substantial and distinct; review's per-iteration findings independently read with full evidence chains) — confirmed genuine, not templated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — no findings are remediated in this packet by design (discovery-only dogfood run). Any real findings surfaced are reported in `implementation-summary.md`/`review/INCIDENT.md` and left for a future, separate remediation packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] `git status` on `.opencode/skills/system-deep-loop/` confirmed clean of any deletion or content modification throughout the retry — only the expected benign `deep-loop-graph.sqlite`/`observability-events.jsonl` regeneration noise, the read-only guarantee held end-to-end
- [x] CHK-021 [P0] Blast radius of the original destructive incident independently verified repo-wide via `git status --porcelain | grep "^ D\|^D "` (zero deletions anywhere in the tracked tree, unchanged from the pre-retry finding); the loss was fully contained to the never-committed packet, and the worktree-isolated retry introduced zero further risk to the live tree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] `implementation-summary.md` reports the real outcome honestly (P0 incident, fixes applied, retry result, real findings, the one remaining asymmetry — research has a synthesis doc, review does not) — not an assumed clean run
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-040 [P0] This packet folder (`008-divergent-mode-dogfood`) follows the phase-child naming convention and is re-registered in the parent's (`052-deep-loop-unification`) `children_ids` after recovery
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 3 | 3/3 |

**Verification Date**: 2026-07-11 (post-incident retry, worktree-isolated; both loops reached genuine terminal state, independently verified)
<!-- /ANCHOR:summary -->
