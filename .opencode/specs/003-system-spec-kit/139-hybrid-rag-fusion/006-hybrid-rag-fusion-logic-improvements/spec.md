---
title: "Feature Specification: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/spec.md]"
description: "This initiative performs a deep audit and hardening pass on hybrid RAG fusion logic, inter-system automation, and bug-prevention controls so retrieval remains accurate, deterministic, and explainable under production pressure."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "hybrid rag"
  - "fusion logic improvements"
  - "deep system audit"
  - "automation interconnection"
  - "bug prevention"
importance_tier: "critical"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This initiative hardens the active Hybrid RAG stack by auditing the full retrieval chain, tightening fusion logic, and adding automation hooks that keep indexing, ranking, and session selection aligned. The objective is not to replace the existing architecture from `002`, but to remove remaining weak points that can still create noisy retrieval, stale context routing, or silent confidence drops.

The delivery combines algorithmic tuning (fusion and confidence gates), interconnection automation (index and command alignment health checks), and prevention controls (regression and invariant checks) so known bug classes from `003`, `004`, and `005` do not recur.

**Key Decisions**: retain SQLite-first tri-hybrid architecture; execute audit-first then tune; promote prevention automation to release-gate status.

**Critical Dependencies**: stable MCP search/index contracts, existing regression harnesses from `002` through `005`, and deterministic path canonicalization behavior.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-22 |
| **Branch** | `006-hybrid-rag-fusion-logic-improvements` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hybrid retrieval capabilities are active, but the system still carries operational risk at the seams: fusion quality can drift if channel weighting and confidence thresholds are not continuously validated; index/metadata consistency issues can reappear when migration and scan behavior diverge; and session-routing bugs can silently re-introduce wrong-context execution when confidence gating is weak.

### Purpose
Deliver a deep system audit and targeted hardening pass that makes fusion behavior measurable, automated, and resilient so retrieval and workflow routing stay trustworthy at scale.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- End-to-end audit of retrieval path: parse -> index -> scatter/gather -> fusion -> post-fusion gating -> response packaging.
- Fusion logic improvements: adaptive weighting guardrails, confidence calibration, redundancy controls, and deterministic fallback sequencing.
- Automation/interconnection improvements between index health, command routing confidence, and retrieval diagnostics.
- Bug prevention framework that converts known failure modes from `003`, `004`, and `005` into enforced regression and release checks.
- Governance artifacts, sign-off protocol, and evidence capture for high-risk retrieval changes.

### Out of Scope
- Migration to external vector, graph, or search databases.
- Large schema redesign of the existing SQLite memory schema.
- UI changes or non-MCP client feature work.
- Broad refactors unrelated to audit findings or fusion hardening goals.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Tighten fusion-stage orchestration, fallback guards, and metric hooks. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts` | Modify | Enforce bounded channel weights and deterministic tie resolution. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` | Modify | Recalibrate confidence thresholds using audited score distributions. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Strengthen interconnection between deep mode expansion, evidence signaling, and response metadata. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Add index/fusion alignment checks and drift counters consumed by audit dashboards. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Modify | Align low-confidence routing safeguards with retrieval confidence policy. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Modify | Add regression suites for cross-module bug-prevention guarantees. |
<!-- /ANCHOR:scope -->

---

## 3.5 PRIOR-WORK CONTINUITY (002/003/004/005)

### Carry-Forward Assumptions
- **From `002-hybrid-rag-fusion`**: tri-hybrid retrieval (vector + FTS/BM25 + graph), MMR, and evidence-gap signaling remain the architectural baseline.
- **From `003-index-tier-anomalies`**: canonical-path dedup and deterministic tier precedence are mandatory invariants, not optional behaviors.
- **From `004-frontmatter-indexing`**: normalized frontmatter and idempotent reindex behavior remain required preconditions for retrieval quality.
- **From `005-auto-detected-session-bug`**: confidence-aware session/folder detection and archive exclusion remain mandatory for workflow safety.

