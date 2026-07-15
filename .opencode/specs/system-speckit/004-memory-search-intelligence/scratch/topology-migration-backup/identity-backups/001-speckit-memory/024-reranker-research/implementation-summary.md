---
title: "Implementation Summary: Citation-Ledger Reranker Research"
description: "The reranker research is closed CONDITIONAL-GO. A demote-only Beta-posterior penalty is the one recall lever the truncation law permits, it hit the oracle ceiling under a synthesized ledger, but its real-data eval-gate delta is 0.000 by construction so the win is blocked on ledger density and corpus geometry not on the algorithm."
trigger_phrases:
  - "028 reranker research summary"
  - "028 reranker conditional go outcome"
  - "028 reranker zero by construction real data"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/024-reranker-research"
    last_updated_at: "2026-07-06T19:16:34.585Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the reranker research outcome, CONDITIONAL-GO blocked on data"
    next_safe_action: "Treat this phase as the authoritative reranker research outcome for 028"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-summary-028-024-reranker-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A reranker is the one recall lever the truncation law permits because it reorders the prod top-3 rather than appending to the cut tail."
      - "The demote-only Beta-posterior penalty hit the oracle ceiling under a synthesized ledger, proving the mechanism and the pre-truncation placement are correct."
      - "The real-data eval-gate delta is 0.000 by construction because the gold set and the strong-negative set do not intersect, so the win is blocked on data not algorithm."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-reranker-research |
| **Completed** | 2026-06-21 |
| **Level** | 2 |
| **Phase type** | Research, read-only, no code shipped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is research, not a build. It closes a 10-iteration deep research on a memory-search reranker with the verdict CONDITIONAL-GO. The new-feature arc left one hard law standing. The append-not-displace pattern is the only non-regressing way to add content, and prod confidence-truncation cuts the tail before a reader sees it, so any tail-additive feature reads as zero at prod K by construction. A reranker is the one recall lever that law permits, because it reorders the survivors already inside the prod top-3 rather than appending to the cut tail. The research designed that lever in its safe form, prototyped it against a live-DB copy, proved it can reach the oracle ceiling and then refuted a real-data win as 0.000 by construction. The design is preserved and ready, a measured prod win waits on data. No reranker code shipped, the prototype ran on a live-DB copy and is not committed here.

### The recommended design, demote-only and prototype-validated

The recommendation is a demote-only, score-mutating, per-memory Beta-posterior penalty. For each candidate the research computes `p_used = (1 + cited) / (2 + shown)` over the citation ledger with a neutral Beta(1,1) prior, then a factor `(shown < N_MIN or p_used >= 0.5) ? 1.0 : clamp(p_used / 0.5, FLOOR, 1.0)` and mutates the score in place by that factor. The factor never exceeds 1.0, so the mechanism can only demote, never promote. That asymmetry is the key insight. It makes the citation-emitter's under-counted positives safe, since a real-but-unechoed use degrades at worst to a weak negative and never to a fabricated promotion, and a cold or empty ledger makes every factor 1.0, a true byte-identical no-op. The placement is pre-truncation, immediately before the confidence-truncation block, and it mutates score not just order because truncation re-sorts survivors by score and the post-budget reorder seam is provably inert for completeRecall@3. That inert seam is the same tail-only failure that held the deterministic-multihop and lane-champion-backfill features. The trustworthy signal is the explicit negative class from the true_citation_events ledger, keyed per-memory cross-query. The displacement guard is a five-layer fail-closed gate plus a shadow-diff audit: a near-tie band, a strong-ledger gate, a max-drop of 1 rank, a never-demote-rank-0-or-confirmed-positive rule and a fail-closed-to-baseline on any error. The mechanism ships flag-off shadow behind a new SPECKIT_CITATION_RERANK default-off switch.

### The evidence, oracle ceiling under synthesis and 0.000 on real data

The prototype ran on a live-DB copy through eval-v2 prod-mode completeRecall@3. Under a synthesized full-coverage ledger the pre-truncation placement moved cr@3 from 0.0357 to 0.2116, a +0.176 lift that hit the oracle ceiling exactly, 6 helped 0 harmed. That proves the mechanism and the placement are correct. The dispositive refutation is on real, non-synthesized data: the eval-gate delta is 0.000 by construction. Of 246 gold memory_ids exactly 1, which is 0.4 percent, appears in the ledger-shown universe. The 20 actionable strong-negatives intersect the gold set at 0. For each of the 6 movable golds the count of strong-negative distractors ranked above the gold is 0 of 6. A demote-only mechanism demotes nothing above any gold, so its delta is exactly 0.000. The 6 movable golds sit at fused ranks 4 to 7, not near-ties, so the safety band would refuse to touch them anyway. The true_citation_events table is absent from the live DB because the emitter is default-off, so the +0.176 exists only under a hand-synthesized ledger, a synthetic capability check and not a real-traffic win.

