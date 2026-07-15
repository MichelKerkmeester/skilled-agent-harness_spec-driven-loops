---
title: "Implementation Summary: Kept-Off Flag Resolution"
description: "The 028 flag experiment is closed. Five switches earned default-on and stayed, ten did not and their code was removed, each decided per flag under a fair real-world simulation with a fresh-Opus final gate and a 4-layer verification."
trigger_phrases:
  - "028 kept off flag resolution summary"
  - "028 keep 5 delete 10 outcome"
  - "028 flag flip or delete reckoning"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/030-kept-off-flag-resolution"
    last_updated_at: "2026-07-06T19:16:33.980Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the final flag-resolution reckoning: keep 5 default-on, delete 10 and their code"
    next_safe_action: "Treat this phase as the authoritative per-flag disposition for 028"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-summary-028-022-kept-off-flag-resolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every default-off flag has a final keep-or-delete decision."
      - "The deleted flags had their code removed and committed before this phase documented the outcome."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-kept-off-flag-resolution |
| **Completed** | 2026-06-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 028 flag experiment is closed with a clean decision per flag. The build epoch shipped most new search and memory behavior behind default-off switches and a transitional pass flipped four of them on while the rest waited behind a path to useful. This reckoning ended that holding pattern. Every default-off flag was simulated under a fair real-world load and given a final keep-or-delete decision behind a fresh-Opus gate. Five switches earned default-on and stayed. Ten did not earn their keep and their code was removed from the tree. A reader looking at 028 today sees only the switches that earned their place.

### The five kept default-on

Two are unqualified wins where a real metric moved, two are no-harm guarantees that add protection or grounding without dropping a real result, and one earns its keep on prod-path displacement protection.

- **`SPECKIT_DERIVED_ID_PROVENANCE`** kept on content-addressed identity correctness 4 of 4, stability 50 of 50, replay 3 of 3, dedup discrimination 50 of 50 and zero collisions.
- **`SPECKIT_CONFIDENCE_CALIBRATION`** kept on held-out ECE 0.184 to 0.023 across all folds with a shipped isotonic model, after a label-decoupling fix removed the earlier overfit. It rides a pre-028 switch promoted during 028.
- **`SPECKIT_RETENTION_FORGETTING_V1`** kept as a safety guarantee, it spares 386 keep-set rows the off path would delete with dropRecall delta 0. The keep and drop labels are circular, so it is a guardrail and not a precision win.
- **`SPECKIT_WORLD_SUMMARY_PRELUDE`** kept as a no-displacement grounding aid, it recovers 11 targets with 0 regressions by construction in append placement and never displaces a baseline row.
- **`SPECKIT_TEMPORAL_EDGES`** kept on prod-path displacement protection. The +0.083 edge-hop recall is an eval-mode artifact the 3-result prod truncation floor cuts to a 0.000 delta, so the keep rests upstream of truncation on the graph-additive reorder that protects the prod top-3 from graph-channel displacement, 3 of 12 golden queries with 0 regressions.

### The ten deleted

Each was removed with its code because the simulation showed it was not worthwhile.

