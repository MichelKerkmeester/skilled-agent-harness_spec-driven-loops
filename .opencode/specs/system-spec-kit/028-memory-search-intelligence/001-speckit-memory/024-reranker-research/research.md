---
title: "Research Report: Citation-Ledger Reranker for Memory Search"
description: "A 10-iteration deep research on a memory-search reranker. Verdict CONDITIONAL-GO. A demote-only Beta-posterior penalty is the one recall lever the truncation law permits, it hits the oracle ceiling under a synthesized ledger and its real-data eval-gate delta is 0.000 by construction so the win is blocked on data not algorithm."
trigger_phrases:
  - "028 reranker deep research"
  - "028 demote only beta posterior reranker"
  - "028 reranker oracle ceiling synthesized ledger"
  - "028 reranker zero by construction"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/009-reranker-research"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Captured the 10-iteration reranker deep research, CONDITIONAL-GO"
    next_safe_action: "Use this research as the authoritative reranker investigation for 028"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-research-028-009-reranker-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Research Report: Citation-Ledger Reranker for Memory Search

> A 10-iteration deep research on whether a memory-search reranker can earn a measured prod
> recall win. The verdict is CONDITIONAL-GO. A demote-only Beta-posterior penalty is the one
> recall lever the truncation law permits, the design is sound and prototype-validated to the
> oracle ceiling under a synthesized ledger, but it cannot earn a real-data win today and is
> blocked on ledger density and corpus geometry, not on the algorithm.

---

<!-- ANCHOR:verdict -->
## 1. VERDICT

**CONDITIONAL-GO.** A reranker is the one recall lever the truncation law permits. It reorders the
prod top-3 rather than appending to the truncated tail, the design is sound and provably capable,
but it cannot earn a real-data win today and is blocked on DATA not algorithm.

The new-feature arc closed with a single hard law. The append-not-displace pattern is the only
non-regressing way to add content, and prod confidence-truncation cuts the tail before a reader
sees it, so any tail-additive feature reads as zero at prod K by construction. That law leaves
exactly one untried recall lever. A reranker does not append to the cut tail. It reorders the
survivors that already sit inside the prod top-3, so it is the one mechanism the law permits. The
research designed that lever in its safe form, proved it can reach the oracle ceiling and then
proved it cannot earn a real-data win until the ledger and the corpus change.
<!-- /ANCHOR:verdict -->

---

<!-- ANCHOR:design -->
## 2. THE DESIGN

The recommendation, prototype-validated, is a DEMOTE-ONLY, score-mutating, per-memory Beta-posterior
penalty.

### The mechanism

For each candidate the reranker computes a posterior probability of usefulness over the citation
ledger:

```
p_used = (1 + cited) / (2 + shown)
```

This is a Beta-posterior mean with a neutral Beta(1,1) prior, where `cited` is the count of times
the memory was shown and then cited and `shown` is the count of times the memory was shown at all.
The penalty factor is:

```
factor = (shown < N_MIN or p_used >= 0.5) ? 1.0 : clamp(p_used / 0.5, FLOOR, 1.0)
```

The reranker then mutates the score in place by that factor.

### The demote-only asymmetry, the key insight

The factor never exceeds 1.0, so the mechanism can only DEMOTE, never promote. This asymmetry is the
heart of the design. It makes the citation-emitter's under-counted positives SAFE. A real-but-unechoed
use degrades at worst to a weak negative and never to a fabricated promotion. A cold or empty ledger
makes every factor 1.0, a true byte-identical no-op. The mechanism is inert until real used and
not-used pairs accumulate, and even then it can only lower an untrusted candidate, never raise one.

### The placement, pre-truncation and score-mutating

The placement is PRE-truncation, immediately before the confidence-truncation block. It mutates score
not just order because truncation re-sorts survivors by score. The post-budget reorder seam is provably
inert for completeRecall@3, the same tail-only failure that held the deterministic-multihop and
lane-champion-backfill features. A reorder that runs after the budget has already cut the survivors
cannot change which memories survive, so the penalty has to land before truncation and has to move the
score that truncation reads.

### The signal

The trustworthy signal is the explicit NEGATIVE class from the true_citation_events ledger, keyed
per-memory cross-query. The ledger records which shown memories were cited and which were not, and the
not-used count is the reliable negative the reranker demotes on. The positive class is weaker because
a real use the assistant does not echo never reaches the ledger, which is exactly why the design demotes
rather than promotes.

### The displacement guard

The displacement guard is a five-layer fail-closed gate plus a shadow-diff audit:

1. **Near-tie band.** Only act inside a small score band, never reorder confident separations.
2. **Strong-ledger gate.** Only act when the ledger evidence for a candidate is strong enough.
3. **Max-drop of 1 rank.** A single demotion can move a candidate at most one rank.
4. **Never demote rank-0 or a confirmed positive.** The top survivor and any confirmed-used memory are
   untouchable.
5. **Fail-closed to baseline on any error.** Any fault reverts to the unmodified baseline ordering.

The shadow-diff audit records every would-be demotion so the mechanism can be watched before it is ever
trusted.

### The shipping posture

The mechanism ships flag-off shadow behind a new SPECKIT_CITATION_RERANK default-off switch. It does not
flip default-on. It runs in shadow, emits its diff and stays inert in the live result path until the
data prerequisites are met.
<!-- /ANCHOR:design -->

---

<!-- ANCHOR:evidence -->
## 3. THE EVIDENCE

The prototype ran on a live-DB copy through eval-v2 prod-mode completeRecall@3.

### Capability check, the synthesized ledger hits the oracle ceiling