### Carry-Forward Gaps Addressed in `006`
- Convert deferred operational controls into enforceable release checks (monitoring, runbook, sign-off evidence).
- Add cross-system drift detection so index health, fusion confidence, and folder selection confidence are validated together.
- Harden regression boundaries so mtime/path anomalies and metadata inconsistencies cannot silently degrade retrieval logic.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete deep audit across retrieval and routing seams | Audit report maps every stage, input/output contract, and top 10 risk points with owner and fix status. |
| REQ-002 | Fusion logic guardrails prevent score-drift regressions | Automated tests verify bounded weights, deterministic tie handling, and stable ranked output across fixed fixtures. |
| REQ-003 | Confidence policy is unified across retrieval and session detection | `memory-search` evidence-gap and folder-selection low-confidence behavior share documented thresholds and expected fallback behavior. |
| REQ-004 | Automation detects index/fusion misalignment before release | CI gate fails when index metadata invariants, tier invariants, or retrieval confidence invariants are violated. |
| REQ-005 | Bug prevention matrix covers failures seen in 003/004/005 | Regression suite includes explicit scenarios for alias-path duplication, tier precedence drift, and wrong-folder auto-selection. |
| REQ-006 | Governance completion evidence is auditable | Checklist, decision record, and implementation summary include command-level evidence and approval state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Improve observability for fusion decisions | Response metadata exposes channel contribution summary and confidence rationale fields for debug mode. |
| REQ-008 | Automation/interconnection runbook documented | Plan and checklist include operational playbook for audit reruns, rollback, and anomaly escalation. |
| REQ-009 | Maintain latency budget while adding checks | Benchmarks show p95 remains within agreed search budget for `mode="auto"` and `mode="deep"` after hardening. |
| REQ-010 | Cross-spec continuity preserved | `006` documents explicitly map inherited assumptions and unresolved follow-ups from `002` to `005`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Audit artifacts identify root-cause classes and map each to implemented prevention controls.
- **SC-002**: Fusion output is stable and deterministic across regression fixtures after guardrail implementation.
- **SC-003**: CI rejects builds where index invariants, tier invariants, or routing-confidence invariants are violated.
- **SC-004**: Known bug classes from `003`, `004`, and `005` are represented in automated tests and pass consistently.
- **SC-005**: Governance sign-off reaches approved state for technical, product, and QA roles.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing hybrid-search scoring contracts | Incorrect assumptions can break ranking semantics | Capture baseline fixtures before tuning and compare post-change deterministically |
| Dependency | Parser/index normalization guarantees from `004` | Drift in metadata contract weakens retrieval confidence | Add invariant checks that fail fast when normalization contract is violated |
| Risk | Over-constrained confidence thresholds | Increased false warnings or excessive confirmation prompts | Calibrate against audited distributions and set boundary tests |
| Risk | Added checks impact latency | Search response time can exceed operational budget | Keep critical checks O(n) or bounded O(n^2) with capped candidate sets |
| Risk | Cross-module scope creep | Initiative expands beyond fusion hardening objective | Enforce scope lock through tasks, ownership, and checklist gating |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Additional auditing and guardrail logic must preserve target p95 response time budget for search pathways.
- **NFR-P02**: CI invariant checks complete within acceptable build-time overhead (target <10% increase).

### Security
- **NFR-S01**: Path normalization and folder detection safeguards continue blocking traversal and unapproved roots.
- **NFR-S02**: No sensitive runtime data is logged in diagnostic metadata.

### Reliability
- **NFR-R01**: Same query + same index state yields deterministic ranking output.
- **NFR-R02**: Reindex + retrieval workflows remain idempotent across reruns.
<!-- /ANCHOR:nfr -->

---

## 8. EDGE CASES

### Data Boundaries
- Empty or near-empty result sets still emit deterministic confidence metadata.
- Large candidate sets remain bounded before expensive pairwise operations execute.

### Error Scenarios
- Index anomaly detected during search: response includes safe fallback metadata and triggers alert hooks.
- Session selection ambiguity with close confidence scores: explicit confirmation path triggers instead of silent default.

### Cross-System Consistency
- Canonical path aliases (`specs/` vs `.opencode/specs/`) remain unified across scan, index, and session detection logic.
- Tier precedence remains consistent between parser output and retrieval ranking inputs.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Retrieval, indexing, routing, testing, and governance docs all affected |
| Risk | 24/25 | Incorrect behavior can silently misroute workflows and degrade answer quality |
| Research | 17/20 | Requires deep audit, baseline capture, and confidence calibration |
| Multi-Agent | 12/15 | Multiple tightly coupled workstreams and synchronization points |
| Coordination | 13/15 | Cross-component dependencies and release-gate integration |
| **Total** | **89/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fusion guardrails overfit to current fixtures | H | M | Use mixed fixture sets and holdout scenarios for calibration |
| R-002 | Invariant checks generate high false-positive rate | M | M | Add threshold tuning phase and boundary test suite |
| R-003 | Cross-system automation creates hidden coupling | H | M | Define explicit contracts and fail-fast diagnostics |
| R-004 | Continuity assumptions from prior specs become stale | M | L | Revalidate assumptions at each milestone and update ADRs |

