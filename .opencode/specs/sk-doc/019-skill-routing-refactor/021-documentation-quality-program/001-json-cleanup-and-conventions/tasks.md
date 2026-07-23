---
title: "Tasks: JSON Cleanup and Advisor-Metadata Conventions"
description: "Harden-then-remove task list: doctrine, checker rule 2b, AGENTS.md, then the residue deletion and verification."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/001-json-cleanup-and-conventions"
    last_updated_at: "2026-07-22T12:29:01Z"
    last_updated_by: "claude"
    recent_action: "All tasks shipped and verified."
    next_safe_action: "Proceed to phase 002."
    blockers: []
    key_files: []
---

# Tasks: JSON Cleanup and Advisor-Metadata Conventions

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

- [x] T001 Confirm `sk-prompt/prompt-models/description.json` is dead residue (grep proof from the JSON audit) and identify rule 2a in `.opencode/commands/doctor/scripts/parent-skill-check.cjs` as the pattern to mirror.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the "no per-packet `description.json`" statement to `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md` (mirroring the existing graph-metadata sentence).
- [x] T003 Add `findDescriptionJson` + recursive rule 2b to `.opencode/commands/doctor/scripts/parent-skill-check.cjs`.
- [x] T004 Add the two-schema disambiguation and placement rule to `AGENTS.md` (§8).
- [x] T005 Delete `.opencode/skills/sk-prompt/prompt-models/description.json` via `git rm`.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm rule 2b FAILs before removal and PASSes after, via `parent-skill-check.cjs .opencode/skills/sk-prompt`.
- [x] T007 `node --check .opencode/commands/doctor/scripts/parent-skill-check.cjs` passes; repo-wide `find` shows no nested `description.json` in a checked hub.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Rule 2b regression green
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
