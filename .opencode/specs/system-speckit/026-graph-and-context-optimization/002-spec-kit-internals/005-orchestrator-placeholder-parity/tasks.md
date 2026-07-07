---
title: "Tasks: Orchestrator vs shell placeholder-detection parity [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "placeholder parity tasks"
  - "validatePlaceholders tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-orchestrator-placeholder-parity"
    last_updated_at: "2026-05-29T12:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed implementation tasks; pending strict-validate"
    next_safe_action: "Run validate.sh --strict on this packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-orchestrator-placeholder-parity"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Orchestrator vs Shell Placeholder-Detection Parity

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

- [x] T001 Read orchestrator.ts validatePlaceholders + check-placeholders.sh (source files)
- [x] T002 Confirm build script and that validate.sh prefers compiled dist (package.json, validate.sh)
- [x] T003 [P] Confirm scanned-doc scope is unchanged (docsForLevel)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `[NEEDS CLARIFICATION:` space variant to the marker regex (orchestrator.ts)
- [x] T005 Add fenced-code-block toggle skip (orchestrator.ts)
- [x] T006 Add inline-backtick-escape guard on the matched marker (orchestrator.ts)
- [x] T007 Remove mustache pattern; broaden NEEDS_CLARIFICATION to underscore + space (check-placeholders.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Standalone awk/grep parity test on a fixture (matches only intended lines)
- [x] T009 Rebuild dist and confirm regex + fence/backtick logic present (npm run build, grep dist)
- [x] T010 validate.sh --strict on the packet PASSED; docs updated
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
