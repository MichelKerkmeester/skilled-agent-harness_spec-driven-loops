---
title: "Tasks: Full-First + Route-Only Repeats"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "full first route only repeats tasks"
  - "delivery state machine task list"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the task breakdown for the delivery-state machine and negative controls"
    next_safe_action: "Author checklist.md verification items matching the requirements"
    blockers:
      - "Blocked on phases 001-003 shipping receipts, bounding, and dedup first"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Full-First + Route-Only Repeats

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

Status: Complete - the receipt-gated shadow state machine, route-only accounting, lifecycle handling, and parity controls are verified; the candidate remains off.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 001, 002, and 003 are shipped and green (`../001-measurement-and-receipts-foundation/`, `../002-opencode-route-line-bounding/`, `../003-opencode-transform-dedup/`)
- [x] T002 Reproduce research.md's 10-turn representative scenario as a fixture baseline (research.md §6 Before/After Cost Model)
  - **Evidence**: `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts:241-278`; `SHADOW_REDUCTION observedReceipt=true baselineBytes=9626 shadowBytes=1715 reductionPct=82.2`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement the delivery-state machine (`UNSEEN`/`DELIVERED`/`SUPPRESSED_SAME`) (`.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts`)
- [x] T004 Implement the epoch resolver mapping lifecycle/compaction/scope/policy/goal signals to epoch advancement (`policy-plan.ts`)
- [x] T005 Implement dirty-marking on semantic content-hash change (`policy-plan.ts`)
- [x] T006 Implement the confirmed-session-identity requirement; unknown sessions never share or read state (`policy-plan.ts`)
- [x] T007 [P] Implement the shadow-first route-only renderer, not consumed by the emitted response (`.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts`)
- [x] T008 [P] Wire lifecycle/session-identity signals from the Claude/Codex/Devin shared path (`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`)
- [x] T009 [P] Wire lifecycle/session-identity signals from the OpenCode advisor component (`.opencode/plugins/mk-skill-advisor.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Add state-machine transition tests: first delivery, same-epoch repeat, dirty content, epoch advance (`.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts`)
- [x] T011 Add the unknown-session-isolation fixture (`policy-plan.vitest.ts`)
- [x] T012 Author the long-context negative control (`.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan-negative-controls.vitest.ts`)
- [x] T013 Author the advisor-failure negative control (`policy-plan-negative-controls.vitest.ts`)
- [x] T014 Author the no-match negative control (`policy-plan-negative-controls.vitest.ts`)
- [x] T015 Author the comment-writing negative control (`policy-plan-negative-controls.vitest.ts`)
- [x] T016 Author the completion-proof negative control (`policy-plan-negative-controls.vitest.ts`)
- [x] T017 Author the resume negative control (`policy-plan-negative-controls.vitest.ts`)
- [x] T018 Author the compaction negative control (`policy-plan-negative-controls.vitest.ts`)
- [x] T019 Reproduce research.md's modeled 82.2% reduction in shadow logs for the 10-turn scenario without changing emitted output (`policy-plan.vitest.ts`)
- [x] T020 Confirm legacy renderers remain byte-identical with no activation flag set, across every fixture (`policy-plan.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All seven behavioral negative controls green
- [x] Shadow-modeled savings match research.md's formula; emitted output unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor phase**: `../003-opencode-transform-dedup/`
- **Successor phase**: `005-gate3-relay-edge-triggering` (not yet authored; named in the parent's Phase Documentation Map)
<!-- /ANCHOR:cross-refs -->
