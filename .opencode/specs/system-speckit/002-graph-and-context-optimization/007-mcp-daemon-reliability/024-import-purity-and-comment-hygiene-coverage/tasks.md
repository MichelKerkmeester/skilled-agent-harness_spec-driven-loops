---
title: "Tasks: Import purity and comment-hygiene checker coverage"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "import purity tasks"
  - "comment hygiene checker tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/024-import-purity-and-comment-hygiene-coverage"
    last_updated_at: "2026-06-07T20:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified both agent outputs green; reconciling docs"
    next_safe_action: "Mark checklist, write impl-summary, commit and push"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-024-import-purity-and-comment-hygiene-coverage"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Import purity and comment-hygiene checker coverage

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Measure checker blast radius and trace launcher env consumers
- [x] T002 Scaffold the Level 2 packet (024)
- [x] T003 [P] Dispatch two gpt-5.5 agents on disjoint files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Defer env loading into `bootstrapLauncherEnv()` behind the entrypoint guard (.opencode/bin/mk-code-index-launcher.cjs)
- [x] T005 [P] Add the require-purity regression test (.opencode/skills/system-spec-kit/mcp_server/tests/launcher-code-index-import-purity.vitest.ts)
- [x] T006 [P] Extend checker patterns and add inline-comment scanning (.opencode/skills/sk-code/scripts/check-comment-hygiene.sh)
- [x] T007 [P] Scrub daemon-reliability perishable labels (mk-spec-memory-launcher.cjs, model-server-supervision.cjs, launcher-watchdog.vitest.ts, mk-code-index-launcher.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `node --check` on the three edited launchers and the vitest suites pass (30/30)
- [x] T009 Checker self-test and the should-flag/should-pass probes pass; the four scrubbed files return clean
- [x] T010 Fill spec docs and run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
