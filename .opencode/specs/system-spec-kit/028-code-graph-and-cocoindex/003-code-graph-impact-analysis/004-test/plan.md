---
title: "Implementation Plan: 027/004/004 Impact Analysis Tests"
description: "Plan for Vitest correctness fixtures for impact analysis."
trigger_phrases:
  - "027 004 004 test plan"
  - "impact tests plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 004-test"
    next_safe_action: "Implement this child phase when its dependencies are available"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/004/004 Impact Analysis Tests

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Vitest |
| **Testing Target** | `code-graph-impact-analysis.vitest.ts` |

This child turns the pt-02 correctness findings into executable fixtures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-contract` is available.
- [ ] Expected output semantics are stable.

### Definition of Done
- [ ] Fixtures cover aggregation, coverage, traversal, and provider-none behavior.
- [ ] Test command passes.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small graph fixture database or helper-backed in-memory fixtures with public-output assertions.

### Key Components
- Aggregation fixture.
- TESTED_BY direction fixture.
- BFS depth/cycle fixture.
- Provider-none fixture.

### Data Flow
Fixture graph data feeds `analyzeImpact()`, and assertions inspect contract-shaped output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract and analyzer.
- [ ] Build fixture helpers.

### Phase 2: Core Fixtures
- [ ] Add aggregation tests.
- [ ] Add coverage tests.
- [ ] Add traversal tests.
- [ ] Add provider-none tests.

### Phase 3: Verification
- [ ] Run target Vitest file.
- [ ] Run coverage if required by implementation phase.
- [ ] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Analyzer output semantics | Vitest |
| Coverage | Line coverage for new analyzer | Vitest coverage |
| Validation | Child packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Internal child | Pending | Test output expectations can drift. |
| `002-lib-impl` | Internal child | Pending | Runtime fixtures cannot pass until analyzer exists. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the fixture file and re-run the remaining test suite.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Core Fixtures |
| Core Fixtures | Setup, `002-lib-impl` | Verification |
| Verification | Core Fixtures | Release readiness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Fixtures | Medium | 1.5-2 hours |
| Verification | Medium | 45 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migration is involved. Revert fixture additions and re-run checks.
<!-- /ANCHOR:enhanced-rollback -->
