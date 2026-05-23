---
title: "Feature Specification: deep-review reducer-cluster backlog remediation (002)"
description: "Reopen ADR-002 to make 5 behavioral changes to reduce-state.cjs (LG-0001/0005/0006/0008/0033) with vitest coverage, and formally document the 4 by-design reducer gaps (LG-0002/0003/0004/0023)."
trigger_phrases:
  - "reducer cluster remediation"
  - "reduce-state.cjs behavioral changes"
  - "deep-review reducer backlog"
  - "ADR-002 reopening"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/007-deep-review-phase5-backlog/002-reducer-cluster-remediation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "spec-authored"
    next_safe_action: "implement-LG-0001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000007002"
      session_id: "131-000-007-002-reducer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator chose 'implement all 5 enhancements' (full ADR-002 reversal) over safe-subset or document-only"
      - "5 genuinely-open reducer gaps: LG-0001/0005/0006/0008/0033"
      - "4 by-design reducer gaps documented with rationale: LG-0002/0003/0004/0023"
      - "content_hash IS a documented contract (SKILL.md 8.1 line 538) that the reducer was not honoring"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-review reducer-cluster backlog remediation

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
| **Parent Packet** | `skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/007-deep-review-phase5-backlog` |
| **Origin** | `003-deep-review` phase-5 deferred backlog, reducer-behavior gaps fenced off by ADR-002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `003-deep-review` packet deferred all reducer-behavior gaps under ADR-002 (the reducer was bug-scan only in that packet). The `007` parent reopens that decision per operator directive. Each of the 9 deferred reducer gaps was re-verified against the current `scripts/reduce-state.cjs` (1657 LOC):

| Gap | Severity | Verified state | Disposition |
|---|---|---|---|
| LG-0001 | P1 | Reducer handles resumed/restarted/synthesis_complete/graph_convergence/blocked_stop/claim_adjudication events but ignores `userPaused`/`stuckRecovery`, so the dashboard shows RUNNING during a pause or recovery | FIX |
| LG-0005 | P1 | `deltaRecordToFinding` drops `scopeProof` + `affectedSurfaceHints`, contradicting state_format.md line 226 which lists them in findingDetails | FIX |
| LG-0006 | P1 | Reducer does not aggregate `traceabilityChecks.results[]` from iteration records into the registry | FIX |
| LG-0008 | P1 | SKILL.md 8.1 line 538 states the reducer reads `content_hash` for two-tier dedup, but the registry dedups by findingId only (cross-dimension restatements stay split) | FIX |
| LG-0033 | P1 | `parseJsonlDetailed` validates JSON syntax only, not the documented Validation Rules (state_format.md 461-465) | FIX |
| LG-0002 | P2 | Reducer is deliberately gate-name-agnostic (confirmed in 006); a hardcoded allowlist would reject valid future gates | BY-DESIGN |
| LG-0003 | P1 | `computeConvergenceScore` reads `compositeStop`, the pre-computed composite that already folds in rollingAvg + MAD; the reducer correctly reads the blended score | BY-DESIGN |
| LG-0004 | P1 | `graphEvents` are consumed by the MCP coverage-graph handler into deep-loop-graph.sqlite, not by the JSONL reducer (intended split) | BY-DESIGN |
| LG-0023 | P1 | `emitResourceMap` is `--emit-resource-map`-flag-gated by design; synthesis passes the flag and `config.resource_map.emit` controls it | BY-DESIGN |

### Purpose

Implement the 5 genuinely-open reducer behaviors with vitest coverage, aligning the reducer to its documented contracts (state_format.md findingDetails, traceabilityChecks schema, validation rules, and SKILL.md 8.1 content_hash dedup). Formally document the 4 by-design gaps so they reach a terminal state. No YAML or SKILL.md behavioral change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `scripts/reduce-state.cjs`: 5 surgical behavioral changes (LG-0001/0005/0006/0008/0033).
- New vitest coverage for each change.
- `decision-record.md`: ADR reopening ADR-002 + per-change ADRs + by-design rationale for the 4 documented gaps.
- `003-deep-review/resource-map.md`: update reducer-gap terminal states.

### Out of Scope

- YAML workflow changes, SKILL.md behavioral changes.
- The 4 by-design gaps get documentation only, no code.
- Test-location migration (LG-0026, a separate architectural decision).

### Files to Change

| File Path | Change Type | Gap |
|-----------|-------------|-----|
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modify | LG-0001/0005/0006/0008/0033 |
| `.opencode/skills/deep-review/scripts/tests/reducer-backlog-remediation.vitest.ts` | Create | test coverage |
| `../../003-deep-review/resource-map.md` | Modify | reducer-gap terminal states |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 changes ship with vitest coverage that fails before the change and passes after | new vitest green |
| REQ-002 | No regression in existing reducer tests | `deep-review-reducer-schema`, `review-reducer-fail-closed`, `deep-review-contract-parity` stay green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | LG-0008 honors the SKILL.md 8.1 two-tier contract (content_hash primary, file:line+title fallback) | cross-dimension restatements collapse with merged dimensions list |
| REQ-011 | LG-0033 field validation is additive (does not change default pass/fail for currently-valid state) | existing valid fixtures still reduce without new errors |
| REQ-012 | 4 by-design gaps documented with rationale in decision-record.md | each has an ADR or rationale entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 5 reducer behaviors implemented and covered by green vitest.
- **SC-002**: Existing reducer test suite stays green (no regression).
- **SC-003**: Strict validate exits 0 on this spec folder.
- **SC-004**: 4 by-design gaps and 5 fixed gaps annotated terminal in the `003-deep-review` resource-map.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | reduce-state.cjs is loop-critical (drives convergence) | High | Surgical changes, additive where possible, full regression run before commit |
| Risk | LG-0033 strict validation regresses currently-tolerated records | Medium | Implement as additive warnings, not hard errors; existing-fixture regression test |
| Risk | LG-0008 dedup collapse merges findings that should stay separate | Medium | Two-tier key matches SKILL.md 8.1 exactly; fallback preserves legacy behavior for records without content_hash |
| Dependency | vitest harness (existing reducer tests) | Green | Verified present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The reducer must remain idempotent (config contract `reducer.idempotent: true`). Re-running on the same state produces the same registry/dashboard.
- **NFR-R02**: Backward compatibility: state records without `content_hash`, `scopeProof`, `affectedSurfaceHints`, or `traceabilityChecks` must still reduce cleanly (fields are optional, fallback behavior preserved).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Record lacks content_hash**: two-tier dedup falls back to file:line + normalized title (legacy behavior), no migration needed.
- **Latest event is userPaused then resumed**: dashboard shows RUNNING again after resume (the resume event supersedes the pause).
- **traceabilityChecks absent**: registry rollup is an empty/zero summary, not an error.
- **Malformed-but-syntactically-valid record**: LG-0033 adds a field-level warning without throwing, so the reduce still completes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 5 surgical reducer changes + vitest in a 1657-LOC loop-critical file |
| Risk | 18/25 | convergence-driving reducer, regression and dedup-collapse risk |
| Research | 12/20 | per-gap verification + contract reading complete |
| **Total** | **44/70** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Operator chose full-implementation; by-design dispositions confirmed during investigation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent**: `../spec.md`
- **Origin**: `../../003-deep-review/resource-map.md` Phase-5 Augmentation, `003-deep-review` ADR-002
