---
title: "Tasks: Phase 10: adapter-sk-design-live-render"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 010"
  - "adapter sk-design live-render"
  - "chrome-devtools audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 010 task list"
    next_safe_action: "Start T001 once 006-008 shapes land"
    blockers:
      - "006-adapter-sk-git-and-sk-design not yet executed"
      - "008-iterate-converge-report not yet executed"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-010"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 10: adapter-sk-design-live-render

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

- [ ] T001 Confirm phase 005 adapter contract signature is available or fall back to the design-brief-locked contract (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc/`)
- [ ] T002 Re-read `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` for currency
- [ ] T003 [P] Re-read `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` and `anti_patterns_production.md` for currency
- [ ] T004 [P] Re-read `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` to confirm this plan names no direct dispatch to it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- These tasks belong to a future execution pass, gated behind 006's static-adapter shape and 008's reducer shape. -->

- [ ] T005 [B] Implement `discover(scope)` over renderable UI targets (adapters/sk-design-live-render-adapter)
- [ ] T006 [B] Implement `standardSource(authority)` loading the live-audit rubric sources (adapters/sk-design-live-render-adapter)
- [ ] T007 [B] Implement `check(artifact, rules)` dispatching through `design-mcp-open-design` only, with `layer: live-render`-tagged findings (adapters/sk-design-live-render-adapter)
- [ ] T008 [B] Author this adapter's known-deviation/accepted-convention list (authority-local per ADR-005, distinct from phase 006's list)
- [ ] T009 [B] Wire the VERIFY-FIRST re-probe (fresh render before any finding is asserted)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- These tasks belong to a future execution pass, gated behind 006's static-adapter shape and 008's reducer shape. -->

- [ ] T010 [B] Dry-run the adapter against a real renderable target through the dispatch boundary
- [ ] T011 [B] Grep the built adapter for direct `mcp-chrome-devtools` call sites; confirm zero matches
- [ ] T012 [B] Confirm the adapter returns the documented "render unavailable" result when the transport is down
- [ ] T013 [B] Update `checklist.md` with evidence for each verified item
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
