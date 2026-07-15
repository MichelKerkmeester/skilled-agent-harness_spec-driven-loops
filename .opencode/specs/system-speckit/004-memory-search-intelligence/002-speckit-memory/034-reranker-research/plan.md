---
title: "Research Plan: Citation-Ledger Reranker Research"
description: "Method and verification route for the 10-iteration reranker deep research: derive the design from the truncation law, prototype it against a live-DB copy, refute it on real data and record the earn-it prerequisites that block a measured win."
trigger_phrases:
  - "028 reranker research plan"
  - "028 reranker prototype method"
  - "028 reranker conditional go method"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/034-reranker-research"
    last_updated_at: "2026-07-04T17:51:00.741Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the reranker research plan"
    next_safe_action: "Reconcile the root child map and phase map to the reranker research outcome"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-plan-028-024-reranker-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Plan: Citation-Ledger Reranker Research

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript memory-search engine plus markdown research documentation, read-only |
| **Framework** | Spec Kit spec-folder docs, the eval-v2 prod-mode harness, the true_citation_events ledger |
| **Storage** | Repository files, a live-DB copy, the eval corpus, git history |
| **Testing** | The eval-v2 prod-mode completeRecall@3 benchmark, strict spec validation, an HVR voice scan |

### Overview
This phase records a 10-iteration deep research on a citation-ledger reranker. The append-not-displace truncation finding from the new-feature arc left exactly one untried recall lever, a mechanism that reorders the survivors inside the prod top-3 rather than appending to the cut tail. The research derived a demote-only Beta-posterior penalty as the safe form of that lever, prototyped it against a live-DB copy through the eval-v2 prod-mode completeRecall@3 metric, found it hit the oracle ceiling under a synthesized full-coverage ledger, then refuted a real-data win as 0.000 by construction because the gold set and the strong-negative set do not intersect. The plan documents that method, records the prototype number and the refutation counts, names the earn-it prerequisites and reconciles the root child map and phase map to this outcome. No reranker code shipped, the prototype ran on a live-DB copy and is not committed here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The append-not-displace truncation finding is recorded as the constraint that names the one permitted lever.
- [x] The eval-v2 prod-mode completeRecall@3 harness is available against a live-DB copy.
- [x] The true_citation_events ledger schema and the gold set are readable for the intersection analysis.

### Definition of Done
- [x] The CONDITIONAL-GO verdict is documented with the truncation-law reasoning.
- [x] The recommended demote-only Beta-posterior design is documented with its formula and its five-layer guard.
- [x] The prototype 0.0357 to 0.2116 oracle-ceiling move and the 0.000-by-construction real-data refutation are both recorded.
- [x] Strict validation exits 0 for the 028 root and this child.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only deep research recorded as documentation, a candidate mechanism derived from the truncation law, prototyped against a live-DB copy and refuted on real data, with the design preserved and the win deferred to data prerequisites.

### Key Components
- **The recommended design**: a demote-only, score-mutating, per-memory Beta-posterior penalty placed immediately before the confidence-truncation block. For each candidate compute p_used over the citation ledger with a neutral Beta(1,1) prior, then a factor that never exceeds 1.0 and mutate score in place.
- **The demote-only asymmetry**: the factor is capped at 1.0 so the mechanism can only demote, never promote. This makes the citation-emitter's under-counted positives safe and makes a cold ledger a true no-op.
- **The placement**: pre-truncation and score-mutating, because truncation re-sorts survivors by score and the post-budget reorder seam is provably inert for completeRecall@3.
- **The five-layer displacement guard**: a near-tie band, a strong-ledger gate, a max-drop of 1 rank, a never-demote-rank-0-or-confirmed-positive rule and a fail-closed-to-baseline on any error, plus a shadow-diff audit.
- **The shipping posture**: flag-off shadow behind a new default-off switch, no default-on flip.

