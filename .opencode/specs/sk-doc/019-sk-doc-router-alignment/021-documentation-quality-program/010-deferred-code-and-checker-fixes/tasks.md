---
title: "Tasks: Deferred Code and Checker Fixes"
description: "Fix 10a, flip skill/command, record the not-fixed decisions, and verify each."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "All deferred fixes applied and verified."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files: []
---

# Tasks: Deferred Code and Checker Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Reproduce the 10a failure across the non-sk-doc hubs and locate the hardcoded per-hub generator path in `parent-skill-check.cjs`.
- [x] T002 Scan skill and command headers with the refined `is_uppercase_section`, and investigate `RIG_ROOT`, `dispatch-swe16` and the HVR sweep on disk.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Resolve the 10a generator and contract library from `sk-doc/create-skill/scripts/` in `parent-skill-check.cjs`.
- [x] T004 Add `resourceContractVersion` to `sk-code/mode-registry.json` and regenerate `mcp-tooling/leaf-manifest.json`.
- [x] T005 Flip `h2UppercaseRequired` for skill and command in `template-rules.json` and uppercase the 2 SKILL.md offenders (`code-opencode`, `create-flowchart`).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm 10a/10b/10d pass on all seven hubs and `node --check` is clean on `parent-skill-check.cjs`.
- [x] T007 Validate all 49 SKILL.md and 51 command files pass with `validate_document.py`.
- [x] T008 Record the `RIG_ROOT`, `dispatch-swe16` and HVR-sweep not-fixed decisions in `context-index.md`.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All hubs pass 10a/10b/10d and all SKILL.md/command files pass the flip
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
