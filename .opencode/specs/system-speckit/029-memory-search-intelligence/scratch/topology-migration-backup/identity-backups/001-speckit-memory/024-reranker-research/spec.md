---
title: "Feature Specification: Citation-Ledger Reranker Research"
description: "A 10-iteration deep research on a memory-search reranker. The verdict is CONDITIONAL-GO: a demote-only Beta-posterior penalty is the one recall lever the truncation law permits, the design is sound and prototype-validated to the oracle ceiling, but it earns 0.000 on real data and is blocked on ledger density not algorithm."
trigger_phrases:
  - "028 reranker research"
  - "028 citation ledger reranker"
  - "028 demote only beta posterior penalty"
  - "028 reranker conditional go data blocked"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/024-reranker-research"
    last_updated_at: "2026-07-04T17:51:00.741Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the reranker research phase folder with the CONDITIONAL-GO verdict"
    next_safe_action: "Use this phase as the authoritative reranker research outcome for 028"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-024-reranker-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A reranker is the one recall lever the truncation law permits because it reorders the prod top-3 rather than appending to the cut tail."
      - "The demote-only Beta-posterior design hit the oracle ceiling under a synthesized ledger, proving the mechanism and placement are correct."
      - "The real-data eval-gate delta is 0.000 by construction because the gold set and the strong-negative set do not intersect, so the win is blocked on data not algorithm."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Citation-Ledger Reranker Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-21 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-speckit/029-memory-search-intelligence` |
| **Phase** | 009 of 009 |
| **Phase type** | Research, read-only, no code shipped |
| **Predecessor** | ../008-new-feature-research-build/spec.md |
| **Source decisions** | `research.md`, `../before-vs-after.md`, `../feature-flags.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The new-feature arc closed with a hard architectural finding. The append-not-displace pattern is the only non-regressing way to add content, and prod confidence-truncation cuts the tail before a reader sees it, so any tail-additive feature reads as zero at prod K by construction. That law leaves exactly one recall lever untried. A reranker does not append to the cut tail, it reorders the survivors that already sit inside the prod top-3, so it is the one mechanism the truncation law permits. The campaign needed to know whether a reranker could earn a measured prod win, and whether a demote-only design could do it safely without the citation-emitter's under-counted positives ever fabricating a promotion.

### Purpose
Record the 10-iteration deep research on a citation-ledger reranker. Document the recommended design, the prototype evidence that it hits the oracle ceiling under a synthesized ledger, the dispositive refutation that its real-data eval-gate delta is 0.000 by construction and the earn-it prerequisites that block the win on ledger density and corpus geometry rather than on the algorithm. The verdict is CONDITIONAL-GO. The design is preserved and ready, a measured prod win waits on data.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The CONDITIONAL-GO verdict and why a reranker is the one recall lever the truncation law permits.
- The recommended design: a demote-only, score-mutating, per-memory Beta-posterior penalty placed pre-truncation.
- The prototype evidence: completeRecall@3 moved from 0.0357 to 0.2116 under a synthesized full-coverage ledger, hitting the oracle ceiling exactly.
- The dispositive refutation: the real-data eval-gate delta is 0.000 by construction, with the gold-and-ledger intersection numbers that force it.
- The earn-it prerequisites: real ledger density and a corpus that exhibits the reliable-negative-above-gold geometry.
- The five-layer displacement guard and the flag-off shadow shipping posture.

