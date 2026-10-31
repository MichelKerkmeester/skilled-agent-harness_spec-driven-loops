---
title: "Tasks: Restructure Spec-Kit Template Folders"
description: "Completed REQ-mapped tasks for the role-based template move, root contract promotion, resolver updates, consumer repointing, compatibility, and verification."
trigger_phrases:
  - "template folder restructure tasks"
  - "role-based template migration"
  - "resolver path update"
  - "template contract tasks"
  - "spec-kit compatibility verification"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Restructure Spec-Kit Template Folders

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

All tasks map to one or more requirements in `spec.md`. Every task in this completed phase is marked `[x]`.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Move the 16 template sources into `core/`, `addons/`, and `packet-types/`, then remove the empty `manifest/` directory for REQ-001 (`.opencode/skills/system-spec-kit/templates/`)
- [x] T002 Promote `spec-kit-docs.json`, `EXTENSION-GUIDE.md`, and `MIGRATION.md`; rename the former manifest README to `CONTRACT.md` for REQ-002 (`.opencode/skills/system-spec-kit/templates/`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Update `_manifest_template_path` to search `core`, `addons`, and `packet-types`, with a template-root fallback, for REQ-003 (`.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh`)
- [x] T004 Update phase-parent scaffold resolution and both source and distribution manifest paths for REQ-003 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh` and `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts`)
- [x] T005 Repoint the five named tests and update reference and related guidance paths for REQ-004 (`.opencode/skills/system-spec-kit/scripts/tests/` and `.opencode/skills/system-spec-kit/mcp-server/tests/`)
- [x] T006 Preserve stable template basenames and existing packet behavior through the manifest-driven resolver and scaffold contract for REQ-005 (`.opencode/skills/system-spec-kit/templates/`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Record the completed scaffold matrix for Levels 1, 2, 3, 3+, phase-parent, and `--with-lazy-addons`, including `FILE_EXISTS`, for REQ-006 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`)
- [x] T008 Record 9/9 golden snapshots, green research-gating, memory-contract, and thin-continuity checks, TypeScript exit 0, and the MCP distribution rebuild for REQ-006 (`.opencode/skills/system-spec-kit/scripts/tests/` and `.opencode/skills/system-spec-kit/mcp-server/`)
- [x] T009 Isolate the workflow-invariance taxonomy-leak failure at `feature-catalog/governance/feature-flag-governance.md` and record that it fails at HEAD too for REQ-006 (`.opencode/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All REQ-001 through REQ-006 acceptance criteria are documented with tree, diff, or supplied verification evidence.
- [x] The 16 source templates occupy the three role-based folders and the former `manifest/` directory is absent.
- [x] Root contract assets and the renamed `CONTRACT.md` exist.
- [x] Runtime lookup, phase-parent scaffolding, tests, and reference paths use the new layout.
- [x] Stable basenames and existing packet compatibility are preserved.
- [x] Verification evidence and the known pre-existing failure are recorded without claiming a rerun during packet authoring.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Parent Specification**: See `../spec.md`.
- **Predecessor Phase**: See `../008-plan-and-contract-optimization/`.
- **Implementation Summary**: See `implementation-summary.md`.

<!-- /ANCHOR:cross-refs -->

