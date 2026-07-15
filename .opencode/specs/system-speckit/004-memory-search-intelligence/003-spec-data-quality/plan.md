---
title: "Implementation Plan: Spec-Kit Data Quality by Default"
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality"
    last_updated_at: "2026-07-12T12:17:12Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled parent governance truth after topology migration"
    next_safe_action: "Resolve CHK-050/051, obtain sign-offs, then rerun reviews and strict validation"
    blockers:
      - "CHK-050 and CHK-051 lack current completion evidence"
      - "Three governance sign-offs and two fresh independent reviews remain open"
    key_files:
      - "system-speckit/004-memory-search-intelligence/003-spec-data-quality/checklist.md"
      - "system-speckit/004-memory-search-intelligence/scratch/task-30c-data-quality-truth.md"
    session_dedup:
      fingerprint: "sha256:a13d79278b8e7546f3edb041b539b5aa0a91ec037e7cd0e86fb96918be7acc04"
      session_id: "031-stage-0-init"
      parent_session_id: null
    completion_pct: 91
    open_questions:
      - "When current evidence for CHK-050 and CHK-051 and all sign-offs will be available"
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
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)

The research deliverables are historical completed evidence. Current parent governance remains **In Progress** until CHK-050/051 have current evidence, all three sign-offs are recorded, two fresh independent reviews complete and strict validation is rerun without blocking findings.
<!-- /ANCHOR:quality-gates -->

---

## AI Execution Protocol

### Pre-Task Checklist

Before changing parent governance docs, confirm the allowed file list, read the current checklist and continuity state, identify the exact validator finding being addressed and verify that every proposed completion claim has existing evidence.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope | Write only to the explicitly allowed parent documents and evidence ledger |
| Sequence | Read current sources, apply the smallest truthful edit, then rerun the targeted validator |
| Evidence | Keep a completed item checked only when a substantive path, command result or numeric outcome supports it |
| History | Preserve dated former IDs and delivery claims as provenance while using canonical paths for current navigation |
| Governance | Keep unresolved checks and sign-offs open; never change state merely to obtain a passing result |

### Status Reporting Format

Report the files changed, evidence-marker count, AI protocol result, checklist arithmetic, validator exit code, remaining warnings and parent-agent follow-up. Distinguish current results from historical evidence.

### Blocked Task Protocol

If evidence is missing, uncheck the unsupported item and update the affected arithmetic. If the fix requires an out-of-scope file, generated metadata, continuity regeneration or an independent approval, stop that part, record the blocker in `scratch/task-30c-data-quality-truth.md` and return it to the parent agent.

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
- [x] Packet created at Level 3
- [x] Stage 0 brief recorded
- [ ] Research index points at the brief - current `research/research.md` does not link `research/stage-0-external-findings.md`

### Phase 2: Core Research
- [x] Verify each ranked candidate against the spec-kit corpus
- [x] Separate robust signals from corpus-specific ones
- [x] Flag every vendor-only claim

### Phase 3: Verification
- [ ] Strict validation passes
- [ ] HVR voice holds across the docs
- [x] Candidate verdict ready for a build packet
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
