---
title: "Feature Specification: P2 Test Adequacy and Source-Only Audit"
description: "Replace the deep-loop-runtime JSONL append test that ran two child writers sequentially with a genuinely concurrent child-process harness that races two processes through the real appendJsonlRecord fn."
trigger_phrases:
  - "p2 test adequacy"
  - "genuinely concurrent jsonl append test"
  - "child process append harness"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/008-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit"
    last_updated_at: "2026-06-29T14:45:00Z"
    last_updated_by: "claude"
    recent_action: "Made the JSONL concurrent append test genuinely concurrent via a child-process barrier"
    next_safe_action: "Finalize the 009 parent and 156 parent metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "p2-test-adequacy-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The append test must spawn two child processes through the real appendJsonlRecord fn behind a control-dir barrier, not run two blocking spawnSync calls in sequence."
---
# Feature Specification: P2 Test Adequacy and Source-Only Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | current workspace |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-tighten-playbook-pass-criteria |
| **Successor** | 007-fan-out-hardening |
| **Handoff Criteria** | The JSONL append concurrency test races two child processes through the real append fn and the deep-loop-runtime suite stays green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase closes a test-adequacy gap flagged in the deep-review: a "concurrent" test that did not exercise genuine cross-process concurrency.

**Scope Boundary**: The JSONL append concurrency test in `jsonl-repair.vitest.ts`. The atomic-state concurrent diff-gated append test already used a genuine child-process barrier; the goal-plugin test adequacy and the playbook source-only audit were completed earlier in the remediation (plugin tests, and phase 005 respectively).

**Dependencies**:
- The real `appendJsonlRecord` fn and the `spawn-cjs` test helper.

**Deliverables**:
- A genuinely concurrent child-process JSONL append test.
- Level-1 phase documentation with verification evidence.

**Changelog**:
- Parent changelog refresh is out of scope for this narrow remediation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The JSONL append test named "keeps concurrent append records parseable at record boundaries" ran two child writers with blocking `spawnSync` calls — left fully completed before right started — and wrote through raw `appendFileSync` rather than the real `appendJsonlRecord` fn. It therefore could not catch a concurrency regression in the production append path.

### Purpose
Race two child processes through the real `appendJsonlRecord` fn behind a control-dir barrier and assert every row from both writers survives and stays parseable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `writeAppendWriter` / `runAppendWriter` helpers that spawn a child writer through the real `appendJsonlRecord` fn.
- Replace the sequential `spawnSync` append test with a barrier-synchronized, genuinely concurrent two-process test.

### Out of Scope
- The atomic-state concurrent diff-gated append test (already genuine).
- The goal-plugin tests (already adequate).
- The playbook source-only audit (completed in phase 005).
- An in-process write barrier (rejected: the prior attempt timed out).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts` | Modify | Replace the sequential append test with a concurrent child-process harness. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit/spec.md` | Modify | Replace scaffold placeholders with concrete specification. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit/plan.md` | Modify | Replace scaffold placeholders with concrete plan. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit/tasks.md` | Modify | Replace scaffold placeholders with concrete task tracking. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit/implementation-summary.md` | Modify | Document implementation and verification state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The append test must race two child processes. | Two child writers signal ready, are released together by a control-dir barrier, and run concurrently. |
| REQ-002 | The writers must use the real append fn. | The child writer appends through `appendJsonlRecord`, not raw `appendFileSync`. |
| REQ-003 | Every row from both writers must survive and stay parseable. | The file holds 2x the per-writer count, split evenly by writer, and `repairJsonlTail` reports no repair. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The deep-loop-runtime suite must stay green. | The full suite passes (60 files / 545 tests). |
| REQ-005 | The rewritten test must be stable, not flaky. | The test file passes repeatedly in isolation. |
| REQ-006 | Level-1 phase docs must contain no scaffold placeholders. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` are authored with concrete content. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The append test spawns two concurrent child processes through `appendJsonlRecord` and asserts all rows survive parseable.
- **SC-002**: The deep-loop-runtime suite passes (60 files / 545 tests).
- **SC-003**: The rewritten test passes five consecutive isolated runs with no failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | In-process barrier | The prior attempt timed out under the suite. | Use a cross-process control-dir file barrier with child processes. |
| Risk | Barrier or spawn timeout under load | Could flake the test. | The suite config sets `fileParallelism: false` and a 30s test timeout; the barrier deadlines are generous. |
| Dependency | `appendJsonlRecord` and `spawn-cjs` helper | The test depends on them. | Both present and stable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The rewrite is complete and verified stable.
<!-- /ANCHOR:questions -->
