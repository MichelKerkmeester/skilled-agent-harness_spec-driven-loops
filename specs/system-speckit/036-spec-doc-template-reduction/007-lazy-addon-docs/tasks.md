---
title: "Tasks: Add Lazy On-Demand Add-On Documents Across Spec Kit Levels"
description: "REQ-mapped implementation tasks for adding level-agnostic lazy add-on document templates and decoupling decision records from level requirements"
trigger_phrases:
  - "lazy add-on tasks"
  - "spec-kit document templates"
  - "lazyAddonDocs tasks"
  - "decision record decoupling"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Add Lazy On-Demand Add-On Documents Across Spec Kit Levels

<!-- SPECKIT_LEVEL: 1 -->
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

All tasks map to one or more requirements in `spec.md`. These tasks describe the later implementation step; this phase authors the design documents only.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Add manifest version and document entries for `before-after.md`, `timeline.md`, and `roadmap.md` for REQ-001 and REQ-002 (`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`)
- [x] T002 [P] Create the before-and-after template with metadata, summary, comparison, net-effect, and notes/caveats anchors for REQ-002 (`.opencode/skills/system-spec-kit/templates/addons/before-after.md.tmpl`)
- [x] T003 [P] Create the chronological timeline template with metadata, ordered entries, and milestones anchors for REQ-002 (`.opencode/skills/system-spec-kit/templates/addons/timeline.md.tmpl`)
- [x] T004 [P] Create the forward-looking roadmap template with metadata, now-next-later, milestones/targets, and dependencies anchors for REQ-002 (`.opencode/skills/system-spec-kit/templates/addons/roadmap.md.tmpl`)
- [x] T005 Add `before-after.md`, `timeline.md`, `roadmap.md`, and `decision-record.md` to every level's `lazyAddonDocs` list and remove the decision record from required and optional lists for REQ-001 and REQ-003 (`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the explicit `--with-lazy-addons` opt-in and keep the default scaffold free of lazy documents for REQ-004 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`)
- [x] T007 Render the manifest-declared lazy templates when the opt-in is present and preserve existing core and optional document behavior for REQ-004 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`)
- [x] T008 Accept registered lazy documents when present and stop requiring `decision-record.md` at Level 3 and Level 3+ for REQ-005 and REQ-006 (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [x] T009 Keep the contract resolver manifest-driven and update its contract assertions for the four lazy document names at all levels for REQ-001 and REQ-003 (`.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts`)
- [x] T010 Update resolver tests to assert required, optional, and lazy classification for Levels 1, 2, 3, and 3+ for REQ-003 and REQ-007 (`.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`)
- [x] T011 Update the level-document table so it distinguishes lazy add-ons from required and optional documents for REQ-008 (`CLAUDE.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P] Assert every new template has the required frontmatter, anchors, section order, and no placeholder markers for REQ-002 (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`)
- [x] T013 [P] Extend scaffold tests for the default path and the explicit `--with-lazy-addons` path for REQ-004 (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`)
- [x] T014 [P] Update golden snapshot entries for the three new rendered templates without changing unrelated snapshots for REQ-007 (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`)
- [x] T015 Run the manifest and resolver matrix for all four levels and confirm the four lazy names and zero decision-record required entries for REQ-001 and REQ-003 (`.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`)
- [x] T016 Run scaffold and validator cases with and without lazy files, including existing Level 3 and Level 3+ decision records, for REQ-005, REQ-006, and REQ-009 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh` and `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [x] T017 Run the golden snapshot suite and inspect the scoped implementation diff for REQ-007, REQ-008, and REQ-009 (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All REQ-001 through REQ-009 acceptance criteria pass.
- [x] No lazy add-on file appears on the default scaffold path.
- [x] The explicit opt-in creates the four registered lazy add-on files.
- [x] Level 3 and Level 3+ packets pass validation with or without `decision-record.md`.
- [x] The resolver tests, golden snapshots, and `CLAUDE.md` table match the manifest.
- [x] The later implementation step records its verification evidence in its implementation summary.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Parent Specification**: See `../spec.md`.
- **Implementation Summary**: Owned by the later implementation phase; this design phase does not create it.

<!-- /ANCHOR:cross-refs -->

