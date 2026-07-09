---
title: "Implementation Plan: Deep Research Uncovered Questions Tracking"
description: "Plan for packet 121 DR-003 uncovered-question tracking."
trigger_phrases:
  - "deep-research"
  - "DR-003"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research/005-uncovered-questions"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented reducer and dashboard contract"
    next_safe_action: "Use commit handoff in implementation-summary.md"
    completion_pct: 100
---
# Implementation Plan: Deep Research Uncovered Questions Tracking

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS, TypeScript tests, shell validation |
| **Framework** | OpenCode deep-research reducer |
| **Storage** | Local research packet JSON and Markdown |
| **Testing** | Vitest, Node syntax check, spec validation |

### Overview
Add a reducer-owned coverage view that computes uncovered strategy questions and surfaces them in both JSON registry state and dashboard Markdown.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 119 roadmap and applicability docs reviewed.
- [x] Reducer and test files read before editing.
- [x] Packet 120 DR-006 sort fix understood.

### Definition of Done
- [x] Reducer computes `uncoveredQuestions`.
- [x] Dashboard renders uncovered questions.
- [x] Two DR-003 tests pass.
- [x] Level 3 packet docs validate strictly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reducer-owned derived state.

### Key Components
- **Strategy parser**: Provides the current strategy question list.
- **Question coverage union**: Normalizes completed iteration `answeredQuestions`.
- **Registry**: Stores `uncoveredQuestions` as a string array.
- **Dashboard renderer**: Reads the registry field and emits an operator section.

### Data Flow
`deep-research-strategy.md` and `deep-research-state.jsonl` feed `buildRegistry`; `buildRegistry` emits `uncoveredQuestions`; `renderDashboard` lists that field.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read roadmap, applicability, reducer, and tests.
- [x] Confirm existing registry and dashboard paths.

### Phase 2: Implementation
- [x] Add normalized completed-answer union.
- [x] Add registry `uncoveredQuestions`.
- [x] Add dashboard `## Uncovered Questions`.
- [x] Add unit tests for partial and full coverage.

### Phase 3: Verification
- [x] Run targeted Vitest.
- [x] Run `node --check`.
- [x] Run packet strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reducer uncovered-question behavior | Vitest |
| Regression | Existing reducer fixture behavior | Vitest |
| Syntax | CommonJS parser check | `node --check` |
| Documentation | Packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 120 DR-006 | Internal | Green | Numeric iteration order already fixed |
| Strategy question anchors | Internal | Green | Reducer parses the question list |
| Vitest in system-spec-kit MCP server | Internal | Green | Targeted reducer tests execute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Registry/dashboard consumers fail on the additive field or tests regress.
- **Procedure**: Revert reducer and test changes for packet 121, then re-run targeted Vitest and `node --check`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Implementation | Medium | 45 minutes |
| Verification | Medium | 30 minutes |
| Documentation | Medium | 45 minutes |
| **Total** | | **140 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Existing tests pass.
- [x] New tests cover the added contract.

### Rollback Procedure
1. Revert `.opencode/skills/deep-research/scripts/reduce-state.cjs`.
2. Revert DR-003 additions in `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`.
3. Re-run targeted Vitest and `node --check`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Existing generated registries can be regenerated by the prior reducer.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Strategy questions + JSONL answers
              |
              v
        buildRegistry()
              |
              v
findings-registry.json + dashboard renderer
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Strategy parser | Strategy anchors | Question list | Registry coverage |
| JSONL records | Iteration append contract | Answer union | Registry coverage |
| Registry | Parser and records | Uncovered list | Dashboard |
| Tests | Fixture packet | Regression evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Reducer coverage computation** - 25 minutes - CRITICAL
2. **Dashboard rendering** - 10 minutes - CRITICAL
3. **Regression tests** - 20 minutes - CRITICAL
4. **Packet validation** - 20 minutes - CRITICAL

**Total Critical Path**: 75 minutes

**Parallel Opportunities**:
- Packet documentation can be authored after the reducer contract is known.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract Added | Registry includes uncovered list | Phase 2 |
| M2 | Dashboard Visible | Dashboard renders count and list | Phase 2 |
| M3 | Verified | Tests and strict validation pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` ADR-001 for the convergence-transparency contract.