---

## 11. USER STORIES

### US-001: Retrieval Confidence You Can Trust (Priority: P0)

**As a** maintainer, **I want** fusion and confidence logic to be deterministic and observable, **so that** retrieval quality is explainable and safe under production load.

**Acceptance Criteria**:
1. Given stable fixtures, when search executes repeatedly, then ranked output and confidence metadata stay consistent.
2. Given low-confidence retrieval, when response is generated, then warning and fallback details are explicit and machine-readable.

---

### US-002: Automation That Prevents Known Failures (Priority: P0)

**As a** platform owner, **I want** CI to block regressions in index/tier/routing invariants, **so that** known bug classes do not re-enter production.

**Acceptance Criteria**:
1. Given alias/tier/routing regression fixtures, when CI runs, then failures are surfaced before release.

---

### US-003: Continuity Across Spec Lineage (Priority: P1)

**As a** project lead, **I want** `006` to inherit and enforce key outcomes from `002` to `005`, **so that** improvements build on prior work instead of restarting assumptions.

**Acceptance Criteria**:
1. Given prior-spec assumptions, when `006` docs are reviewed, then each assumption has a mapped control or verification task.

---

<!-- ANCHOR:acceptance-scenarios -->
## 11.5 ACCEPTANCE SCENARIOS

1. **Deep audit mapping**
   **Given** active retrieval/index/routing modules
   **When** Phase 1 audit executes
   **Then** every stage has documented inputs, outputs, and risk classification.

2. **Fusion determinism guardrail**
   **Given** fixed fixture queries and index state
   **When** hardening changes are applied
   **Then** ranking output remains deterministic across repeated runs.

3. **Confidence policy alignment**
   **Given** low-confidence retrieval and ambiguous folder-selection candidates
   **When** confidence policies execute
   **Then** both systems apply explicit fallback or confirmation behavior.

4. **Invariant gate enforcement**
   **Given** alias-path, tier, or routing regression fixtures
   **When** CI runs
   **Then** release gates fail with actionable diagnostics.

5. **Performance budget protection**
   **Given** post-hardening code paths
   **When** benchmark suites run
   **Then** p95 search latency remains within agreed budget.

6. **Governance closure**
   **Given** completed implementation
   **When** checklist and approval workflow are reviewed
   **Then** all P0 checks and required sign-offs are present with evidence.
<!-- /ANCHOR:acceptance-scenarios -->

---

## 11.6 AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scope lock to hybrid RAG fusion logic improvements and related safeguards.
- Confirm baseline fixtures and prior-spec continuity matrix are available.
- Confirm verification commands for regression, performance, and validation.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Only change files mapped to this spec and task phase. |
| Evidence | Record command-level evidence for completed P0/P1 items. |
| Safety | Stop and escalate on invariant failures without approved fallback. |

### Status Reporting Format
- `STATE`: current phase and objective.
- `ACTIONS`: files/commands executed.
- `RESULT`: pass/fail and next planned action.

### Blocked Task Protocol
1. Stop edits for the blocked area and capture concrete failure output.
2. Attempt one bounded remediation that does not expand scope.
3. Escalate with options, impact, and recommended next step.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Technical Lead | Pending | |
| Design Review | Retrieval Architect | Pending | |
| Implementation Review | Engineering Lead | Pending | |
| Launch Approval | Product Owner | Pending | |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [ ] Security review completed
- [ ] Path and routing safety checks passed
- [ ] Sensitive diagnostics review completed

### Code Compliance
- [ ] Coding standards followed
- [ ] License compliance verified
- [ ] Regression policy coverage validated

### Operational Compliance
- [ ] Monitoring and alert hooks documented
- [ ] Rollback playbook verified
- [ ] Release-gate checklist approved

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Retrieval Maintainer | Engineering | High | Daily async updates |
| Spec Kit Maintainer | Platform | High | Phase-end sync |
| Product Owner | Product | Medium | Milestone review |
| QA Lead | Verification | High | Test-gate review |

---

## 15. CHANGE LOG

### v1.0 (2026-02-22)
Initial Level 3+ specification for hybrid RAG fusion logic improvements.

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Should low-confidence thresholds be shared as one constant source across retrieval and folder detection, or linked by policy mapping with independent numeric values?
- Which benchmark corpus should be the primary p95 latency reference for release gating?
- Should monitoring alerts trigger on absolute confidence drops, relative drift, or both?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC
Governance-focused high complexity specification with continuity mapping.
-->