Under a SYNTHESIZED full-coverage ledger the pre-truncation placement moved completeRecall@3 from
0.0357 to 0.2116, a +0.176 lift that hit the oracle ceiling exactly, 6 helped and 0 harmed. This proves
the mechanism and the placement are correct. When the ledger is dense enough to separate the trusted
from the untrusted, the demote-only penalty reorders the prod top-3 precisely into the oracle ordering
without harming a single query.

| Run | completeRecall@3 | Delta | Helped | Harmed |
|-----|------------------|-------|--------|--------|
| Baseline | 0.0357 | n/a | n/a | n/a |
| Synthesized full-coverage ledger, pre-truncation penalty | 0.2116 | +0.176 | 6 | 0 |
| Oracle ceiling | 0.2116 | n/a | n/a | n/a |

### The dispositive refutation, 0.000 on real data by construction

On real, non-synthesized data the eval-gate delta is 0.000 by construction. The numbers force it:

- Of 246 gold memory_ids exactly 1, which is 0.4 percent, appears in the ledger-shown universe.
- The 20 actionable strong-negatives intersect the gold set at 0.
- For each of the 6 movable golds the count of strong-negative distractors ranked above the gold is
  0 of 6.

A demote-only mechanism demotes nothing above any gold, so its delta is exactly 0.000. The 6 movable
golds sit at fused ranks 4 to 7, not near-ties, so the safety band would refuse to touch them anyway.
The true_citation_events table is absent from the live DB because the emitter is default-off, so the
+0.176 exists only under a hand-synthesized ledger. It is a synthetic capability check and not a
real-traffic win.

| Real-data fact | Value | Consequence |
|----------------|-------|-------------|
| Gold ids in the ledger-shown universe | 1 of 246, 0.4 percent | Almost no gold is even visible to the ledger |
| Gold and strong-negative intersection | 0 | No gold is itself a demotion target |
| Strong-negative distractors ranked above a movable gold | 0 of 6 | Nothing to demote above any gold |
| Movable gold fused ranks | 4 to 7 | Not near-ties, the safety band refuses them |
| Eval-gate delta | 0.000 | A demote-only mechanism demotes nothing above any gold |
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:prerequisites -->
## 4. THE EARN-IT PREREQUISITES

The win is blocked on data and coverage, not on the algorithm.

### PREREQ-A, ledger density

Enable SPECKIT_TRUE_CITATION_EMITTER and accumulate real used and not-used pairs until the
gold-and-ledger intersection is materially above zero at the eval golds' top-3 neighbors. Today it is
0.4 percent. This is necessary but not sufficient. Without it the reranker has almost no gold in its
field of view and cannot move recall on the eval set no matter how sound the mechanism is.

### PREREQ-B, corpus geometry

The golden set is recall-bound not rank-bound. The only geometry this demote-only mechanism can convert
is a reliable-negative distractor at fused rank 1 to 3 ranked above a gold at fused rank 4 to 8. That
geometry occurs 0 of 6 on real data, so manufacturing it would be synthetic. A demote-only reranker can
only help when a trusted-negative sits above a gold inside the prod window, and on this corpus that
configuration does not appear.

### The honest conclusion

The reranker design is preserved and ready. A measured prod win waits on real ledger density plus a
corpus that actually exhibits the reliable-negative-above-gold geometry. The design is not the blocker,
the data is.
<!-- /ANCHOR:prerequisites -->

---

<!-- ANCHOR:findings -->
## 5. KEY FINDINGS

1. **A reranker is the one permitted lever.** The truncation law cuts any tail-additive feature to zero
   at prod K, and a reranker is the only mechanism that reorders the survivors inside the prod top-3
   rather than appending to the cut tail.
2. **Demote-only is the safe form.** A factor capped at 1.0 turns the citation-emitter's under-counted
   positives from a fabrication risk into a harmless weak negative and makes a cold ledger a true no-op.
3. **The placement must be pre-truncation and score-mutating.** Truncation re-sorts by score and the
   post-budget reorder seam is inert for completeRecall@3, so the penalty has to land before the budget
   and move the score the budget reads.
4. **The mechanism is provably capable.** Under a synthesized full-coverage ledger it hit the oracle
   ceiling, 0.0357 to 0.2116, 6 helped 0 harmed.
5. **The real-data delta is 0.000 by construction.** The gold set and the strong-negative set do not
   intersect, the movable golds are not near-ties and the ledger sees only 1 of 246 golds, so a
   demote-only mechanism has nothing to demote above any gold.
6. **The block is data, not algorithm.** PREREQ-A ledger density and PREREQ-B corpus geometry gate the
   win, the design is sound and ready.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:recommendation -->
## 6. RECOMMENDATION

Ship the demote-only Beta-posterior reranker flag-off shadow behind a new SPECKIT_CITATION_RERANK
default-off switch, with the five-layer displacement guard and the shadow-diff audit in place. Do not
flip it default-on. Preserve the design as ready and treat the win as deferred to two data
prerequisites: enable the true-citation emitter and accumulate real ledger density past the current
0.4 percent gold intersection and confirm a corpus that exhibits the reliable-negative-above-gold
geometry the mechanism can convert. The reranker earns a measured prod win only after both prerequisites
are met, and until then it stays an inert shadow that can only demote untrusted candidates and never
fabricate a promotion.
<!-- /ANCHOR:recommendation -->

---

<!-- ANCHOR:references -->
## 7. REFERENCES

- **Predecessor truncation finding**: `../008-new-feature-research-build/implementation-summary.md`
- **Prod-mode baseline**: `../before-vs-after.md`
- **Feature flags**: `../feature-flags.md`
- **Parent spec**: `../spec.md`
- **HVR voice rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
<!-- /ANCHOR:references -->
