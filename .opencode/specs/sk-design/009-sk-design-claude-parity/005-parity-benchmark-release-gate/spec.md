---
title: "Phase 005 - Parity Benchmark Release Gate"
description: "Level 3 phase packet for proving the refactored sk-design behavior is Claude Design-like, useful in live work, and release-ready while preserving OpenCode-native routing and execution contracts."
trigger_phrases:
  - "parity benchmark release gate"
  - "Claude Design-like behavior"
  - "sk-design release readiness"
  - "golden prompts"
  - "procedure selection checks"
  - "context manifest proof gates"
  - "anti-slop review"
  - "manual playbook scenarios"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Recorded conditional Phase 005 release-gate evidence."
    next_safe_action: "Operator runs live/browser/manual scenarios before any ready verdict."
---
# Feature Specification: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 005 defines the final release gate for proving the refactored `sk-design` system acts and feels like Claude Design while staying native to OpenCode. The gate requires benchmark evidence, live/manual usefulness evidence, routing invariants, procedure-selection proof, md-generator preservation, and explicit release authority before any parity claim or release readiness claim is accepted.

**Key Decisions**: Release readiness requires both routing invariants and live/usefulness/parity evidence; benchmark baselines are protected from overwrite without release-owner authority; failures require an explicit release decision rather than silent adjustment.

**Critical Dependencies**: Phase 004 implementation evidence, current `sk-design` router/advisor behavior, existing md-generator extraction behavior, approved golden prompt corpus, and a named release owner for benchmark failure decisions.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete / Conditional Release Gate |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | Documentation and benchmark artifact updates only; no sk-design runtime code authored in this phase pass |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../004-mode-packet-refactor/spec.md |
| **Successor Phase** | ../006-parent-skill-canon-verification/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parity refactor can look correct at the router layer while still failing live design usefulness, procedure selection, proof discipline, anti-slop judgment, accessibility, hierarchy, interaction quality, polish, or md-generator preservation. A release gate is needed so `sk-design` cannot claim Claude Design-like behavior from route health alone.

### Purpose

Define the benchmark and release-readiness gate that proves the refactored `sk-design` behavior is useful, Claude Design-like, and OpenCode-native before release.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define the golden prompt corpus for interface, foundations, motion, audit, and md-generator modes.
- Define procedure-selection checks that prove the public mode chooses the right private procedure path without exposing a public procedure taxonomy.
- Define context manifest and proof gates that require cited inputs, chosen procedure rationale, output proof, and fallback behavior.
- Define anti-slop, accessibility, hierarchy, interaction, and polish review lanes for design quality.
- Define md-generator preservation tests so extraction behavior remains intact after parity refactor work.
- Define router and advisor invariants that preserve single `sk-design` identity, five public modes, and OpenCode-native execution.
- Define manual playbook scenarios and negative controls for live usefulness and false-positive prevention.
- Define benchmark baseline discipline: capture baseline first, report deltas, and never overwrite an existing baseline without release authority.
- Define release authority for benchmark failures, partial passes, and release-blocking evidence gaps.
- Add the parity-behavior manual playbook scenarios and compare the fresh router-mode benchmark run against the frozen baseline.
- Compile a conditional release report that names live/manual/browser-mode gaps instead of claiming readiness.

### Out of Scope

