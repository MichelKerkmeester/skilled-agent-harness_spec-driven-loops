---
title: "Feature Specification: Deep Improvement Promotion Safety"
description: "Narrow the pre-mutation 4-runtime mirror-sync gate so it verifies runtime mirrors against the current canonical body, letting legitimate in-sync agent-definition promotions pass while still blocking genuine drift."
trigger_phrases:
  - "deep improvement promotion safety"
  - "mirror sync gate canonical baseline"
  - "promote candidate agent definition mirror sync"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/002-deep-improvement-promotion-safety"
    last_updated_at: "2026-06-29T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "Narrowed the mirror-sync gate baseline and added a hermetic promotion regression test"
    next_safe_action: "Finalize the remaining 009 remediation phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-promotion-safety-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The pre-mutation mirror-sync gate must compare mirrors against the current canonical body, not the candidate, because a real promotion always changes the body."
---
# Feature Specification: Deep Improvement Promotion Safety

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
| **Phase** | 2 of 6 |
| **Predecessor** | 001-deep-improvement-rollback-hash-guard |
| **Successor** | 003-model-benchmark-reducer-ledger |
| **Handoff Criteria** | An in-sync agent-definition promotion passes the mirror-sync gate, a drifted mirror still blocks, and the deep-improvement Vitest suite passes with the new regression. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase remediates a deep-review finding in the deep-improvement promotion mirror-sync gate.

**Scope Boundary**: Limit code changes to the pre-mutation mirror-sync gate baseline in `promote-candidate.cjs` and a focused promotion regression test.

**Dependencies**:
- Node from `/opt/homebrew/bin` for script execution and the Vitest suite.
- The existing `verifyMirrorSync` / `evaluateMirrorSyncGate` helpers (unchanged).

**Deliverables**:
- Corrected mirror-sync baseline in `promote-candidate.cjs`.
- Hermetic promotion regression test in `promote-candidate-mirror-sync.vitest.ts`.
- Level-1 phase documentation with verification evidence.

**Changelog**:
- Parent changelog refresh is out of scope for this narrow remediation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The pre-mutation 4-runtime mirror-sync gate in `promote-candidate.cjs` read the candidate body and called `verifyMirrorSync(agentName, candidateContent, …)`, comparing each runtime mirror against the candidate. Because a real promotion always changes the agent body, every mirror registered as drift versus the candidate, so `allInSync` was false and the gate blocked every legitimate in-sync agent-definition promotion. Only a genuinely out-of-sync mirror should block.

### Purpose
Verify the runtime mirrors against the current canonical body — the state being replaced — so in-sync mirrors pass and only genuine drift blocks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current canonical target content (not the candidate) as the `verifyMirrorSync` expected body in the agent-definition gate.
- Preserve the existing block on genuine mirror drift and on missing mirrors.
- Add a hermetic regression test proving in-sync promotion is allowed and drift is still blocked.

### Out of Scope
- Changing `verifyMirrorSync` or `evaluateMirrorSyncGate` logic.
- The no-phase legacy one-step canonical mutation (`normalizePhase` default), which is documented design-intent: a bare invocation maps to the one-step `promote` mutation while `--phase=accept` / `--phase=ship` is the staged path.
- Promotion scoring gates and benchmark report parsing.
- Git commits or branch operations beyond this phase's commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modify | Compare mirrors against the current canonical body, not the candidate. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts` | Create | Hermetic in-sync-passes / drift-blocks regression coverage. |
| `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/002-deep-improvement-promotion-safety/spec.md` | Modify | Replace scaffold placeholders with concrete specification. |
| `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/002-deep-improvement-promotion-safety/plan.md` | Modify | Replace scaffold placeholders with concrete plan. |
| `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/002-deep-improvement-promotion-safety/tasks.md` | Modify | Replace scaffold placeholders with concrete task tracking. |
| `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/002-deep-improvement-promotion-safety/implementation-summary.md` | Modify | Document implementation and verification state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An in-sync agent-definition promotion must pass the mirror-sync gate. | A promotion where all three runtime mirrors match the current canonical body exits 0 and lands the candidate on the target. |
| REQ-002 | Genuine mirror drift must still block. | A promotion where a runtime mirror body differs from the current canonical exits non-zero and leaves the target unchanged. |
| REQ-003 | The regression must fail before the fix and pass after. | The in-sync test fails against the pre-fix baseline (candidate comparison) and passes after the canonical comparison fix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The deep-improvement Vitest suite must stay green. | The full suite passes with the new regression file added and no pre-existing test regressed. |
| REQ-005 | The no-phase legacy canonical mutation stays design-intent. | `normalizePhase` default behavior is unchanged and documented as out of scope. |
| REQ-006 | Level-1 phase docs must contain no scaffold placeholders. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` are authored with concrete content. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The regression test proves in-sync promotion is allowed (RED before the fix, GREEN after) and genuine drift still blocks with the canonical target untouched.
- **SC-002**: `promote-candidate.cjs` passes `node --check`.
- **SC-003**: The full deep-improvement Vitest suite passes (33 files, 405 tests) with no regressions versus the 403-test baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-narrowing the gate | Could let a genuinely drifted mirror through. | Keep the drift-block regression case asserting non-zero exit and an untouched target. |
| Risk | Missing canonical target (new agent) | `readFileSync(target)` would throw where the old code read the candidate. | Guard with `fs.existsSync(target)` and fall back to the candidate, preserving the prior block-on-missing-mirrors behavior. |
| Dependency | Node at `/opt/homebrew/bin` | Suite and syntax checks cannot run without it. | Use the documented PATH for all verification commands. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The fix, regression coverage, and full-suite verification are complete.
<!-- /ANCHOR:questions -->
