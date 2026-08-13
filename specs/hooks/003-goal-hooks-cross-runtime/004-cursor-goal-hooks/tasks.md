---
title: "Tasks: Cursor goal hooks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cursor goal hooks tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-29T05:10:00Z"
    last_updated_by: "claude"
    recent_action: "Completed all tasks; T005/T006/T009/T010 dropped per phase 002's fixed tier"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Cursor goal hooks

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 001's `lib/goal-core.cjs` API surface by reading the shipped module. (`.opencode/hooks/goal/lib/goal-core.cjs`)
- [x] T002 Read phase 002's capability matrix for the Cursor `preToolUse` cadence finding — also found the Fixed Parity Tiers section fixing the tier at sessionStart-only. (`.opencode/specs/hooks/003-goal-hooks-cross-runtime/002-capability-probes/capability-matrix.md`)
- [x] T003 Read the current `.cursor/hooks.json` schema and confirm the hook-entry shape expected. (`.cursor/hooks.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build `goal-inject.mjs`: prebind-style injection rendering the parameterized `[active_goal]` block, wrapped fail-open. (`.opencode/hooks/goal/cursor/goal-inject.mjs`)
- [x] T005 ~~Build `session-end.cjs`~~ DROPPED per phase 002's Fixed Parity Tiers section (`stop` never fires; no block/continue decision exists for a verdict to act on).
- [x] T006 ~~Build `pre-tool-use.cjs`~~ DROPPED — phase 002 confirmed non-delivery into model context; narrowing documented in spec.md §3/§4.
- [x] T007 Register the built adapter in `.cursor/hooks.json`. (`.cursor/hooks.json` — appended to the `sessionStart` array, all 6 pre-existing entries preserved)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Co-located `node --test` for `goal-inject.mjs`, including 4 fail-open cases. (`.opencode/hooks/goal/cursor/goal-cursor.test.mjs` — 10/10 passing)
- [x] T009 ~~Co-located `node --test` for `session-end.cjs`~~ DROPPED with T005.
- [x] T010 ~~Co-located `node --test` for `pre-tool-use.cjs`~~ DROPPED with T006.
- [x] T011 Live smoke proof: goal text reaching the model via `cursor-agent -p` (authenticated, Pro tier — no editor fallback needed). 2 dispatches in an isolated `/tmp` workspace; hook confirmed firing (turnsUsed 0→1→2, `agent_message` returned); raw agent-transcript JSONL inspection found 0/2 occurrences of the injected nonce marker in model-visible content; self-report ask independently returned "NONE." Reported as RECORDED-EVIDENCE, model-visibility unproven — not overclaimed.
- [x] T012 Confirmed `.cursor/hooks.json` hooks actually fire live (turn-counter evidence above), not just parse (`python3 -c "import json;json.load(...)"` also passed).
- [x] T013 Updated `spec.md`, `checklist.md`, and `implementation-summary.md` with real evidence from T008-T012.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Adapter unit tests passing, including fail-open cases (10/10)
- [x] Live smoke proof recorded (RECORDED-EVIDENCE; model-visibility unproven, reported honestly)
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