- Editing the parent root, sibling phases, `external/**`, `research/**`, or `.opencode/skills/sk-design/**` outside the approved Phase 005 artifact paths.
- Running live/manual/browser-mode scenarios in this automated dispatch.
- Replacing the existing `sk-design` advisor identity or five public mode taxonomy.
- Treating router success alone as parity success.
- Overwriting any existing benchmark baseline without explicit release-owner authority.
- Dispatching Task/subagents for this leaf packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/spec.md` | Update | Phase status and actual artifact scope |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/plan.md` | Update | Evidence-driven gate plan and conditional outcome |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/tasks.md` | Update | Completed task evidence and operator-gap notes |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/checklist.md` | Update | P0/P1 verification evidence and conditional release state |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/decision-record.md` | Update | Release authority and conditional verdict decisions |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/implementation-summary.md` | Update | Final implementation summary and validation evidence |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/release-report.md` | Create | Conditional release report comparing baseline to after-009 |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/description.json` | Regenerate | Memory discovery metadata |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate/graph-metadata.json` | Regenerate | Graph traversal metadata |
| `.opencode/skills/sk-design/manual_testing_playbook/06--parity-behavior/*.md` | Existing Phase 005 artifact | Parity behavior scenarios PB-001 through PB-003 |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Existing Phase 005 artifact | Root playbook index includes category 06 and PB-001 through PB-003 |
| `.opencode/skills/sk-design/benchmark/after-009/report.json` | Update | Fresh router-mode benchmark report |
| `.opencode/skills/sk-design/benchmark/after-009/report.md` | Update | Fresh rendered router-mode benchmark report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline before parity claim | A pre-change or pre-release benchmark baseline is captured before any "no regressions" claim, and the release report states deltas from that baseline. |
| REQ-002 | Golden prompts cover all public modes | The corpus includes interface, foundations, motion, audit, and md-generator prompts with expected procedure behavior and quality criteria. |
| REQ-003 | Procedure-selection proof exists | Each golden prompt records selected public mode, selected procedure path, why it was selected, and negative-control rejection behavior. |
| REQ-004 | Context manifest and proof gates pass | Each run records input context, evidence used, output proof, missing evidence, and manual fallback notes. |
| REQ-005 | Design quality lanes pass | Anti-slop, accessibility, hierarchy, interaction, polish, and usefulness review lanes produce pass/fail evidence. |
| REQ-006 | md-generator preservation passes | Existing extraction, CSS capture, output validation, and non-chat backend behavior remain preserved. |
| REQ-007 | Router and advisor invariants pass | Single `sk-design` advisor identity, five public modes, `mode-registry`, and hub-router behavior remain intact. |
| REQ-008 | Manual playbook scenarios pass | Live/manual scenarios demonstrate usefulness, not only static document correctness. |
| REQ-009 | Negative controls fail safely | Ambiguous, low-context, non-design, or unsafe prompts do not produce false parity confidence. |
| REQ-010 | Benchmark overwrite authority is explicit | Existing baselines are never overwritten unless the release owner records authority and reason. |
| REQ-011 | Failure authority is explicit | Benchmark failures block release unless the release owner accepts, defers, or scopes them with written rationale. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Report includes release verdict | Final report states release-ready, blocked, or conditional with evidence by lane. |
| REQ-013 | Manual reviewer notes captured | Human review notes are captured for design taste, usefulness, and parity feel. |
| REQ-014 | OpenCode-native behavior preserved | The gate confirms no hidden dependency on Claude-specific tooling, hidden subagents, or non-OpenCode execution assumptions. |
| REQ-015 | Evidence gaps are visible | Unknowns, missing screenshots, missing live checks, and skipped checks are explicit release risks. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Golden prompt benchmark results exist for all five public `sk-design` modes.
- **SC-002**: Each benchmark run includes baseline, current result, delta, verdict, and evidence links or notes.
- **SC-003**: Procedure-selection checks prove correct private procedure behavior without changing public routing.
- **SC-004**: Anti-slop, accessibility, hierarchy, interaction, polish, and live usefulness lanes have explicit pass/fail outcomes.
- **SC-005**: md-generator preservation tests pass or block release with a named failure decision.
- **SC-006**: Router/advisor invariants pass independently from design-quality gates.
- **SC-007**: Negative controls prevent router-only false confidence.
- **SC-008**: Release authority signs off any baseline overwrite, accepted failure, conditional release, or release block.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 implementation evidence | Benchmarks cannot prove refactored behavior without the implemented mode-packet changes | Block benchmark execution until Phase 004 evidence exists |
| Dependency | Golden prompt corpus | Weak prompts can create false confidence | Include mode coverage, negative controls, live/manual scenarios, and expected proof lanes |
| Dependency | Release owner | Benchmark failures and baseline overwrites need authority | Name the release owner before execution |
| Risk | Router-only false confidence | Routing can pass while design usefulness fails | Separate routing invariants from live usefulness, anti-slop, and manual review lanes |
| Risk | Benchmark overwrite | Historical comparison can be lost | Require baseline immutability unless release owner records overwrite authority |
| Risk | md-generator regression | Visual parity work can break extraction behavior | Keep dedicated md-generator preservation tests in P0 gates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality

- **NFR-E01**: Every release-ready claim must cite a benchmark result, manual review note, or validation artifact.
- **NFR-E02**: Deltas must compare a named baseline to a named current run.

### Reliability

- **NFR-R01**: Failed checks must block release unless the release owner records an explicit accepted-risk decision.

### Maintainability

- **NFR-M01**: Benchmark outputs must be append-only by default so older baseline evidence remains recoverable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Prompt Boundaries

- Empty or vague prompt: gate should require clarification rather than generating confident design output.
- Non-design prompt: advisor/router should not inflate `sk-design` parity confidence.
- Conflicting style constraints: output should state the conflict and preserve user-provided context.

### Benchmark Boundaries

- Missing baseline: release report must state that no regression claim can be made.
- Existing baseline present: new results must be written as a new run unless overwrite authority is recorded.
- Partial benchmark run: release cannot be marked ready unless skipped lanes are explicitly accepted by release authority.

### Manual Review Boundaries

- Disagreement between reviewers: release report records split verdict and routes to release owner.
- Good route but weak design: design quality lanes override router-only success.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Five public modes, benchmark corpus, manual playbook, md-generator preservation, metadata |
| Risk | 23/25 | Release gate, parity claim, baseline overwrite risk, false confidence risk |
| Research | 16/20 | Requires evidence from live/manual checks and benchmark design |
| Multi-Agent | 0/15 | This packet creation is LEAF-only with no subagent dispatch |
| Coordination | 12/15 | Depends on Phase 004 and release-owner authority |
| **Total** | **71/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Router invariants pass but outputs do not feel useful or polished | High | Medium | Separate quality lanes and manual usefulness review from routing checks |
| R-002 | Existing baseline is overwritten | High | Medium | Append-only runs and explicit overwrite authority |
| R-003 | md-generator extraction behavior regresses | High | Medium | Dedicated preservation test lane blocks release |
| R-004 | Golden prompts are too easy or too narrow | Medium | Medium | Include negative controls, mode-specific cases, and live/manual scenarios |
| R-005 | Release proceeds with undocumented failures | High | Low | Require failure authority entries in decision record or release report |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Prove parity with evidence (Priority: P0)

**As a** release owner, **I want** benchmark and manual evidence for Claude Design-like behavior, **so that** release readiness is not based on route health alone.

**Acceptance Criteria**:
1. Given the golden prompt corpus, When the benchmark runs, Then each mode produces a verdict with baseline delta and proof notes.
2. Given a failed quality lane, When release is considered, Then the release owner records block, deferral, or accepted risk.

---

### US-002: Preserve OpenCode-native routing (Priority: P0)

**As an** OpenCode operator, **I want** the same `sk-design` advisor and five public modes to remain intact, **so that** parity work does not introduce a foreign execution model.

**Acceptance Criteria**:
1. Given advisor routing checks, When `sk-design` is recommended, Then individual private procedures are not exposed as public skills.
2. Given mode-registry checks, When each public mode is selected, Then the hub-router contract remains stable.

---

### US-003: Protect md-generator behavior (Priority: P0)

**As a** maintainer, **I want** md-generator preservation tests, **so that** design parity work does not break live CSS extraction and style-reference output.

**Acceptance Criteria**:
1. Given md-generator preservation tests, When the release gate runs, Then extraction behavior passes or release is blocked.
2. Given a preservation failure, When release is reviewed, Then the failure cannot be waived without release-owner rationale.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Resolved: release and threshold authority for this automated gate record is the repository owner, delegated to this session.
- Resolved: current run artifacts live in `.opencode/skills/sk-design/benchmark/after-009/`.
- Resolved: `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json` is the immutable comparison baseline for this run.
- Still pending before READY: operator execution of live/browser/manual scenarios and design-quality reviewer lanes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Release Report**: See `release-report.md`
