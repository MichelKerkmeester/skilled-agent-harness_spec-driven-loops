---
title: "Feature Specification: Runtime Primitive Extraction"
description: "Scaffold for Runtime Primitive Extraction."
trigger_phrases:
  - "129 002 runtime primitive extraction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/001-deep-ai-council/009-iterative-runtime-primitive-extraction"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "5 council primitives + 5 vitest harnesses authored"
    next_safe_action: "dispatch F2 — 129/003 orchestration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:1290010000000000000000000000000000000000000000000000000000000001"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Runtime Primitive Extraction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-research-and-architecture-design/` |
| **Successor** | `003-per-topic-multi-round-orchestration/` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Extract council-compatible shared primitives from deep-loop-runtime without creating a peer council-runtime package.

### Purpose

Implement the phase slice defined by ADR-001, leaving unrelated packet work to later phases.
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

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/council/*.cjs` | Create | Five council runtime primitives for dispatch, state, scoring, guards, and hierarchy. |
| `.opencode/skills/deep-loop-runtime/tests/council/*.vitest.ts` | Create | Five targeted Vitest harnesses covering the primitive contracts. |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modify | Added Council Primitives section with ADR-001 rationale. |
| `002-runtime-primitive-extraction/*` | Modify | Synchronized phase completion docs and validation evidence. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Honor ADR-001 | Implementation cites the relevant ADR in summary. |
| REQ-002 | Keep scope narrow | No adjacent cleanup outside this phase. |
| REQ-003 | Verify behavior | Stack-appropriate tests and strict spec validation pass. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase implementation satisfies its ADR references.
- **SC-002**: Tests or explicit validation evidence are recorded.
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
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Existing single-round council behavior remains available unless the phase explicitly changes it.
- **NFR-002**: New behavior is documented with verification evidence.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Prior phase produced partial artifacts.
- Runtime mirror or command docs disagree.
- Cost guard defaults conflict with operator overrides.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | Medium | One phase of packet 129 |
| Risk | Medium | Depends on prior phases |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Phase 002 is complete and hands off to 129/003 orchestration.
<!-- /ANCHOR:questions -->
