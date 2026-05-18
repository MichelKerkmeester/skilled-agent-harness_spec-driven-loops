---
title: "Tasks: Subprocess env whitelist"
description: "Task ledger for Subprocess env whitelist."
trigger_phrases:
  - "018 subprocess env follow-on"
  - "subprocess env whitelist"
  - "advisor env hardening"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/023-subprocess-environment-whitelist"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "Subprocess env whitelist implemented"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Tasks: Subprocess env whitelist

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet 018 implementation summary.
- [x] T002 Audit current target files for open/closed disposition.
- [x] T003 Scaffold `023-subprocess-environment-whitelist` as Level 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Modify `.opencode/bin/mk-skill-advisor-launcher.cjs`.
- [x] T005 Modify `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`.
- [x] T006 Modify `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.
- [x] T007 Modify `Advisor tests`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run focused tests for this packet's surfaces.
- [x] T021 Run full advisor Vitest.
- [x] T022 Run strict validation for new packet docs.
- [x] T023 Commit scoped changes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Full advisor Vitest and strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
