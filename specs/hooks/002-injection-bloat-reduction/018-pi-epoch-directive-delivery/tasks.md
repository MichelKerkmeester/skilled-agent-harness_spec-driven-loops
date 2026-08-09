---
title: "Tasks: Pi Epoch-Based Directive Delivery"
description: "Completed task record for verifying full and compact Pi dispatch semantics while retaining default-disabled compact delivery."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi epoch directive delivery tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "015-pi-headless-fallback-dedup; 006-pi-dispatch-and-compaction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-pi-epoch-directive-delivery"
    last_updated_at: "2026-08-09T14:53:00Z"
    last_updated_by: "sol"
    recent_action: "Verified Pi dispatch semantics and lifecycle resets"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:ff8afd0fb5f4922a62a2461b2189c65dc1b6bf534684fa0a774a8aadb91d8ca8"
      session_id: "2026-08-09-pi-epoch-directive-delivery"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Pi Epoch-Based Directive Delivery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers will remain stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Inspected the full and compact Pi dispatch directive forms and the existing lifecycle reset paths. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-002 Mapped the five required dispatch semantics to focused assertions for both directive forms. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-003 Confirmed startup, resume, fork, and compact already cleared the delivery epoch. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Added `compact-dispatch-semantics.test.ts` with focused full-form and compact-form coverage. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-005 Proved the full Pi dispatch directive preserved all five required semantics. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-006 Proved the compact directive text preserved all five required semantics. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-007 Verified existing lifecycle resets re-armed full delivery without a runtime change. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-008 Kept `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` disabled by default. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 Ran the new compact-dispatch semantics test with 11 passing assertions. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-010 Ran the full Pi suite with 70 passing tests. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-011 Recorded that compact activation remained deferred pending an operator decision. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
- [x] T-012 Confirmed the phase required only the focused test addition and packet reconciliation, with no runtime change. Evidence: `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` (11 assertions) and `npx vitest run pi/` (70 passed).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- A confirmed, observed same-hash repeat in the current epoch will reduce both advisor shapes; the headed route line will remain and the headless advisor block will be removed.
- Existing lifecycle resets retained full re-delivery after startup, resume, fork, and compact.
- The compact candidate text passed all five semantic checks but remained disabled pending an operator decision.
- The new 11-assertion test and the 70-test Pi suite passed; no runtime change was required.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Epoch architecture, test approach, and rollback: `plan.md`.
- Intended verification gates: `checklist.md` and `implementation-summary.md`.
- Research recommendation and migration step: `../014-injection-surface-deprecation-research/research/research.md`.
- Headless fallback predecessor: `../015-pi-headless-fallback-dedup/`.
- Compact-dispatch semantics predecessor: `../006-pi-dispatch-and-compaction/`.
<!-- /ANCHOR:cross-refs -->
