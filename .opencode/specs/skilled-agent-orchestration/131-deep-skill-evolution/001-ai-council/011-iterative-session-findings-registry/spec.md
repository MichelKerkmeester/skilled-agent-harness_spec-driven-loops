---
title: "Feature Specification: Multi-Topic Session and Findings Registry"
description: "Scaffold for Multi-Topic Session and Findings Registry."
trigger_phrases:
  - "129 004 multi-topic session and findings registry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/011-iterative-session-findings-registry"
    last_updated_at: "2026-05-23T08:04:54Z"
    last_updated_by: "codex"
    recent_action: "findings-registry + cross-topic priors + workflow YAML scaffolds"
    next_safe_action: "dispatch F4 -- 129/005 command + skill wiring"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:1290210000000000000000000000000000000000000000000000000000000001"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Multi-Topic Session and Findings Registry

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

This placeholder phase consumes ADR-002 and ADR-005 from 129/001 and will be filled by the Wave 6 implementation agent. The scope is intentionally narrow so the architecture decisions are implemented in order.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | Previous phase |
| **Successor** | `005-command-and-skill-wiring/` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Implement session-level topic sequencing, council-findings-registry.json, and cross-topic priors.

### Purpose

Implement the phase slice defined by ADR-002 and ADR-005, leaving unrelated packet work to later phases.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement this phase's runtime, command, test, or documentation slice.
- Preserve architecture decisions from 129/001.
- Update phase-local summary and checklist evidence.

### Out of Scope

- Re-opening ADR-001..ADR-005 without an explicit new decision.
- Editing packet 130 or packet 115.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/scripts/lib/findings-registry.cjs` | Create | Session-wide registry writer for topic verdict and synthesis findings. |
| `.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs` | Modify | Append findings and inject cross-topic priors after topic 1. |
| `.opencode/skills/deep-ai-council/scripts/tests/findings-registry.vitest.ts` | Create | Registry writer, load, priors, and concurrent append coverage. |
| `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` | Create | Autonomous workflow scaffold for F4 command wiring. |
| `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml` | Create | Interactive workflow scaffold for F4 command wiring. |
| `004-multi-topic-session-and-findings-registry/*` | Modify | Phase docs, checklist, continuity, and commit handoff. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Honor ADR-002 and ADR-005 | Implementation cites the relevant ADR in summary. |
| REQ-002 | Keep scope narrow | No adjacent cleanup outside this phase. |
| REQ-003 | Verify behavior | Stack-appropriate tests and strict spec validation pass. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase implementation satisfies ADR-002 and ADR-005 through session-level registry and priors.
- **SC-002**: Tests and validation evidence are recorded in `implementation-summary.md`.
- **SC-003**: Phase strict validation passes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Prior phase completion | High | Resume parent phase map before implementation. |
| Risk | Scope drift | Medium | Use this spec's Files to Change table and ADR links. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Existing single-round council behavior remains available unless the phase explicitly changes it.
- **NFR-002**: New behavior is documented with verification evidence.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Prior phase produced partial artifacts.
- Runtime mirror or command docs disagree.
- Cost guard defaults conflict with operator overrides.
<!-- /ANCHOR:edge-cases -->

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Runtime architecture slice |
| Risk | 14/25 | Feeds later phase |
| Research | 8/20 | ADR-driven implementation |
| Multi-Agent | 4/15 | Runtime/command surface |
| Coordination | 8/15 | Parent packet sequencing |
| **Total** | **50/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase drift from 001 ADRs | H | M | Cite ADRs in implementation summary. |

## 11. USER STORIES

### US-001: Downstream Phase Has Stable Handoff

**As a** downstream implementer, **I want** this phase to record exact outputs, **so that** the next phase can start without rework.

**Acceptance Criteria**:
1. Given phase completion, When the next phase starts, Then implementation-summary.md names the usable artifact surface.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for F3. F4 owns command activation in `deep-council.md`.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- `../001-research-and-architecture-design/decision-record.md`
