---
title: "Tasks: Trigger-turn self-binding for the spec-gate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec gate self binding tasks"
  - "classifyIntent tasks"
  - "trigger turn binding tasks"
  - "spec-gate-core tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/002-trigger-turn-self-binding"
    last_updated_at: "2026-07-11T11:05:57.148Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 task breakdown for trigger-turn self-binding"
    next_safe_action: "Start T001 by capturing a green baseline test run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-trigger-turn-self-binding"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Trigger-turn self-binding for the spec-gate

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

- [ ] T001 Capture a green baseline of the full core suite (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T002 Confirm the classifier dist exports `classifyPrompt(prompt, options)` and `validateSpecFolderBinding` (`.opencode/skills/system-spec-kit/shared/dist/gate-3-classifier.js`)
- [ ] T003 [P] Map the reuse boundary between `answerParse` and the new extractor (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `extractSpecFolderCandidate()` helper: spec-path token then bare `NNN-slug`, no letter/skip logic (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T005 Thread `request.classificationOptions` into `classifyPrompt` and map `triggersGate3 && !requiresGate3Prompt && satisfiedBy` to a `satisfied` persist (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T006 Add the trigger-turn self-binding branch: on `triggersGate3`, options-satisfaction first, then token self-binding via `validateSpecFolderBinding({ workspaceRoot: dir })`, else open as today (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T007 Keep fail-open and kill-switch paths intact - the new logic lives inside the existing `try`, so a validation throw still evicts state and returns `closed` (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add self-binding tests: trigger+valid path -> satisfied -> Write allowed under enforce; trigger+valid bare `NNN-slug` -> satisfied; trigger+invalid/none -> open (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T009 Add options-threading tests via module-mock: `satisfiedBy` set -> satisfied; `requiresGate3Prompt` true -> open (regression guard) (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T010 Run `node --test` and `node --experimental-test-module-mocks --test`, confirm no `shared/`/`mcp_server/` edits, and refresh spec/plan/tasks/checklist evidence (`.opencode/specs/system-speckit/006-spec-gate-enforce-readiness/002-trigger-turn-self-binding/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
