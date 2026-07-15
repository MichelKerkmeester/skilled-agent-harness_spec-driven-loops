---
title: "Implementation Plan: Graduation Follow-Ups Deep Review and Fixes"
description: "The deep-review method and the remediation approach for the 010 graduation follow-ups: ten iterative opus passes loop-until-dry, then flag-gated byte-identical fixes confirmed by independent re-reviews."
trigger_phrases:
  - "follow-up deep review plan"
  - "bitemporal fix plan"
  - "loop-until-dry review method"
  - "remediation approach"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-dark-flag-graduation/008-followup-deep-review"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the review method and the flag-gated remediation approach"
    next_safe_action: "Evidence-gated decision to flip any of the involved defaults on"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/008-followup-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Graduation Follow-Ups Deep Review and Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node |
| **Framework** | system-code-graph, search, advisor, and deep-loop subsystems |
| **Storage** | SQLite via better-sqlite3 |
| **Testing** | Vitest plus opus deep-read re-review |

### Overview
A deep-review-then-fix effort. An opus deep review ran ten iterative passes loop-until-dry over the 010 graduation follow-ups, reading the real code instead of trusting the green cli test pass, and FAILED them on three P0 bitemporal blockers plus eight P1 and four P2. The remediation confirmed each finding against source, then fixed every P0 and P1 and the actionable P2 behind their existing default-off flags. A second batch took seven more recs and follow-ups to completion. Each fix is byte-identical when its flag is off, and three independent re-reviews drove the finding count to zero.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 010 follow-ups committed and reported graduate-ready by the cli pass
- [x] The deep-review lenses and the loop-until-dry stop condition defined
- [x] Each finding mapped to a concrete source site before any fix

### Definition of Done
- [x] Every P0 and P1 and the actionable P2 resolved
- [x] Each fix byte-identical when its flag is off
- [x] An independent re-review returns zero P0 and zero P1
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-first deep review then flag-gated remediation. The review reads the production read and write paths rather than the test fixtures, so it surfaces failure modes the existing tests never exercised. Each fix reads its flag once and keeps the original statement on the off branch, so byte identity is the proof the default-off behavior did not move.

### Key Components
- **Deep-review record**: the FAIL verdict, the fifteen findings by severity, the per-cluster readiness, and the re-review outcomes
- **Bitemporal P0 fixes**: close-not-delete in `replaceNodes` and `pruneDanglingEdges`, the live-reader `invalid_at IS NULL` filter, and the generation-stamp correction
- **Conditional P1 fixes**: the budget-trim primary-row reservation, the advisor alias guard, the lag metric, and the real-reindex integration test
- **Second-batch fixes**: the ensure-ready bump, the lineage validity stamp, the as-of query surface, the degree-cap-15 evidence, the stall detector, and the title-aware dedup gate

### Data Flow
The review drives ten passes with rotating lenses, accumulating findings until a pass adds none. Each finding is confirmed against the real source site, then fixed under its existing flag. A re-review reads the committed fixes and re-scores, looping until it finds nothing actionable. The record captures every verdict so the readiness claim rests on evidence, not on a single green test run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Define the review lenses and the loop-until-dry stop condition
- [x] Point the review at the production read and write paths, not the fixtures
- [x] Capture the entry state, a green cli pass reported graduate-ready

### Phase 2: Core Implementation
- [x] Run ten opus passes, record the FAIL verdict and the fifteen findings
- [x] Fix the three P0 bitemporal blockers under the flag
- [x] Fix the conditional P1 (budget-trim, advisor alias, lag metric, real-reindex test)
- [x] Ship the second batch of seven recs and follow-ups under their flags

### Phase 3: Verification
- [x] Confirm each fix byte-identical when its flag is off
- [x] Re-review against the committed code until zero P0 and zero P1
- [x] Confirm the third re-review at zero findings for the second batch
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deep read | Production read and write paths across four subsystems | Opus loop-until-dry passes |
| Unit | Flag-off byte identity for every fix | Vitest |
| Integration | The real two-scan reindex as-of round trip | Vitest |
| Re-review | The committed fixes re-scored to zero findings | Opus re-review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The existing default-off flags | Internal | Green | No gated surface to fix behind |
| The committed 010 follow-ups | Internal | Green | Nothing to review |
| Opus deep-read capacity | Internal | Green | No independent re-review |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A bitemporal fix corrupts live reads, or a re-review reopens a finding
- **Procedure**:
  1. Every flag is off by default, so live behavior is unchanged without any action
  2. Revert the source edits in the affected subsystem
  3. Re-run the flag-off byte-identity tests and the subsystem suite
<!-- /ANCHOR:rollback -->
