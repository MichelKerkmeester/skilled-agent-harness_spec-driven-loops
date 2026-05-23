---
title: "Implementation Plan: 116/005 — Search Ledger Persistence and Reporting"
description: "Level 3 plan for reducer-owned search ledger state and reporting."
trigger_phrases:
  - "116 search ledger persistence plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/005-search-ledger-persistence-and-reporting"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented reducer search ledger persistence and reporting surface."
    next_safe_action: "Run final validation and use bundled commit handoff."
---
# Implementation Plan: 116/005 — Search Ledger Persistence and Reporting

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Extend the reducer registry and operator-facing outputs so v2 search-ledger rows survive past validation. Search debt becomes durable state, dashboard visibility, and final report guidance.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:effort -->
## 1.1 EFFORT ESTIMATE

| Area | Estimate |
|------|----------|
| Reducer aggregation | Medium |
| Dashboard rendering | Small |
| YAML report compiler updates | Small |
| Level 3 documentation | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] Reducer file read before modification.
- [x] Phase 004 validator output shape understood.
- [x] Workflow report compiler sections read.
- [x] Forbidden Phase F/G surfaces avoided.
- [ ] Targeted reducer fixture passes.
- [ ] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The reducer stays the single writer for review registry and dashboard state. It scans v2 iteration records, normalizes ledger rows, and returns zero-shape fields for legacy rows:

```text
deep-review-state.jsonl
  -> buildRegistry()
       -> buildSearchLedgerState()
            candidateCoverage
            searchDebt
            ruledOutCandidates
            cleanSearchProof
            searchCoverage
  -> renderDashboard()
  -> review-report compiler instructions
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read reducer registry return shape.
- [x] Read dashboard verdict and Active Risks rendering.
- [x] Read report compiler YAML.

### Phase 2: Reducer Registry Shape
- [x] Add `buildSearchLedgerState`.
- [x] Aggregate `candidateCoverage`.
- [x] Aggregate `searchDebt`, `ruledOutCandidates`, and `cleanSearchProof`.
- [x] Preserve latest `searchCoverage`.

### Phase 3: Dashboard Verdict and Rendering
- [x] Downgrade PASS to CONDITIONAL when `searchDebt.length > 0`.
- [x] Add `hasSearchDebt` status line.
- [x] Add Search Debt section before Active Risks.
- [x] Add active-risk line for search-debt obligations.

### Phase 4: Report Compiler Instructions
- [x] Add Search Ledger section to auto YAML.
- [x] Mirror Search Ledger section in confirm YAML.
- [x] Require legacy empty-state note.

### Phase 5: Verification
- [ ] Run fixture and regression commands.
- [ ] Run strict validation for 005.
- [ ] Record evidence in checklist and implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Fixture | v2 reducer fields | `pnpm vitest run --no-coverage review-depth-validator review-depth-reducer` |
| Regression | Existing validator behavior | `pnpm vitest run --no-coverage post-dispatch-validate` |
| Prompt | Prompt-pack contract | `pnpm vitest run --no-coverage prompt-pack` |
| Spec | Level 3 compliance | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../005-search-ledger-persistence-and-reporting --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 validator | Runtime contract | Complete in bundle | Reducer may receive invalid v2 rows. |
| Phase 003 state schema | Schema contract | Complete | Field names/enums drift. |
| Phase 006 STOP gates | Future consumer | Planned | Search debt is visible but not yet blocking STOP. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert reducer aggregation/rendering and YAML Search Ledger instructions. New registry fields are additive, so rollback does not require data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK PLAN

Rollback is file-scoped: remove `buildSearchLedgerState`, dashboard Search Debt rendering, `hasSearchDebt` status output, and report compiler Search Ledger instructions. Since the registry additions are derived from JSONL input, no stored review state needs migration.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Reducer Registry -> Dashboard -> Report Compiler -> Verification
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
003 schema contract -> 004 validator -> 005 reducer registry -> 006 STOP gates
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Registry | New fields exist with v1 zero-shape behavior. |
| M2 Dashboard | Search debt affects verdict and renders before Active Risks. |
| M3 Report | Search Ledger section is required before appendix. |
| M4 Verification | Fixture, regression, prompt, and spec validation commands pass. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Registry shape is the critical path. Report text alone cannot feed Phase F convergence gates, and graph vocabulary in Phase G should project ledger-owned semantics rather than invent separate state.
<!-- /ANCHOR:critical-path -->
