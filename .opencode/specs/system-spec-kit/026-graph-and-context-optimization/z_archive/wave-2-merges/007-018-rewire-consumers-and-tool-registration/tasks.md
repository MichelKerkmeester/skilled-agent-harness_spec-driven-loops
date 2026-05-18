---
title: "Tasks: Rewire consumers and tool registration"
description: "Task list for updating imports, Vitest ownership, and plugin bridge path after the code-graph move."
trigger_phrases:
  - "004 rewire consumers tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/018-rewire-consumers-and-tool-registration"
    last_updated_at: "2026-05-14T08:15:39Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 004 task ledger"
    next_safe_action: "Later phases can continue from green typecheck/Vitest smoke"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Rewire consumers and tool registration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[x]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Inventory old `code_graph/` imports, mocks, and dynamic imports.
- [x] T002 Confirm plugin auto-load path.
- [x] T003 Identify Vitest config ownership changes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Rewire system-spec-kit handlers.
- [x] T011 Rewire context-server and tools registration.
- [x] T012 Rewire hooks.
- [x] T013 Rewire session-library consumers.
- [x] T014 Rewire external tests and mocks.
- [x] T015 Rewire skill_advisor type/bench imports.
- [x] T016 Update system-spec-kit Vitest config.
- [x] T017 Update system-code-graph Vitest config.
- [x] T018 Update compact code-graph plugin bridge path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Strict-validate this packet.
- [x] T021 Run system-spec-kit typecheck.
- [x] T022 Run system-code-graph Vitest smoke.
- [x] T023 Record import rewrite count and command exits. (214 rewires; TS=0; Vitest=0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] Typecheck exit recorded.
- [x] Vitest exit or skipped cause recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `005-code-graph/013-system-code-graph-extraction`
- Atomic sibling: `014/003-physical-move-and-database`
- ADR: `014/001-design-and-decision-record/decision-record.md`
<!-- /ANCHOR:cross-refs -->
