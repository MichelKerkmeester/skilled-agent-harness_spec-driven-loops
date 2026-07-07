---
title: "Implementation Plan: Spec-Kit Data Quality by Default [template:level_3/plan.md]"
description: "Research plan that turns the Stage 0 external sweep into a ranked, by-angle deep-research loop on spec-kit data quality."
trigger_phrases:
  - "spec data quality plan"
  - "research loop plan"
  - "by angle research"
  - "ranked candidates"
  - "data quality default"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality"
    last_updated_at: "2026-07-04T17:11:44.982Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the research loop to convergence and scaffolded the 28 phase children"
    next_safe_action: "Build 026 the shared safe-fix engine, then 004 the schema gate"
    blockers: []
    key_files:
      - "research/stage-0-external-findings.md"
    session_dedup:
      fingerprint: "sha256:a13d79278b8e7546f3edb041b539b5aa0a91ec037e7cd0e86fb96918be7acc04"
      session_id: "031-stage-0-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Spec-Kit Data Quality by Default

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research docs, JSON metadata |
| **Framework** | Spec-kit templates and validate.sh |
| **Storage** | Spec-memory index, the two metadata JSONs |
| **Testing** | validate.sh strict, HVR voice check |

### Overview
This plan runs a research-first loop. Stage 0 already captured the external sweep. The remaining work ranks each candidate against the spec-kit corpus and writes a verdict the schema and index work can act on.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research loop, evidence-first

### Key Components
- **Stage 0 brief**: the external sweep that seeds the loop
- **By-angle loop**: per-angle verification of the ranked candidates against the corpus

### Data Flow
External sources feed the Stage 0 brief, the brief feeds the ranked candidates and the loop turns each candidate into a corpus-verified verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a research packet, not a fix. No producer, consumer or policy surface changes here. The candidate verdicts name the surfaces a later build packet would touch.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| metadata JSON schemas | hold per-packet metadata | not a consumer in this packet | deferred to build packet |
| spec-memory index | embeds and retrieves spec docs | not a consumer in this packet | deferred to build packet |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Packet created at Level 3
- [ ] Stage 0 brief recorded
- [ ] Research index points at the brief

### Phase 2: Core Research
- [ ] Verify each ranked candidate against the spec-kit corpus
- [ ] Separate robust signals from corpus-specific ones
- [ ] Flag every vendor-only claim

### Phase 3: Verification
- [ ] Strict validation passes
- [ ] HVR voice holds across the docs
- [ ] Candidate verdict ready for a build packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-doc structure and anchors | validate.sh |
| Integration | Whole-packet strict pass | validate.sh --strict |
| Manual | HVR voice and source preservation | reviewer read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec-memory index | Internal | Green | Retrieval candidates cannot be measured |
| Metadata JSON schemas | Internal | Green | Metadata candidates cannot be wired later |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The research direction is rejected
- **Procedure**: Archive the packet. No live system changed because this packet is research only
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Research) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Research |
| Research | Setup | Verify |
| Verify | Research | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Research | High | one loop run |
| Verification | Low | 1 hour |
| **Total** | | **one research loop plus review** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No live system touched
- [ ] No metadata schema changed
- [ ] No commit made by this agent

### Rollback Procedure
1. Archive the packet under z_archive if the direction is dropped
2. Leave the spec-memory index untouched
3. Note the decision in the orchestrator log

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │  Research   │     │   Verify    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Stage 0 brief | external sweep | seven angles plus ranked candidates | by-angle loop |
| By-angle loop | Stage 0 brief | corpus-verified verdicts | build packet |
| Verdict | by-angle loop | adoption decision | none |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Stage 0 brief recorded** - done - CRITICAL
2. **By-angle verification loop** - one loop run - CRITICAL
3. **Candidate verdict** - short - CRITICAL

**Total Critical Path**: one research loop plus review

**Parallel Opportunities**:
- The seven angles can run as parallel research seats
- Vendor-claim verification can run alongside the retrieval angle
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Stage 0 recorded | Brief holds all angles and ranked candidates | done |
| M2 | Loop complete | Each candidate has a corpus verdict | after loop |
| M3 | Verdict ready | Adoption decision documented | after review |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Research before build

**Status**: Accepted

**Context**: The data-quality levers carry real cost and some rest on vendor-only claims.

**Decision**: Run a research loop and rank candidates by external evidence before any build.

**Consequences**:
- The build packet starts from verified evidence
- The research phase adds time before any code lands

**Alternatives Rejected**:
- Build the highest-ranked candidate directly: rejected because vendor-only and corpus-specific claims need verification first
