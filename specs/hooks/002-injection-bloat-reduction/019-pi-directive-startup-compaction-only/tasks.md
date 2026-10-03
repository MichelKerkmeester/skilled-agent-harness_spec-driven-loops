---
title: "Tasks: Pi Directives-Only Fallback Dedup"
description: "Task record for the Pi directives-only fallback dedup: investigation, the shipped minimal mask, its verification, and the deferred boundary-gated follow-ups."
status: "in-progress"
completion_pct: 60
trigger_phrases:
  - "pi directives-only fallback dedup tasks"
  - "boundary-gated directive delivery tasks"
importance_tier: "high"
contextType: "implementation"
parent: "../spec.md"
predecessor: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
successor: "None"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/019-pi-directive-startup-compaction-only"
    last_updated_at: "2026-10-03T15:24:34Z"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Reconstructed tasks from the packet's own records"
    next_safe_action: "Operator runs cli-pi with SPECKIT_PI_ADVISOR_DEBUG=1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    completion_pct: 60
    open_questions:
      - "Why does cli-pi's advisor return the directives-only fallback on every turn?"
    answered_questions: []
---
# Tasks: Pi Directives-Only Fallback Dedup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

This file was reconstructed from what `spec.md`, `plan.md` and `implementation-summary.md` record. It claims no check those documents do not record.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Investigation

- [x] T001 Reproduce the directives-only gap with the CASE A/B/C harness (`pi-dedup-test.cjs`); CASE B shows full delivery every turn (spec.md section 2.1)
- [x] T002 Trace the three advisor brief shapes and confirm `renderAdvisorFallbackDirective` emits a headless `Directives:` block (spec.md section 2.1)
- [x] T003 Record the headless `pi -p` per-process store gap and the [SYS] runtime question (spec.md sections 2.2 and 2.3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `splitPiDirectiveBrief` recognizes a headless `Directives:` block and normalizes its dedup key (`hooks/pi/prompt-advisor.ts`)
- [x] T005 `decidePiDirectiveDelivery` drops its head requirement (`hooks/pi/prompt-advisor.ts`)
- [x] T006 Add the opt-in `SPECKIT_PI_ADVISOR_DEBUG=1` diagnostic line (`hooks/pi/prompt-advisor.ts`)
- [ ] T007 Cross-runtime boundary-gated redesign replacing the content-diff model (plan.md sections 1-2; deferred)
- [ ] T008 Headless `pi -p` durable-store backing (plan.md section 2; deferred)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rewrite the fail-open assertion at `directive-dedup.test.ts:81` to assert boundary dedup
- [x] T010 `npx vitest run hooks/dispatch/pi/directive-dedup.test.ts` reports 14 passed (14) (implementation-summary.md section 3)
- [x] T011 Capture the real-module before/after table for `decidePiDirectiveDelivery` (implementation-summary.md section 2)
- [ ] T012 [SYS] runtime live verification across Claude, Codex, Cursor, Devin and OpenCode (plan.md section 3; deferred)
- [ ] T013 [B] Root-cause why cli-pi returns the fallback every turn; waits on the operator's `SPECKIT_PI_ADVISOR_DEBUG=1` line
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Directives-only fallback dedups to once per boundary in Pi
- [ ] Deferred redesign, headless store and [SYS] verification closed or moved to a follow-up packet
- [ ] cli-pi fallback root cause confirmed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
