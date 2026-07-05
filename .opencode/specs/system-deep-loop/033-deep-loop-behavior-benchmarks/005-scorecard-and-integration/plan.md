---
title: "Implementation Plan: Cross-Skill Scorecard & Integration"
description: "Aggregate all rounds into the 5-mode x 3-executor scorecard (bucket histograms, per-checkpoint latency ratios, dimension means), confirm or refute packet 031's headline findings per mode, rank a remediation backlog, and wire discoverability pointers into all five sub-skills."
trigger_phrases:
  - "implementation"
  - "plan"
  - "behavior benchmark scorecard"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks/005-scorecard-and-integration"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase plan authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phases 003 and 004 must complete first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-005-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cross-Skill Scorecard & Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario contracts / analysis docs + the phase-001 runner |
| **Framework** | Calibrated framework reference (phase 002 retro) |
| **Storage** | Packages in the sub-skill folders; run evidence + analysis in this phase folder |
| **Testing** | Runner-enforced isolation + contract-schema conformance + strict spec validation |

### Overview

Close the program: aggregate every scored run from phases 002-004 into one cross-skill scorecard (5 modes x 3 executors), analyze per-checkpoint latency ratios and bucket distributions, and explicitly confirm or refute packet 031's three headline findings per mode (3-10x latency gap, role-absorption risk, inconsistent Command-only routing discipline). Confirmed behavioral defects become a ranked remediation backlog for future packets -- this phase fixes nothing itself. Finally, add README/SKILL.md pointers in all five sub-skills so the packages are discoverable, and run the full-packet strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor gate passed (Phases 003 and 004).
- [ ] cli-opencode SKILL.md read in the executing session (for phases dispatching GPT legs).

### Definition of Done
- [ ] This phase's success criteria (spec.md SC-001..SC-004) met with evidence.
- [ ] `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contract-first scenario execution over the shared runner (or evidence-first aggregation, for the closing phase); contract/evidence separation throughout.

### Key Components

- Scenario contracts / analysis docs per this phase's scope (see spec.md).
- The phase-001 runner + framework reference as the only measurement substrate.
- Run evidence (result JSON + transcript per run) in this folder.

### Data Flow

Contract -> runner (leg) -> result JSON -> per-mode scorecard -> (phase 005) cross-skill aggregation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm predecessor gate; verify fixture restore for this phase's targets.

### Phase 2: Core Implementation
- [ ] T002 Aggregate all phase 002-004 result JSONs into the cross-skill scorecard (matrix, histograms, ratios, means).
- [ ] T003 Author per-mode confirm/refute verdicts against packet 031's headline findings.
- [ ] T004 Author the ranked remediation backlog with run-ID evidence.
- [ ] T005 [P] Add README/SKILL.md discoverability pointers in all five sub-skills.

### Phase 3: Verification
- [ ] T006 Verify no unmeasured cells (or explicit quarantines); spot-check 10% of scorecard claims against raw result JSONs.
- [ ] T007 Full-packet `validate.sh --strict`; comment-hygiene/alignment-drift sweep on any touched code surfaces.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live benchmark runs / aggregation checks | Per spec.md scope | Phase-001 runner / result-JSON schema |
| Spec | Phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phases 003 and 004 | Predecessor | Pending | Hard blocker |
| Phase-001 runner + fixtures | Infrastructure | Pending | No measurement substrate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This phase's outputs prove unusable or the program halts.
- **Procedure**: Delete this phase's additive package directories / analysis docs; run evidence stays as the record.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Predecessor phase gate | Core |
| Core | Setup | Verify |
| Verify | Core | Next program phase |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small |
| Core Implementation | Medium | Medium |
| Verification | Low-Medium | Small-Medium |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture-isolation assertion active before any live run this phase performs.
- [ ] All outputs land in additive-only locations (package dirs, this phase folder).

### Rollback Procedure
1. Delete this phase's additive package directories / analysis docs.
2. Run evidence in this folder remains as the record.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Directory/file deletion only.
<!-- /ANCHOR:enhanced-rollback -->

---
