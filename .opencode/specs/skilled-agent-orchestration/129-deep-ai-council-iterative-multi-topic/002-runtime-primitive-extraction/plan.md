---
title: "Implementation Plan: Runtime Primitive Extraction"
description: "Scaffold for Runtime Primitive Extraction."
trigger_phrases:
  - "129 002 runtime primitive extraction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/002-runtime-primitive-extraction"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "5 council primitives + 5 vitest harnesses authored"
    next_safe_action: "dispatch F2 — 129/003 orchestration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:1290020000000000000000000000000000000000000000000000000000000002"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime Primitive Extraction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill/runtime docs and scripts |
| **Framework** | system-spec-kit phase workflow |
| **Storage** | Packet-local markdown and JSON metadata |
| **Testing** | Strict spec validation and stack tests |

### Overview

Implemented Runtime Primitive Extraction as packet 129 phase 002.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Prior phase complete
- [x] ADR references read
- [x] Files to change identified

### Definition of Done
- [x] Acceptance criteria met
- [x] Tests passing or documented
- [x] Checklist evidence updated
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
ADR-driven phase implementation.

### Key Components
- **Phase scope**: Runtime Primitive Extraction
- **Parent packet**: 129 deep-ai-council iterative multi-topic

### Data Flow
Prior phase output feeds this phase; this phase records handoff evidence for the next phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packet 129 phase docs | Handoff source | Update | strict validation |
| Runtime/command files | Implementation target | Complete | targeted Vitest + syntax check |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read ADR references
- [x] Confirm prior phase status

### Phase 2: Core Implementation
- [x] Implement scoped changes
- [x] Update docs

### Phase 3: Verification
- [x] Run tests
- [x] Run strict validation
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Changed helpers | Vitest or relevant stack |
| Integration | Workflow behavior | Command fixtures |
| Manual | Spec validation | validate.sh |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Prior phase | Internal | Complete | Blocks implementation |
| ADR references | Internal | Ready | Defines scope |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert phase-specific implementation and preserve prior phase artifacts.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 002 | Previous phase | Next phase |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Runtime Primitive Extraction | Medium | 1-3 sessions |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Keep existing single-round council behavior available as fallback.
<!-- /ANCHOR:enhanced-rollback -->