### Data Flow
The true_citation_events ledger feeds a per-memory used and not-used count. The Beta-posterior turns those counts into p_used, the demote-only factor turns p_used into an in-place score penalty pre-truncation, truncation re-sorts the survivors and the prod-mode completeRecall@3 metric scores whether the full target set survives the budget. The guard reads the same ledger to refuse any unsafe demotion and falls closed to baseline on error.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../graph-metadata.json` | Parent child map | Add 009 to children_ids | 009 present in the children list |
| `../spec.md` | Parent phase map | Add the 009 row | Phase map lists 009 |
| `spec.md` | New | Defines the reranker research scope and disposition | Spec reads CONDITIONAL-GO with the design and the refutation |
| `research.md` | New | The full deep research | Design, prototype evidence, refutation and prerequisites present |
| `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | New | This phase folder | All Level-2 docs present and consistent |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the append-not-displace truncation finding and confirm it names a reorder-the-top-3 lever as the only untried path.
- [x] Confirm the eval-v2 prod-mode completeRecall@3 harness runs against a live-DB copy.
- [x] Read the true_citation_events ledger schema and the 246-gold eval set for the intersection analysis.

### Phase 2: Research and Prototype
- [x] Derive the demote-only Beta-posterior penalty as the safe form of the reorder lever.
- [x] Prototype the penalty pre-truncation and measure completeRecall@3 under a synthesized full-coverage ledger.
- [x] Record the move from 0.0357 to 0.2116, hitting the oracle ceiling exactly, 6 helped 0 harmed.
- [x] Re-run on real, non-synthesized data and measure the eval-gate delta.
- [x] Trace the 0.000 delta to the gold-and-ledger non-intersection counts.

### Phase 3: Verification and Documentation
- [x] Confirm every number traces to the prototype run or the ledger-intersection counts.
- [x] Record the five-layer displacement guard and the flag-off shadow posture.
- [x] Record the earn-it prerequisites as the data-and-geometry block.
- [x] Run an HVR scan across the phase docs.
- [x] Run strict validation for the 028 root and this child.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Capability check | Synthesized-ledger completeRecall@3 | eval-v2 prod-mode against a live-DB copy |
| Real-data refutation | Real-ledger eval-gate delta | eval-v2 prod-mode against a live-DB copy |
| Intersection trace | Gold set versus ledger-shown universe and strong-negative set | Count of gold ids in the ledger and the strong-negative-above-gold count |
| HVR voice scan | Phase docs | Em-dash, semicolon and Oxford-comma scan |
| Spec validation | This child and the 028 root | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The append-not-displace truncation finding | Internal | Green | No constraint to name the one permitted lever |
| eval-v2 prod-mode completeRecall@3 | Internal | Green | No measurability gate for the prototype or refutation |
| The true_citation_events ledger and the gold set | Internal | Green | No intersection analysis to force the 0.000 refutation |
| Spec-kit validator | Internal | Green | Cannot claim phase validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A claim cites the synthesized-ledger 0.2116 as a real win, or the 0.000 reads as a design failure.
- **Procedure**: Restore the prior doc text for that surface, re-label the 0.2116 as a synthetic capability check, re-trace the 0.000 to the ledger-intersection counts, then re-apply the corrected disposition.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 009 | `../008-new-feature-research-build/spec.md` | The append-not-displace truncation finding is the constraint input |
| 009 | `../before-vs-after.md` | The prod-mode baseline is the deciding evidence baseline |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Design derivation and write-up | Medium | The demote-only Beta-posterior penalty, its asymmetry and its guard |
| Prototype and refutation analysis | Medium | One synthesized-ledger run, one real-data run and the intersection counts |
| Phase documentation | Medium | Five Level-2 docs plus the research.md and the root reconciliation |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep the prior doc text before each reconciliation edit.
- Revert any claim that reads the synthesized-ledger number as a real-traffic win.
- Re-run `validate.sh --strict` on the 028 root after rollback.
<!-- /ANCHOR:enhanced-rollback -->
