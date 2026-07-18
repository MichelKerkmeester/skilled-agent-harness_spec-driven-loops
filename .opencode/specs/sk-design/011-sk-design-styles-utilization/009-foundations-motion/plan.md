---
title: "Implementation Plan: foundations + motion styles-library wiring (Phase C)"
description: "Wire design-foundations (typed compatibility graph + relationship blueprint + transformation ledger) and design-motion (restraint-gated polarity-aware evidence) to the styles library through the phase-007 seam, reusing the Phase 008 pilot proof patterns. Planned scaffold only."
trigger_phrases:
  - "foundations motion wiring plan"
  - "compatibility graph plan"
  - "restraint gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/009-foundations-motion"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the foundations-motion L3 scaffold"
    next_safe_action: "Build the phase-007 seam wiring for foundations then motion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-found-motion-011-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: foundations + motion styles-library wiring (Phase C)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-design/{design-foundations,design-motion}/` mode dirs |
| **Seam** | Phase 007 shared contract seam (consumed, not built) |
| **Retrieval** | Phase 004 substrate (reused) |
| **Patterns** | Phase 008 interface/audit pilot proof + provenance + fallback fixtures |

### Overview
Two parallel mode workstreams consume the phase-007 seam: foundations builds a typed compatibility graph plus a relationship blueprint and transformation ledger; motion adds a restraint-first gate ahead of polarity-aware eligibility with hard negatives. Corpus evidence stays reference-only under the fixed authority order settled in 003. This is a planned scaffold; nothing in the mode runtimes is built yet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 007 seam contract is stable enough to consume
- [ ] Phase 008 proof/provenance/fallback fixtures are published
- [ ] Success criteria in spec.md are measurable

### Definition of Done
- [ ] Foundations emits typed edges + transformation ledger, never averaged tokens
- [ ] Motion runs the restraint gate before retrieval and blocks hard-negative false positives
- [ ] Corpus reference-only authority order holds for both modes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mode-owned evidence consumers over a shared seam: each mode reads corpus evidence through the phase-007 envelope and applies its own typed contract, never a shared flattened consumer.

### Key Components
- **Foundations compatibility graph**: typed dependency edges ("work together / conflict") over 1 coherent style + max 3 axis owners.
- **Foundations transformation ledger**: records source → relationship → transformation → lock, plus downstream `not-assessed` checks.
- **Motion restraint gate**: a "should this move at all?" query that resolves before any retrieval.
- **Motion polarity-aware eligibility**: hard negatives, purpose/state archetypes, and negative baselines.

### Data Flow
Foundations: token set → seam envelope → typed edges → blueprint + ledger → `not-assessed` surfacing. Motion: target → restraint gate → (if move) retrieval → polarity-aware eligibility with hard negatives → archetype match, else no-motion verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-foundations/**` | mode contract (no library path) | Create (proposed) — typed graph + blueprint + ledger | scaffold; edges typed, no averaging present |
| `design-motion/**` | mode contract (no library path) | Create (proposed) — restraint gate + eligibility | scaffold; gate precedes retrieval, hard negatives blocked |
| Phase 007 seam | shared envelope | unchanged (consumed) | seam fields referenced, not redefined |
| Phase 004 retrieval | substrate | unchanged (reused) | no second retriever added |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phase-007 seam contract and the phase-008 fixtures are consumable
- [ ] Fix the foundations and motion contract shapes against the 003 Phase C recommendations

### Phase 2: Core Implementation
- [ ] Build the foundations typed compatibility graph + relationship blueprint (proposed additions under `design-foundations/`)
- [ ] Build the foundations transformation ledger + `not-assessed` downstream checks
- [ ] Build the motion restraint-first query gate ahead of retrieval (proposed additions under `design-motion/`)
- [ ] Build motion polarity-aware eligibility with hard negatives, archetypes, and negative baselines

### Phase 3: Verification
- [ ] Verify foundations never emits averaged/interpolated tokens or co-presence compatibility
- [ ] Verify motion blocks hard-negative false positives and gates before retrieval
- [ ] Verify corpus reference-only authority order for both modes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | typed-edge builder, restraint gate, hard-negative ranker | mode test harness |
| Integration | seam envelope consumption end-to-end per mode | fixtures from 007/008 |
| Manual | authority-order + negative-result surfacing spot checks | reviewer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 shared seam | Internal | Pending | No envelope to consume; foundations + motion blocked |
| Phase 004 retrieval | Internal | Pending | Motion retrieval path unavailable |
| Phase 008 pilot patterns | Internal | Pending | No proven proof/provenance fixtures to reuse |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Averaging leaks into foundations, false-positive motion appears, or an authority-order violation ships.
- **Procedure**: Revert the proposed additions under `design-foundations/` and `design-motion/`; the seam (007) and retrieval (004) are untouched, so no shared surface needs unwinding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 004 (retrieval) ─┐
Phase 007 (seam) ──────┼──► Phase C: 009 foundations ─┐
Phase 008 (pilots) ────┘                  009 motion ──┴──► 010 transport
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 009 foundations | 004, 007, 008 | 010 |
| 009 motion | 004, 007, 008 | 010 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Foundations | High | 10-17 days |
| Motion | High | 9-16 days |
| **Total** | | **19-33 days (overlap expected)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Proposed additions isolated to the two mode dirs
- [ ] Seam and retrieval surfaces confirmed untouched

### Rollback Procedure
1. Remove the proposed `design-foundations/` and `design-motion/` additions
2. Confirm 004 and 007 surfaces are unchanged
3. Re-run the parent recursive validation

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  004 / 007  │────►│ 009 found.  │────►│  010 xport  │
│  008 fixt.  │     │ 009 motion  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Foundations graph | 007 seam | typed edges + ledger | 010 |
| Motion gate | 007 seam, 004 | restraint verdict + eligibility | 010 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 007 seam consumable** - blocking - CRITICAL
2. **Foundations typed graph + ledger** - 10-17 days - CRITICAL
3. **Motion restraint gate + eligibility** - 9-16 days - CRITICAL

**Total Critical Path**: 19-33 days (foundations and motion overlap heavily on shared fixtures)

**Parallel Opportunities**:
- Foundations and motion contract-shaping can run simultaneously once the seam is fixed
- Negative-baseline and fixture reuse work can run after Phase 008 publishes patterns
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Seam + fixtures consumable | 007/008 outputs referenced | Start of Phase C |
| M2 | Foundations graph shipped | typed edges, no averaging | Mid Phase C |
| M3 | Motion gate shipped | restraint precedes retrieval | End Phase C |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for ADR-001 (typed edges over scalar averaging) and ADR-002 (restraint gate before retrieval).

---

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Parent**: `../spec.md`
