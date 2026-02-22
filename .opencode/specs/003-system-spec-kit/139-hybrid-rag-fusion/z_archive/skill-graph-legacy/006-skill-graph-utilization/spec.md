# Feature Specification: Skill Graph Utilization Testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-20 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `005-install-guide-alignment` |
| **Successor** | `007-skill-graph-improvement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Skill Graph system (002-skill-graph-integration + 003-unified-graph-intelligence) is fully implemented with 73 nodes across 9 skills, a SGQS query engine, and 7 intelligence amplification patterns. However, no real-world utilization testing has been performed to validate whether the graph actually helps developers in realistic scenarios. Without evidence from representative developer personas, the graph's practical value remains unverified.

### Purpose

Validate that the skill graph delivers measurable value to developers by testing 5 personas across 20 scenarios with scored results, targeting an aggregate score of 3.0 or higher (Adequate tier).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Test harness script that wraps SGQS CLI and outputs structured JSON results
- 5 persona test suites: Git, Frontend, Docs, Full-Stack, QA
- Scoring rubric (0–5 scale) applied per scenario
- Utilization report aggregating all persona results with cross-cutting metrics

### Out of Scope

- Modifying the skill graph itself — this is a read-only testing exercise
- Adding new nodes to the graph — graph structure is frozen during this test
- Changing the SGQS engine — engine behaviour is the subject under test, not a variable

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-skill-graph-utilization/scratch/test-harness.sh` | Create | CLI test harness wrapping SGQS queries |
| `006-skill-graph-utilization/scratch/results-git.json` | Create | Scored results for Git persona |
| `006-skill-graph-utilization/scratch/results-frontend.json` | Create | Scored results for Frontend persona |
| `006-skill-graph-utilization/scratch/results-docs.json` | Create | Scored results for Docs persona |
| `006-skill-graph-utilization/scratch/results-fullstack.json` | Create | Scored results for Full-Stack persona |
| `006-skill-graph-utilization/scratch/results-qa.json` | Create | Scored results for QA persona |
| `006-skill-graph-utilization/scratch/utilization-report.md` | Create | Aggregated report with metrics and assessment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Test harness executes SGQS queries and outputs JSON | Harness script runs without error and produces valid JSON output for all query inputs |
| REQ-002 | All 5 persona agents complete with scored results | Each persona test suite returns scored results on the 0–5 scale for every scenario |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Aggregate score computed with assessment tier | Utilization report includes overall score and tier label (e.g., Adequate, Good, Excellent) |
| REQ-004 | Cross-cutting metrics evaluated against targets | Report includes error resilience, query coverage, and response quality metrics with pass/fail |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Aggregate score across all 5 personas is >= 3.0 (Adequate tier or higher)
- **SC-002**: Error resilience rate is 100% — no unhandled SGQS query failures across all 20 scenarios
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SGQS query engine (`skill_advisor.py`, graph index) | Harness cannot run without a working SGQS CLI | Validate engine is operational before dispatching persona agents |
| Risk | SGQS query syntax errors in harness script | Med — causes partial or failed test runs | Implement structured error handling in the harness; capture stderr and surface in results JSON |
| Risk | Persona scenario coverage gaps | Low — some skill areas may be untested | Define at least 4 scenarios per persona before execution begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are there specific SGQS query patterns known to be fragile that should be tested explicitly?
- Should the scoring rubric weight any persona more heavily for the aggregate calculation?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---

## Acceptance Scenarios

1. Five persona result files are generated with >=4 scenarios each.
2. Aggregate utilization score and resilience metrics are reported in scratch artifacts.

## Acceptance Scenario Details

- **Given** persona benchmark scenarios, **When** harness runs, **Then** per-persona result files are generated.
- **Given** all persona outputs, **When** synthesis runs, **Then** aggregate score and resilience metrics are reported.
