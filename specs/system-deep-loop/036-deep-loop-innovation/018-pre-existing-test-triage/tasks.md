---
title: "Tasks: Pre-Existing Runtime Test-Failure Triage"
description: "Task breakdown for triaging the pre-existing runtime test failures and fixing the sk-prompt census drift."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-pre-existing-test-triage"
    last_updated_at: "2026-08-26T10:03:52.975Z"
    last_updated_by: "claude"
    recent_action: "Authored the triage task list"
    next_safe_action: "Commit + push"
trigger_phrases: []
---
# Tasks: Pre-Existing Runtime Test-Failure Triage

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the 7 failing unit tests; capture real reasons (`vitest run`)
- [x] T002 Confirm disk + manifest both use `sk-prompt-models`
- [x] T003 Identify the drift source (`state-backend-census.json:386`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the census `resolvedPath` to `sk-prompt-models`
- [x] T005 Verify `legacy-projections.test.ts` passes (15/15) + JSON valid

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Classify the remaining 9 (environment-only vs risky-unrelated) in `implementation-summary.md`
- [ ] T007 Commit + push

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The census fix lands and its test passes
- [x] The remaining 9 failures are classified with recommendations
- [ ] Committed + pushed

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Summary**: See `implementation-summary.md`
- **Source suite**: `017-runtime-latent-issue-remediation` (clean whole-suite gate)

<!-- /ANCHOR:cross-refs -->
