---
title: "Tasks: Version-Suffix Flag-Name Cleanup [template:level_2/tasks.md]"
description: "Task breakdown for the hard clean rename that drops the _V1 suffix from twelve live SPECKIT flags across the live reader code, every live consumer, every test and the live reference docs, leaving every archived and historical record untouched."
importance_tier: "supporting"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/005-flag-name-cleanup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tracked the enumerate, rename and verify tasks to done"
    next_safe_action: "User reviews the deliberate non-renames and commits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts"
    completion_pct: 100
---
# Tasks: Version-Suffix Flag-Name Cleanup

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

- [x] T001 Enumerate the full version-flag set with `rg -oN 'SPECKIT_[A-Z0-9_]*_V[0-9]+' .opencode | sort -u` and confirm the twelve named flags plus the non-target families
- [x] T002 [P] Classify each non-target family, `SPECKIT_PIPELINE_V2` documented dead, the `SPECKIT_EVAL_V2_*` knobs harness config, the remainder archive-only or record-only (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [x] T003 Compute the explicit live-file list by searching for the twelve names under the live tree and excluding `z_archive`, `z_future`, dead logs and the 028 spec-doc record tree
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the exact-name substitution stripping `_V1` from only the twelve names across the readers and live consumers (`.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`)
- [x] T005 [P] Rename every set and assert of the twelve names in the affected vitest files (`.opencode/skills/system-spec-kit/mcp_server/tests/session-state.vitest.ts`)
- [x] T006 [P] Rename the twelve names in the live reference docs, the playbook, the catalog and the command surfaces (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
- [x] T007 Add the renamed flags to the `flag-ceiling.vitest.ts` drift-guard acknowledged list the rename surfaced was already drifting on the pre-existing names (`.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm zero of the twelve `_V1` names remain in `.opencode/skills` and no archived record, dead log or 028 spec-doc record was modified
- [x] T009 Run both `mcp_server` typechecks, both exit 0, and run the affected vitest suite, all green including the drift guard
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