### The earn-it prerequisites, blocked on data and coverage

The win is blocked on data and coverage, not on the algorithm. PREREQ-A is to enable the true-citation emitter and accumulate real used and not-used pairs until the gold-and-ledger intersection is materially above zero at the eval golds' top-3 neighbors, where today it is 0.4 percent. That is necessary but not sufficient. PREREQ-B is the corpus geometry. The golden set is recall-bound not rank-bound, and the only geometry this demote-only mechanism can convert is a reliable-negative distractor at fused rank 1 to 3 ranked above a gold at fused rank 4 to 8, which occurs 0 of 6 on real data, so manufacturing it would be synthetic. The honest conclusion is that the reranker design is preserved and ready, and a measured prod win waits on real ledger density plus a corpus that actually exhibits the reliable-negative-above-gold geometry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../graph-metadata.json` | Edited | Add 009 to the parent children_ids |
| `../spec.md` | Edited | Add the 009 row to the phase documentation map |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | This phase folder |
| `research.md` | Created | The full reranker deep research |
| `description.json`, `graph-metadata.json` | Created | This phase's search and graph metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The research was run to refuse a plausible-but-wrong go, the same discipline the rest of the campaign used. The truncation law came first and narrowed the search to a single permitted mechanism, so the design did not waste effort on a tail-additive form that the prod budget would cut. The demote-only form was chosen on purpose, because a promotion-capable reranker fed by the citation emitter's under-counted positives could fabricate a promotion, while a capped-at-1.0 factor cannot. The prototype then separated capability from traffic. Running it under a synthesized full-coverage ledger proved the mechanism and the pre-truncation placement reach the oracle ceiling, and running it on real data proved the delta is 0.000 by construction through the gold-and-ledger non-intersection counts. The verdict is CONDITIONAL-GO rather than NO-GO precisely because the 0.000 is a data property and not an algorithm flaw. The prototype ran against a live-DB copy and is not committed, this phase records the research outcome over a read-only investigation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pursue a reranker, not another additive feature | It reorders the prod top-3 rather than appending to the cut tail, so it is the one recall lever the truncation law permits |
| Make the mechanism demote-only, capped at 1.0 | A real-but-unechoed use degrades to a weak negative and never a fabricated promotion, so the citation-emitter's under-counted positives stay safe |
| Place the penalty pre-truncation and mutate score | Truncation re-sorts survivors by score and the post-budget reorder seam is inert for completeRecall@3 |
| Label the 0.2116 a capability check | It exists only under a hand-synthesized full-coverage ledger, the true_citation_events table is absent from the live DB |
| Record the verdict as CONDITIONAL-GO | The 0.000 real-data delta is a ledger-density and corpus-geometry gap, the design is sound and ready |
| Ship flag-off shadow only | A new SPECKIT_CITATION_RERANK default-off switch keeps the mechanism inert until the data prerequisites are met |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Verdict | DONE: CONDITIONAL-GO recorded with the truncation-law reasoning |
| Design | DONE: demote-only Beta-posterior penalty, its formula, its asymmetry, its pre-truncation placement and its five-layer guard documented |
| Capability check | DONE: synthesized-ledger completeRecall@3 moved 0.0357 to 0.2116, oracle ceiling, 6 helped 0 harmed |
| Real-data refutation | DONE: eval-gate delta 0.000 by construction, 1 of 246 golds in the ledger, 0 gold-and-strong-negative intersection, 0 of 6 movable golds with a strong-negative above |
| Earn-it prerequisites | DONE: PREREQ-A ledger density and PREREQ-B corpus geometry recorded as the data-and-geometry block |
| HVR scan | PASS: 0 em-dashes, 0 prose semicolons and 0 Oxford commas in the phase docs |
| Strict validation | exit 0 for this child folder and the 028 root |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The win is blocked on ledger density.** Its next step is to enable the true-citation emitter and accumulate real used and not-used pairs until the gold-and-ledger intersection is materially above the current 0.4 percent at the eval golds' top-3 neighbors.
2. **The win is blocked on corpus geometry.** The only geometry this demote-only mechanism can convert is a reliable-negative distractor at fused rank 1 to 3 above a gold at fused rank 4 to 8, which occurs 0 of 6 on real data, so a corpus that exhibits it is a prerequisite.
3. **The prototype is a synthetic capability check.** The +0.176 lift exists only under a hand-synthesized full-coverage ledger, the true_citation_events table is absent from the live DB, so the number is not a real-traffic result.
4. **No code shipped and no commit made.** This phase is read-only research, the prototype ran on a live-DB copy and is not committed and the documentation edits stay staged in the working tree only.
<!-- /ANCHOR:limitations -->