- **`SPECKIT_PROCEDURAL_RELIABILITY_RECALL`** with its **`SPECKIT_PROCEDURAL_OUTCOME_EMITTER`**: shadow-only, empty ledger, eval rankDelta 0. The de-rate correctness fix was real but the bounded multiplier moves only synthetic near-ties.
- **`SPECKIT_SUMMARY_FUSION_LANE`**: displacement-only, Recall@20 -0.036, the lane only pushes a real channel hit out of the list.
- **`SPECKIT_CARDINALITY_PENALTY`**: 0.0000 Recall@20 movement, the degree-lane cap is too small to be decisive at K=20.
- **`SPECKIT_SLEEPTIME_CONSOLIDATION`**: net -1.67pp, the dedup pass hurts recall.
- **`SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`**: negative on the real forward-CALLS graph, uniform edges make PPR equal to the prior ranking.
- **The edge family** `SPECKIT_SEMANTIC_EDGE_LAYER`, `SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP` and `SPECKIT_EDGE_SEMANTIC_INVALIDATION`: generic relation-template edges carrying no pair identity, recall-inert at K=20 with a single-item +0.083 that does not generalize.
- **`SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK`**: MRR within noise on an empty ledger, every skill resolves to neutral so the order never moves.
- **`SPECKIT_BITEMPORAL_RECALL`**: zero callers, no point-in-time consumer reads the validity window.
- **`SPECKIT_EDGE_PRESENCE_CURRENTNESS`**: a correct integrity reconciliation pass that repairs 0 on the live graph, not a recall lever.
- **`SPECKIT_AGENTIC_RECALL`**: oracle ceiling +0.344 but the live reasoner nets zero with regressions at 51s per query and has no production consumer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../feature-flags.md` | Edited | Drop the 10 deleted, list the 5 kept default-on |
| `../keep-off-flag-roadmap.md` | Edited | Replace path-to-useful with the keep-or-delete resolution table |
| `../benchmark-status.md` | Edited | Record the final keep 5 and delete 10 tally |
| `../before-vs-after.md` | Edited | Reconcile the narrative to the final reality |
| `../001-speckit-memory/changelog/changelog-001-022-keep-off-flag-reinvestigation.md` | Edited | Reframe the milestone to the deletion reckoning |
| `../001-speckit-memory/changelog/changelog-001-root.md` | Edited | Update the closing milestone row |
| `../changelog/README.md` | Edited | Update the milestone description |
| `../timeline.md` | Edited | Reconcile Section G to keep 5 and delete 10 |
| `../**/decision-record.md` (8 deleted-flag phases) | Edited | One-line deleted-superseded note each |
| spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md | Created | This phase folder |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The decisions came from a method designed to refuse a plausible-but-wrong keep. The live signal was a fair real-world simulation that used claude2 and gpt-5.5 as evaluators, so a flag was judged on the path production serves rather than a synthetic harness. Each flag then passed a fresh-Opus final decision gate so no keep or delete rested on a single model's read. The disposition was hardened by a 4-layer verification: a triage that named each flag's root cause, an adversarial-verify pass that tried to refute each candidate keep, the fresh-Opus per-flag decision and a three-round deep review. The deep review caught the off-arm measurement bug where the delete-env path measured the on arm after a flip, which would have scored a flipped flag as a win against itself, and it established that synthetic, circular or self-recall wins do not earn a keep. The ten deletions had their code removed and committed before this phase recorded the outcome, so the documentation describes a reached state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the path-to-useful framing | When the connection to live data was made and the metric still did not move, the path was not a deferred flip, it was dead code |
| Delete procedural despite a committed fix | The de-rate fix was correct but the multiplier moved only synthetic near-ties, so the flag earned no keep even though the code change stayed |
| Keep temporal in the kept five | Its prod-path keep is the graph-additive reorder that protects the truncated prod top-3 from graph-channel displacement, not the +0.083 edge-hop recall the prod truncation floor cuts, and it is not the regression the pre-028 graph flags carry |
| Keep the honest framing on the no-harm flips | A release sign-off must not read retention or the prelude as a precision win when they are safety and grounding guarantees |
| Use a real-world simulation plus a fresh-Opus gate | A synthetic harness over-credits inert levers, and a single model can keep a plausible-but-wrong flag |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-flag disposition | DONE: 5 kept and 10 deleted, each with one-line deciding evidence |
| Cross-doc consistency | DONE: feature-flags, roadmap, benchmark-status, before-vs-after, changelog and timeline carry the same tally |
| Decision-record notes | DONE: 8 deleted-flag records carry the deleted-superseded note |
| HVR scan | PASS: 0 em-dashes, 0 prose semicolons and 0 Oxford commas in the reconciled docs |
| Strict validation | exit 0 for this child folder and the 028 root |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The coupling guard is a follow-up.** `confidence_calibration` and `absolute_relevance_calibration` are coupled by construction. A guard that degrades to identity on a provenance mismatch belongs on the kept calibration path so the footgun cannot fire. It is not built here.
2. **The graph-channel harm is out of 028 scope.** The within-noise harm belongs to the pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST`, a noted follow-up. `SPECKIT_TEMPORAL_EDGES` is the additive mitigation and is not the source.
3. **No commit made.** The edits are staged in the working tree only. Committing is the dispatcher's decision.
<!-- /ANCHOR:limitations -->
