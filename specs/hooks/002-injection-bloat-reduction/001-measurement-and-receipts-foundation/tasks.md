---
title: "Tasks: Measurement & Receipts Foundation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "measurement and receipts tasks"
  - "shadow planner task list"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the task breakdown for the shadow planner and parity fixture harness"
    next_safe_action: "Author checklist.md verification items matching the requirements"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Measurement & Receipts Foundation

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

Status: Planned - this packet documents the intended implementation; no code has been written yet. All tasks are pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory the six existing renderer/emitter call sites named in research.md §3 (`render.ts`, `spec-gate-core.mjs`, `session-prime.ts`, `prompt-advisor.ts`, `mk-skill-advisor.js`, `mk-spec-memory.js`) (research.md §3)
- [ ] T002 Capture the pre-change byte-exact baseline output for representative fixtures across all six runtimes (negative control) (`tests/parity/fixtures/policy-plan/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `policy-plan.ts` with the block registry and the four named immutable v1 IDs (`.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts`)
- [ ] T004 [P] Extend the registry to the remaining inventoried blocks (governor, proof-over-appearance, SessionStart, OpenCode continuity, OpenCode compiled route) under the same ID scheme (`policy-plan.ts`)
- [ ] T005 Implement the content-hash function restricted to block ID + content (`policy-plan.ts`)
- [ ] T006 Implement the ordered policy-set hash function over a full delivery's block sequence (`policy-plan.ts`)
- [ ] T007 Implement the delivery-receipt type and builder (shadow ID, planned hash, emitted hash, byte count, lifecycle epoch, transform/message identity, host-receipt status) (`policy-plan.ts`)
- [ ] T008 [P] Wire a shadow-only planner call into the Claude/Codex/Devin shared path (`render.ts`)
- [ ] T009 [P] Wire a shadow-only planner call into the Cursor prebind path (Cursor adapter)
- [ ] T010 [P] Wire a shadow-only planner call into the OpenCode transform paths (`mk-skill-advisor.js`, `mk-spec-memory.js`)
- [ ] T011 [P] Wire a shadow-only planner call into the Pi dispatch path (`prompt-advisor.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Add planner unit tests for block ID stability, hash-input purity, and receipt shape (`tests/policy-plan.vitest.ts`)
- [ ] T013 Add byte-stable parity fixtures per runtime x {first, repeat, Gate, read-only, failure} (`tests/parity/policy-plan-serializer-parity.vitest.ts`, `tests/parity/fixtures/policy-plan/`)
- [ ] T014 Add the raw-data-leakage adversarial negative control (`tests/policy-plan.vitest.ts`)
- [ ] T015 Confirm zero output diff across the full fixture matrix against the T002 baseline (`tests/parity/policy-plan-serializer-parity.vitest.ts`)
- [ ] T016 Run the whole-package typecheck and full Vitest suite
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Unit suite, parity suite, and typecheck all green
- [ ] Zero output diff confirmed across the fixture matrix
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor phase**: `../002-opencode-route-line-bounding/`
<!-- /ANCHOR:cross-refs -->
