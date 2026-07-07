---
title: "Feature Specification: Deep Research Uncovered Questions Tracking"
description: "Packet 121 adds reducer-owned uncovered-question tracking for deep-research dashboards."
trigger_phrases:
  - "deep-research"
  - "uncovered questions"
  - "DR-003"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/004-deep-research/005-uncovered-questions"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented uncovered question tracking"
    next_safe_action: "Use commit handoff in implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts"
    completion_pct: 100
---
# Feature Specification: Deep Research Uncovered Questions Tracking

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 121 closes DR-003 from the 119 uplift roadmap by adding a reducer-owned `uncoveredQuestions` field to the deep-research findings registry and dashboard. The contract is additive: compute uncovered questions from the strategy question list minus the union of iteration `answeredQuestions`.

**Key Decision**: Use computed coverage instead of requiring manual explicit marking.

**Critical Dependencies**: Existing reducer state parsing, strategy question parsing, and targeted reducer Vitest coverage.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-research convergence references use question coverage as a saturation signal, but the operator dashboard did not show which questions remained uncovered. Operators could see an open count but not the concrete missing questions, which made stuck convergence harder to debug.

### Purpose
Expose uncovered questions as reducer-owned state so the registry and dashboard make convergence gaps inspectable after every reducer pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `uncoveredQuestions: string[]` to the reducer registry output.
- Persist that field to `research/findings-registry.json`.
- Render a dashboard `## Uncovered Questions` section with count and list.
- Add targeted reducer unit tests for partial and complete question coverage.
- Document the convergence-transparency contract in ADR-001.

### Out of Scope
- Changing legal-stop gate math.
- Renaming the canonical `findings-registry.json` artifact.
- Changing iteration JSONL schema.
- Changing deep-research workflow dispatch behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Modify | Compute and render uncovered questions |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Add DR-003 regression coverage |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research/005-uncovered-questions/*` | Create | Level 3 packet documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Registry exposes uncovered questions | `registry.uncoveredQuestions` is a string array |
| REQ-002 | Computation follows DR-003 contract | Strategy questions minus completed-iteration answered union |
| REQ-003 | Dashboard renders uncovered section | Generated dashboard includes `## Uncovered Questions` |
| REQ-004 | Existing reducer tests remain green | Targeted Vitest passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Partial coverage is tested | Three strategy questions with two answered yields one uncovered |
| REQ-006 | Full coverage is tested | All answered yields empty uncovered list |
| REQ-007 | ADR documents the contract | ADR-001 includes alternatives, five checks, and no-migration note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Registry JSON includes `uncoveredQuestions`.
- **SC-002**: Dashboard shows the uncovered-question section with count and list.
- **SC-003**: Targeted Vitest passes with existing and new reducer tests.
- **SC-004**: `node --check` passes for `reduce-state.cjs`.
- **SC-005**: Packet strict validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate registry concepts | Medium | Keep existing object-shaped `openQuestions`; add string-only `uncoveredQuestions` for dashboard/debugging |
| Risk | Non-complete iteration statuses | Medium | Count evidence-producing iteration statuses while excluding error, stuck, failed, and thought records |
| Dependency | Existing strategy anchors | High | Reuse `parseStrategyQuestions` and avoid strategy schema changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Computation remains linear in questions plus iteration answer records.

### Security
- **NFR-S01**: No secrets or user data are introduced; reducer only derives from existing packet state.

### Reliability
- **NFR-R01**: Repeated reducer runs remain idempotent.
- **NFR-R02**: Missing or malformed `answeredQuestions` arrays are ignored safely.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty strategy question list returns an empty uncovered list.
- Duplicate answered question strings collapse through normalized set membership.
- Checked strategy questions are treated as resolved.

### Error Scenarios
- Error, failed, stuck, and thought iteration statuses do not advance question coverage.
- Null `answeredQuestions` values do not crash the reducer.

### State Transitions
- A later complete iteration can reduce uncovered questions to zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Reducer, dashboard rendering, tests, docs |
| Risk | 14/25 | Operator-facing state contract, additive JSON field |
| Research | 10/20 | Roadmap and applicability docs reviewed |
| Multi-Agent | 0/15 | LEAF only, no sub-dispatch |
| Coordination | 6/15 | Bundled with packet 122 but independent implementation |
| **Total** | **45/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Dashboard field drifts from registry | M | L | Render directly from registry field |
| R-002 | Coverage logic counts failed iterations | M | L | Exclude non-evidence statuses |
| R-003 | Registry consumers assume old schema only | L | L | Additive field, no removals |

---

## 11. USER STORIES

### US-001: Operator Sees Remaining Questions (Priority: P1)

**As a** deep-research operator, **I want** the dashboard to list uncovered questions, **so that** I can target the next iteration instead of inferring from counts.

**Acceptance Criteria**:
1. **Given** three strategy questions and two answered records, **When** the reducer runs, **Then** the dashboard lists exactly the remaining question.

### US-002: Completed Coverage Is Obvious (Priority: P1)

**As a** deep-research operator, **I want** a zero uncovered count when all questions are answered, **so that** convergence is transparent.

**Acceptance Criteria**:
1. **Given** every strategy question appears in completed iteration answers, **When** the reducer runs, **Then** `uncoveredQuestions` is empty.

---

## 12. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