### Out of Scope
- Shipping the reranker default-on. It ships flag-off shadow only behind a new default-off switch.
- Writing any reranker code. This phase is read-only research, the prototype ran against a live-DB copy and is not committed here.
- Enabling the citation emitter or synthesizing a ledger to manufacture a win.
- Packet 030 and any concurrent-session files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../graph-metadata.json` | Modify | Add 009 to the parent children_ids |
| `../spec.md` | Modify | Add 009 to the phase documentation map |
| `spec.md` | Create | Defines the reranker research scope and the CONDITIONAL-GO disposition |
| `plan.md` | Create | Defines the 10-iteration research method and the verification route |
| `tasks.md` | Create | Records the research and documentation tasks |
| `checklist.md` | Create | Records the verification items |
| `research.md` | Create | Captures the full deep research, design, evidence and prerequisites |
| `implementation-summary.md` | Create | Records the research outcome and its evidence |
| `description.json` | Create | Search metadata for this phase |
| `graph-metadata.json` | Create | Child identity and graph metadata for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The verdict is recorded as CONDITIONAL-GO | The reranker is documented as the one recall lever the truncation law permits, sound and ready but blocked on data |
| REQ-002 | The recommended design is documented | The demote-only, score-mutating, per-memory Beta-posterior penalty, its formula, its asymmetry and its pre-truncation placement are recorded |
| REQ-003 | The dispositive refutation is prominent | The 0.000-by-construction real-data delta and the gold-and-ledger non-intersection numbers are documented as the deciding evidence |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The prototype evidence is recorded | The synthesized-ledger completeRecall@3 move from 0.0357 to 0.2116 hitting the oracle ceiling is documented as a capability check |
| REQ-005 | The earn-it prerequisites are recorded | PREREQ-A ledger density and PREREQ-B corpus geometry are each documented as the block on a measured win |
| REQ-006 | The honest framing holds | The design reads as preserved and ready, the absence of a win reads as a data gap not an algorithm failure |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The CONDITIONAL-GO verdict is documented with the truncation-law reasoning that makes a reranker the one permitted lever.
- The recommended demote-only Beta-posterior design is documented with its formula, its demote-only asymmetry, its pre-truncation placement and its five-layer guard.
- The prototype 0.0357 to 0.2116 oracle-ceiling move under a synthesized ledger is recorded as a capability check.
- The 0.000-by-construction real-data refutation is documented with the gold-and-ledger intersection numbers.
- The earn-it prerequisites are documented as the data and geometry block on a measured win.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/029-memory-search-intelligence --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The synthesized-ledger win reads as a real win | A reader treats the reranker as ship-ready on prod evidence | Frame the 0.2116 as a synthetic capability check and the 0.000 as the real-data deciding evidence |
| Risk | The 0.000 reads as a design failure | A reader discards a sound and ready design | Record the 0.000 as a data-and-geometry gap, the mechanism and placement are proven correct |
| Risk | A demote-only mechanism reads as promotion-capable | A reader fears fabricated promotions from under-counted positives | Record the factor never exceeds 1.0 so the mechanism can only demote, making under-counted positives safe |
| Dependency | eval-v2 prod-mode completeRecall@3 | The prototype and refutation rest on it | The harness ran against a live-DB copy before this phase recorded the outcome |
| Dependency | The append-not-displace truncation finding | It is why a reranker is the one permitted lever | The 008 phase closed that finding before this research opened |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Every claim must trace to a prototype number, a ledger-intersection count or a structural fact, not a hoped-for prod win.
- The synthesized-ledger result must stay labelled as a capability check so it is never re-read as a real-traffic win.
- All docs follow the HVR voice: no em-dashes, no prose semicolons, no Oxford commas, no artifact ids in prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A cold or empty ledger makes every penalty factor 1.0, a true byte-identical no-op. The mechanism is inert until real used and not-used pairs accumulate.
- An under-counted positive from the citation emitter degrades at worst to a weak negative, never a fabricated promotion, because the demote-only factor never exceeds 1.0.
- A movable gold sitting at fused rank 4 to 7 is not a near-tie, so the safety band refuses to touch it even if a strong negative existed above it. The geometry the mechanism can convert does not occur on real data.
- The post-budget reorder seam is inert for completeRecall@3, the same tail-only failure as the held deterministic-multihop and lane-champion-backfill features, so the placement must be pre-truncation and must mutate score not order.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Low | One phase folder plus the root child map and phase map |
| Risk | Low | Read-only research documentation, no code shipped |
| Verification | Medium | Strict validation plus an HVR scan and a trace of every number to the prototype or the ledger counts |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. Whether real ledger density and a reliable-negative-above-gold corpus geometry can ever co-occur at the eval golds' top-3 neighbors is the open question carried into the earn-it prerequisites, deferred out of this phase.
<!-- /ANCHOR:questions -->
