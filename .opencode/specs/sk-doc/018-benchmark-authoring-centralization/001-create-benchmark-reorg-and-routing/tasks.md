---
title: "Tasks: Create-Benchmark Resource Reorganization and Routing"
description: "Track the exact resource moves, consumer path rewrites, routing vocabulary additions, and required verification gates."
trigger_phrases:
  - "create benchmark reorganization tasks"
  - "benchmark routing coverage tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/001-create-benchmark-reorg-and-routing"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Recorded bounded implementation tasks"
    next_safe_action: "Execute resource moves"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Create-Benchmark Resource Reorganization and Routing

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

- [x] T001 Load `sk-doc`, `system-spec-kit`, create-benchmark, and OpenCode authoring guidance (worktree runtime).
- [x] T002 Inventory resources, consumers, routing metadata, parent packet state, and canonical templates (`git grep` over 16 basenames → 26 candidate consumers).
- [x] T003 Create the combined Level 2 child phase packet `001-create-benchmark-reorg-and-routing`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create four family subfolders under each resource root and move all 16 resources with `git mv` (`16 R` renames).
- [x] T005 Update packet-local links, paths, and resource inventory (`migrate-cb-paths.cjs` + `repair-cb-links.cjs`, 86 depth-bumps).
- [x] T006 [P] Update writable active repository consumers with path-only changes (`migrate-cb-paths.cjs`: 136 refs / 31 files; 0 residual stale).
- [x] T007 [P] Add all four family terms to `SKILL.md`, `mode-registry.json`, and `hub-router.json`.
- [x] T008 Update parent phase metadata without rewriting completed root documents (`backfill-graph-metadata.js` on 016).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Parse changed JSON and run `package_skill.py create-benchmark --check` (`PASS`; JSON both parse OK).
- [x] T010 Run exact old-path and new-path `git grep` searches; classify prohibited historical residuals separately (spec-folder logs left frozen).
- [x] T011 Complete checklist and implementation summary with command evidence (`implementation-summary.md`, `checklist.md` 24/24).
- [x] T012 Run recursive strict validation to Errors: 0 (`validate.sh --recursive --strict`).
- [x] T013 Inspect final Git status and diff without staging or committing (`git status --porcelain`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or an explicit prohibited-path residual is documented.
- [x] No `[B]` blocked tasks remain within the allowed write scope.
- [x] Package and recursive strict validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification**: See `checklist.md`.
<!-- /ANCHOR:cross-refs -->
