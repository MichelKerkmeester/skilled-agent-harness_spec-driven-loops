---
title: "Tasks: Optimize Spec-Kit Core-Document Contract and Plan Template"
description: "REQ-mapped later implementation tasks for the lifecycle-gated summary contract, task-authoritative plan phases, compatibility coverage, and regression verification"
trigger_phrases:
  - "spec-kit optimization tasks"
  - "lifecycle-gated implementation summary"
  - "plan template phase trim"
  - "contract compatibility tasks"
  - "golden snapshot tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Optimize Spec-Kit Core-Document Contract and Plan Template

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

- [x] T001 Confirm the retained four-document lifecycle and define the pre-start trio plus the post-start summary transition for REQ-001 (`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`)
- [x] T002 Add `lifecycleRequiredDocs.afterImplementationStarts` for `implementation-summary.md` at Levels 1, 2, 3, and 3+, remove the summary from each numbered-level `requiredCoreDocs`, and mark its document entry as implementation-start and lifecycle-gated for REQ-002 (`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`)
- [x] T003 Update the resolver and structure helper contract types and projections so required, optional, lazy, and lifecycle-gated documents remain distinct for REQ-002 and REQ-003 (`.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts` and `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js`)
- [x] T004 Trace the scaffold and runtime consumers against the new manifest field, preserving the anchored completed-item detector and the three-file parser contract for REQ-001 and REQ-003 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`, `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh`, `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh`, and `.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Make the default scaffold represent the planned pre-start state and preserve the later implementation-start transition that requires `implementation-summary.md` for REQ-001 and REQ-003 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`)
- [x] T006 Remove the Setup, Core Implementation, and Verification checkbox rows from `plan.md.tmpl`, retain the `phases` anchor as a concise pointer to `tasks.md`, and keep `tasks.md` as the phase-state authority for REQ-004 (`.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl`)
- [x] T007 Add the Level-1 concise N/A paths for testing, dependencies, and rollback without changing the substantive Level 2+ testing, rollback, phase-dependency, or `FIX ADDENDUM: AFFECTED SURFACES` sections, or the Level 3 and Level 3+ dependency graph section, for REQ-005 (`.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl`)
- [x] T008 Preserve legacy summary files and legacy plan phase checkboxes as valid existing-packet inputs without rewriting packet documents for REQ-006 (`.opencode/skills/system-spec-kit/scripts/rules/check-files.sh`, `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh`, and `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Assert the lifecycle contract matrix for Levels 1, 2, 3, and 3+, including the required trio, lifecycle-gated summary, document trigger, and absence behavior for REQ-002 and REQ-003 (`.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`)
- [x] T010 Run `create.sh` smoke cases for a fresh planned packet, a started packet with a completed task item, and the notation-table negative control for REQ-003 and REQ-007 (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`, `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh`, and `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh`)
- [x] T011 Render the Level-1 and Level 2+ plan templates and assert the trimmed phase section, concise Level-1 N/A behavior, preserved higher-level substantive sections, required anchors, and absence of placeholder text for REQ-004 and REQ-005 (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`)
- [x] T012 Run `validate.sh --recursive` on `specs/system-speckit/036-spec-doc-template-reduction/` and confirm existing packets with summaries and legacy plan phases produce no new failures for REQ-006 and REQ-007 (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [x] T013 Update and inspect only the intentional golden snapshot entries for the plan and scaffold shape, then run the full snapshot suite for REQ-007 (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` and `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All REQ-001 through REQ-007 acceptance criteria pass in the later implementation phase.
- [x] The four-document lifecycle remains intact, with the summary required only after implementation starts.
- [x] Level-1 plan output has no duplicated phase checkbox rows and uses `tasks.md` as the phase authority.
- [x] Level 2+ substantive plan sections and their existing gates remain intact.
- [x] Existing packets pass recursive validation without migration or new failures.
- [x] The resolver matrix, scaffold smoke cases, and golden snapshot suite pass.
- [x] The later implementation phase records its evidence in its own implementation summary.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Parent Specification**: See `../spec.md`.
- **Predecessor Phase**: See `../007-lazy-addon-docs/`.
- **Implementation Summary**: Owned by the later implementation phase; this design phase does not create it.

<!-- /ANCHOR:cross-refs -->
