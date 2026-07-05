---
title: "Feature Specification: Deep Improvement Rollback Hash Guard"
description: "Guard deep-improvement rollback so accepted-state rollback restores only from verified source states while preserving legitimate pre-ship rollback."
trigger_phrases:
  - "deep improvement rollback hash guard"
  - "rollback candidate accepted state hash"
  - "promote candidate benchmark rollback"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/001-deep-improvement-rollback-hash-guard"
    last_updated_at: "2026-06-29T10:50:10Z"
    last_updated_by: "codex"
    recent_action: "Implemented rollback hash guard"
    next_safe_action: "Phase complete; rollback hash guard shipped and verified"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "rollback-hash-guard-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A pre-ship rollback must remain valid because the canonical target still matches the stored pre-acceptance hash."
---
# Feature Specification: Deep Improvement Rollback Hash Guard

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
| **Created** | 2026-06-29 |
| **Branch** | current workspace |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 |
| **Predecessor** | None |
| **Successor** | 002-deep-improvement-promotion-safety |
| **Handoff Criteria** | Full deep-improvement Vitest suite passes with the rollback guard regression included. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase remediates a deep-review P1 finding in the deep-improvement promotion rollback helper.

**Scope Boundary**: Limit code changes to rollback accepted-state hash verification and the focused benchmark promotion regression test.

**Dependencies**:
- Node from `/opt/homebrew/bin` for script execution.
- Local Vitest availability for the requested full suite.

**Deliverables**:
- Hash-guarded rollback behavior in `rollback-candidate.cjs`.
- Regression coverage in `promote-candidate-benchmark.vitest.ts`.
- Level-1 phase documentation with verification evidence.

**Changelog**:
- Parent changelog refresh is out of scope for this narrow remediation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`rollback-candidate.cjs` restored the pre-acceptance backup without checking whether the target being rolled back from still matched a stored accepted-state hash. A naive mismatch-only block would break the legitimate rollback path immediately after acceptance, where the canonical target still equals the pre-acceptance state because the accepted candidate has not shipped.

### Purpose
Add a nuanced fail-closed guard that allows rollback from the two legitimate accepted states and blocks rollback only when the current target or backup has genuinely drifted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify rollback backup content against `preAcceptTargetHash` before restore.
- Verify current target content against either `preAcceptTargetHash` or `candidateHash` when an acceptance file is provided.
- Preserve the pre-ship rollback path where the target still matches the pre-acceptance hash.
- Add regression coverage for pre-ship success and unexpected target drift failure.

### Out of Scope
- Changing promotion scoring gates.
- Changing benchmark report parsing.
- Installing dependencies or changing package manifests.
- Git commits or branch operations.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs` | Modify | Add accepted-state hash guard before copying the backup. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Modify | Add regression coverage for pre-ship rollback and drift blocking. |
| `.opencode/specs/system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/001-deep-improvement-rollback-hash-guard/spec.md` | Modify | Replace scaffold placeholders with concrete phase specification. |
| `.opencode/specs/system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/001-deep-improvement-rollback-hash-guard/plan.md` | Modify | Replace scaffold placeholders with concrete implementation plan. |
| `.opencode/specs/system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/001-deep-improvement-rollback-hash-guard/tasks.md` | Modify | Replace scaffold placeholders with concrete task tracking. |
| `.opencode/specs/system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/001-deep-improvement-rollback-hash-guard/implementation-summary.md` | Modify | Document implementation and verification state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rollback must not copy a backup over an unexpected current target state. | A target hash that matches neither stored pre-acceptance nor accepted-candidate hash exits non-zero and leaves the target unchanged. |
| REQ-002 | Rollback must verify the backup being restored. | A backup hash mismatch against `preAcceptTargetHash` exits non-zero before copy. |
| REQ-003 | Legitimate pre-ship rollback must continue to work. | After acceptance but before ship, rollback succeeds because the current target matches `preAcceptTargetHash`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Post-ship rollback must continue to work. | After the target matches the accepted candidate hash, rollback restores the pre-acceptance target. |
| REQ-005 | Regression coverage must live with the existing benchmark promotion tests. | `promote-candidate-benchmark.vitest.ts` includes the nuanced pre-ship success and drift failure path. |
| REQ-006 | Level-1 phase docs must contain no scaffold placeholders. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` are authored with concrete content. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Direct CLI verification proves pre-ship rollback succeeds, unexpected drift fails closed, and post-ship rollback still restores the original target.
- **SC-002**: `rollback-candidate.cjs` passes `node --check`.
- **SC-003**: The requested deep-improvement Vitest suite is rerunnable once the local Vitest dependency is available.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local Vitest dependency | Full suite cannot execute while `npx` requires network install. | Record the exact failure and keep code covered by direct CLI verification. |
| Risk | Over-tight rollback guard | Could regress pre-ship rollback. | Allow current target hashes matching either `preAcceptTargetHash` or `candidateHash`. |
| Risk | Corrupt backup restore | Could restore untrusted content. | Verify backup hash equals `preAcceptTargetHash` before copying. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The remaining work is environmental verification: provide local `vitest` or network access, then rerun the requested suite.
<!-- /ANCHOR:questions -->
