---
title: "Implementation Plan: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/plan.md]"
description: "This plan executes an audit-first hardening cycle for hybrid RAG fusion logic, then adds automation and prevention controls that keep retrieval, indexing, and routing behavior synchronized."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "hybrid rag fusion"
  - "audit first"
  - "automation interconnection"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js), Markdown spec tooling |
| **Framework** | system-spec-kit MCP server + command scripts |
| **Storage** | SQLite + markdown-based spec and memory artifacts |
| **Testing** | Vitest, script-level functional tests, spec validation scripts |

### Overview
This plan runs in four phases: baseline audit, fusion-logic hardening, automation/interconnection, and prevention validation. The implementation does not replace the established architecture from `002`; it adds deterministic guardrails and release gates that absorb known failure patterns from `003`, `004`, and `005`. Delivery emphasizes measurable invariants and rollback-ready changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Prior-work assumptions from `002` to `005` mapped into this plan

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Regression and invariant suites passing
- [ ] Latency and reliability budgets verified
- [ ] Governance docs synchronized (`spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-first closed-loop hardening with deterministic guardrails.

### Key Components
- **Audit Orchestrator**: captures baseline behavior and identifies seam risks across retrieval, indexing, and routing.
- **Fusion Guardrail Layer**: enforces bounded weights, deterministic ties, and confidence calibration.
- **Automation Bridge**: links index health signals, retrieval confidence signals, and folder-selection confidence into one invariant framework.
- **Prevention Harness**: regression suites and CI release gates for known bug classes.

### Data Flow
1. Collect baseline fixtures and metrics from active retrieval/index/routing paths.
2. Apply fusion guardrails and confidence policy refinements.
3. Emit machine-readable diagnostics that connect retrieval outcomes with index/routing invariants.
4. Run prevention suite and gate releases on invariant compliance.
<!-- /ANCHOR:architecture -->

---

## 3.5 CARRY-FORWARD IMPLEMENTATION NOTES (002/003/004/005)

| Prior Spec | Carry-Forward Asset | 006 Usage |
|------------|---------------------|-----------|
| `002-hybrid-rag-fusion` | Tri-hybrid retrieval + MMR/TRM pipeline | Baseline audited and hardened, not replaced |
| `003-index-tier-anomalies` | Canonical path dedup + tier precedence | Treated as mandatory invariants for release gating |
| `004-frontmatter-indexing` | Frontmatter normalization + reindex discipline | Used as precondition checks before fusion benchmarking |
| `005-auto-detected-session-bug` | Confidence-aware folder detection behavior | Aligned with retrieval confidence policy and escalation rules |

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Deep System Audit
- [ ] Build an end-to-end component map of retrieval/index/routing seams.
- [ ] Capture baseline fixtures, latency metrics, and confidence distributions.
- [ ] Produce ranked risk register with owner and mitigation mapping.

### Phase 2: Fusion Logic Hardening
- [ ] Add bounded adaptive-fusion guardrails and deterministic tie handling.
- [ ] Recalibrate evidence-gap confidence thresholds from audited distributions.
- [ ] Ensure fallback sequence is explicit and test-covered.

### Phase 3: Automation and Interconnection
- [ ] Add invariant checks linking index health, tier correctness, and routing confidence.
- [ ] Wire diagnostics so anomalies are visible in CI and operational logs.
- [ ] Align folder detection confidence policy with retrieval confidence contract.

### Phase 4: Bug Prevention and Governance Verification
- [ ] Expand regression matrix to include alias-path, tier-drift, and wrong-folder scenarios.
- [ ] Run performance and reliability verification gates.
- [ ] Finalize approvals, checklist evidence, and implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | fusion weighting bounds, confidence math, fallback logic | Vitest |
| Integration | end-to-end retrieval/index/routing invariants | Vitest + script harness |
| Regression | prior bug classes from `003`, `004`, `005` | Existing and new functional suites |
| Performance | p95 latency and check-overhead deltas | benchmark scripts + CI metrics |
| Manual | anomaly review and rollback dry-run | command-line runbook execution |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline fixtures from active hybrid search | Internal | Green | Hardening cannot be validated against current behavior |
| Parser/index normalization guarantees from `004` | Internal | Yellow | Confidence and ranking checks may be invalid |
| Folder detection confidence hooks from `005` | Internal | Green | Cross-policy alignment for routing confidence is incomplete |
| CI pipeline support for new invariant gates | Internal | Yellow | Prevention controls cannot enforce release safety |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: significant latency regression, false-positive confidence warnings, or invariant gate noise that blocks safe delivery.
- **Procedure**: revert guardrail changes by phase, keep baseline fixtures, restore previous thresholds, and rerun regression matrix before reattempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──────┐
                      ├──► Phase 2 (Hardening) ───► Phase 3 (Automation) ───► Phase 4 (Prevention/Verify)
Prior-spec checks ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | Prior-spec continuity map | Hardening, Automation, Verify |
| Hardening | Audit baselines | Automation, Verify |
| Automation | Hardening + continuity checks | Verify |
| Prevention/Verify | Automation + regression matrix | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deep System Audit | High | 1.5-2.5 days |
| Fusion Logic Hardening | High | 2-3 days |
| Automation and Interconnection | High | 1.5-2.5 days |
| Prevention and Governance Verification | Medium-High | 1-2 days |
| **Total** | | **6-10 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline audit fixtures archived
- [ ] Threshold changes documented with before/after metrics
- [ ] Invariant gate overrides documented for emergency use

### Rollback Procedure
1. Disable newly introduced invariant gates only if they are producing verified false positives.
2. Revert phase-specific hardening changes in reverse order (Phase 4 -> Phase 2).
3. Re-run baseline fixture suite and compare against pre-change results.
4. Record incident and update decision record before redeployment.

### Data Reversal
- **Has data migrations?** No direct schema migrations expected
- **Reversal procedure**: restore previous index snapshots if benchmark corpus was reindexed during validation
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ A: Audit Baselines   │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ B: Fusion Guardrails │
└───────┬───────┬──────┘
        │       │
┌───────▼───┐ ┌─▼──────────────────┐
│ C: Policy │ │ D: Automation Bridge│
│ Alignment │ │ (invariant gates)   │
└───────┬───┘ └───────────┬─────────┘
        │                 │
        └───────┬─────────┘
                ▼
      ┌──────────────────────┐
      │ E: Prevention Verify │
      └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| A Audit Baselines | Prior-spec continuity mapping | Fixture corpus + risk register | B, C, D |
| B Fusion Guardrails | A | Tuned weighting and fallback behavior | D, E |
| C Policy Alignment | A + B | Unified confidence policy | E |
| D Automation Bridge | A + B | Invariant checks and diagnostics | E |
| E Prevention Verify | C + D | Release-gate evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Audit baselines captured and reviewed** - 1.5 days - CRITICAL
2. **Fusion guardrails implemented and stabilized** - 2 days - CRITICAL
3. **Automation bridge and invariant gates operational** - 1.5 days - CRITICAL
4. **Regression/performance/governance verification complete** - 1 day - CRITICAL

**Total Critical Path**: ~6 days

**Parallel Opportunities**:
- Policy alignment and test fixture expansion can run in parallel after guardrail interfaces stabilize.
- Documentation evidence can be updated alongside verification runs in Phase 4.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit Complete | Risk register and baseline metrics approved | End Phase 1 |
| M2 | Hardening Complete | Fusion regression suite passing with deterministic outputs | End Phase 2 |
| M3 | Automation Complete | Invariant gates active and stable | End Phase 3 |
| M4 | Release Ready | Governance approvals + verification evidence complete | End Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Audit-first hardening over direct tuning

**Status**: Accepted

**Context**: Prior specs solved core architecture and bug classes, but seam-level drift risk remains. Direct tuning without a baseline increases regression risk.

**Decision**: Capture deep baselines first, then apply bounded hardening and release-gated automation.

**Consequences**:
- Positive: changes are measurable and reversible.
- Negative: front-loaded analysis adds initial schedule cost.

**Alternatives Rejected**:
- Immediate tuning without baseline: rejected due to low explainability and high regression risk.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md` sections 1-4 and continuity matrix
**Duration**: one focused pass
**Agent**: Primary

### Tier 2: Controlled Parallel Preparation
| Agent | Focus | Files |
|-------|-------|-------|
| Primary (single-owner) | Planning and checklist synchronization | `plan.md`, `checklist.md` |
| Primary (single-owner) | Decision continuity and governance updates | `decision-record.md`, `implementation-summary.md` |

**Execution Rule**: This phase runs sequentially in one LEAF execution context; no nested dispatch is used.

### Tier 3: Integration
**Agent**: Primary
**Task**: Merge outputs, validate cross-file consistency, and enforce scope lock
**Duration**: final verification pass
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Audit and Baseline | Retrieval Maintainer | search/index/routing diagnostics | Planned |
| W-B | Fusion Hardening | Retrieval Engineer | fusion/confidence modules | Planned |
| W-C | Prevention and Governance | QA + Spec Maintainer | tests + docs + gates | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | M1 complete | W-A, W-B | Approved baseline and hardening targets |
| SYNC-002 | M2 complete | W-B, W-C | Regression matrix freeze |
| SYNC-003 | M3 complete | W-A, W-B, W-C | Release-gate readiness packet |

### File Ownership Rules
- Each implementation file has a primary owner and one reviewer.
- Cross-workstream edits require sync checkpoint evidence.
- Unplanned changes outside this spec scope require explicit deferral entry.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: concise status update in `tasks.md` and blocker notes in `checklist.md`.
- **Per Phase**: milestone review and risk register update.
- **Blockers**: immediate escalation with command evidence.

### Escalation Path
1. Technical blocker -> Engineering Lead
2. Scope or timeline risk -> Product Owner
3. Verification failure -> QA Lead
<!-- /ANCHOR:communication -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target files and test scope for the active phase.
- Confirm carry-forward constraints from `002/003/004/005`.
- Confirm no schema migration and no out-of-scope refactor.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Edit only planned files for the current phase. |
| Verification | Run mapped tests/checks before claiming completion. |
| Evidence | Record concrete command/file evidence for completed P0/P1 items. |

### Status Reporting Format
- `STATE`: current checkpoint.
- `ACTIONS`: files edited and commands executed.
- `RESULT`: pass/fail plus next action.

### Blocked Task Protocol
1. Stop edits for the blocked area and capture error evidence.
2. Attempt one bounded workaround that does not expand scope.
3. Escalate with impact and options if unresolved.

---

<!--
LEVEL 3+ PLAN
Audit-first hardening with governance and prevention controls.
-->
