---
title: "Feature Specification: Rollback Candidate Hash Hardening"
description: "Enforce promoted-candidate-only rollback authority in the deep-improvement rollback path. Rollback-candidate.cjs now requires the current target to equal the promoted candidate hash exclusively; pre-ship rollback is intentionally removed."
trigger_phrases:
  - "rollback candidate hash hardening"
  - "promoted-candidate-only rollback authority"
  - "assertRollbackHashGuard fix"
  - "pre-ship rollback removed"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/003-rollback-candidate-hash-hardening"
    last_updated_at: "2026-08-13T14:27:57.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented the landed fix in commit c4fc339e83, verified via git show and vitest"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does removing pre-ship rollback break any other caller? No; the benchmark's own pre-ship-rollback test case was updated in the same commit to expect the new rejection."
---
# Feature Specification: Rollback Candidate Hash Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `system-deep-loop/0144-036-p0-remediation` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`assertRollbackHashGuard` in `rollback-candidate.cjs` accepted either the pre-acceptance target hash OR the promoted-candidate hash as a valid current-target state before authorizing rollback. That dual acceptance meant a stale or pre-ship target state could authorize rollback of the wrong canonical target, since acceptance alone (before the candidate ever shipped) was sufficient to pass the guard.

### Purpose

Require the current target to equal the promoted candidate hash exclusively, so rollback can only target the state the receipt actually promoted. This is a deliberate behavior change: pre-ship rollback is removed, not merely narrowed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `assertRollbackHashGuard` in `rollback-candidate.cjs`: remove the `expectedRollbackSourceHashes` dual-hash helper and require `currentTargetHash === acceptedState.candidateHash` exclusively.
- Updating the benchmark's pre-ship-rollback test case to expect rejection instead of success.
- Adding a negative test proving a receipt-valid pre-acceptance target is now rejected.

### Out of Scope

- Any other rollback or promotion path outside `rollback-candidate.cjs` and its direct test coverage.
- Documenting or fixing the other findings surfaced by `001-runtime-code-review`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` | Modify | Remove dual-hash acceptance; require promoted-candidate hash exclusively |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Modify | Update the pre-ship-rollback case to expect rejection |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/rollback-candidate-hash-guard.vitest.ts` | Modify | Add the negative test proving pre-acceptance targets are rejected |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `assertRollbackHashGuard` accepts only the promoted candidate hash as the valid current-target state | Any current target matching `preAcceptTargetHash` but not `candidateHash` is rejected with "unexpected canonical target state" |
| REQ-002 | Negative test proves a receipt-valid pre-acceptance target is rejected | A red-before/green-after test in `rollback-candidate-hash-guard.vitest.ts` demonstrates the rejection |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Benchmark's pre-ship-rollback case reflects the new behavior | `promote-candidate-benchmark.vitest.ts`'s pre-ship case expects status 1 and the "unexpected canonical target state" stderr message |
| REQ-004 | Per-file vitest for both touched test files passes | `vitest run` on `rollback-candidate-hash-guard.vitest.ts` and `promote-candidate-benchmark.vitest.ts` is green |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A pre-acceptance (pre-ship) target hash no longer authorizes rollback; only the promoted candidate hash does.
- **SC-002**: Per-file vitest for the two touched test files is green with no regression.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing pre-ship rollback is a deliberate behavior change | Any caller relying on rolling back before ship now fails | Confirmed no other caller depends on pre-ship rollback; the benchmark's own test case was the only affected consumer, and it was updated in the same commit |
| Dependency | `sha256File` hashing utility | Guard correctness depends on a stable hash of the target file | Unchanged by this fix; pre-existing dependency |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
