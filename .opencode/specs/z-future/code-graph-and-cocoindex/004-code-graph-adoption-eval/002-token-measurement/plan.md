---
title: "Implementation Plan: 002 Token Measurement"
description: "Level 2 plan for token metrics helper over session analytics."
trigger_phrases:
  - "027 006 002 plan"
  - "token measurement plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/002-token-measurement"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 plan.md"
    next_safe_action: "Implement Token Measurement work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-002-token-measurement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 002 Token Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit eval library |
| **Storage** | session analytics DB |
| **Testing** | Vitest via child 005 |

### Overview
Add a narrow metrics helper that reads token totals for a completed eval session and returns a serializable object for the harness result row.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 001 defines session id/result row contract.
- [ ] Existing session analytics DB helper is located.

### Definition of Done
- [ ] Token helper returns counts and missing state.
- [ ] Helper is covered by integration tests in child 005.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small DB adapter owned by eval metrics.

### Key Components
- **Input validation**: checks session id shape.
- **DB read**: queries analytics sessions.
- **Result mapping**: returns serializable token metrics or missing/error state.

### Data Flow
The harness passes a `sessionId`; the helper queries analytics storage and returns token counts that are attached to the task result row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Locate session analytics DB access pattern.

### Phase 2: Core Implementation
- [ ] Implement token-measurement helper.
- [ ] Add missing-row handling.

### Phase 3: Verification
- [ ] Verify with mocked DB rows through child 005.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | session id validation and row mapping | Vitest |
| Integration | helper called from harness result flow | Child 005 Vitest |
| Validation | Spec folder structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 harness skeleton | Internal | Pending | No stable caller contract |
| session analytics DB | Internal | Available | No token data source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Helper cannot read analytics reliably.
- **Procedure**: Exclude token metrics from live report and mark token reduction as blocked until analytics access is repaired.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 001 | Core implementation |
| Core implementation | Setup | Child 005 |
| Verification | Core implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **1-1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No secrets or raw prompts are logged from analytics reads.

### Rollback Procedure
1. Disable token metric attachment in the harness.
2. Keep file-read metrics active.
3. Record token metric as blocked in the report.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: No data mutation.
<!-- /ANCHOR:enhanced-rollback -->

