---
title: "Tasks: Phase 2: tasks-checklist-merge"
description: "Migrate the tasks and checklist contract to one level-gated document and prove compatibility for new and existing packets."
trigger_phrases:
  - "tasks checklist merge tasks"
  - "unified verification template"
  - "status compatibility"
  - "legacy packet validation"
importance_tier: "important"
contextType: "general"
---
# Tasks: Phase 2: tasks-checklist-merge

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

**Task Format**: `T### [P?] Description (file path); done when ...`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [REQ-004] Capture fresh level render baselines and existing legacy packet status (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`, `specs/`); done when the before-state covers L1/L2/L3/L3+ renders and representative legacy packets.
- [ ] T002 [REQ-004] Isolate the anchor-check divergence (`.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh`, `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js`); done when the merge has a known pass condition for required and optional anchors.
- [ ] T003 [REQ-003] Inventory the level contract and all checklist readers (`.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`); done when every producer and reader has an explicit merged-document or legacy-fallback action.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [REQ-001] Build the unified level-gated template (`.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl`); done when L1 renders tasks only and L2/L3/L3+ render tasks, verification, and testing sections with the required anchors.
- [ ] T005 [REQ-003, REQ-006] Update the level-document manifest, generator, and validator (`.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`); done when new scaffolds use the merged contract and retain priority-tag semantics.
- [ ] T006 [REQ-002] Add the legacy checklist branch to status derivation (`.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts`); done when existing packets with standalone `checklist.md` derive the same status as before.
- [ ] T007 [REQ-003, REQ-006] Retarget level detection, priority tags, and AC coverage (`.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts`, `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh`); done when the merged document is preferred, legacy files remain readable, and P0/P1/P2 tags resolve.
- [ ] T008 [REQ-004, REQ-005] Update anchor rules, reviewed snapshots, and both distribution trees (`.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh`, `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`, `.opencode/skills/system-spec-kit/scripts/dist/`, `.opencode/skills/system-spec-kit/mcp-server/dist/`); done when only the merged-document snapshot changes and compiled outputs match source.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [REQ-002] Compare status before and after across representative existing packets (`specs/sk-git/011-feature-catalog-and-manual-playbook/`, `specs/sk-git/008-research-and-requirements/`); done when every compared packet retains its prior derived status.
- [ ] T010 [REQ-004] Review the golden snapshot delta (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`); done when unchanged level-by-document renders have empty diffs and the merged document has an approved focused re-baseline.
- [ ] T011 [REQ-005] Validate fresh and legacy packets with the rebuilt distributions (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`); done when representative L1/L2/L3 and legacy strict validation exits successfully.
- [ ] T012 [REQ-002, REQ-003] Confirm rollback readiness (`002-tasks-checklist-merge/plan.md`); done when the prior template, manifest, reader bindings, snapshots, and distributions can be restored as one contract.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001 through REQ-006 each have a completed mapped task and evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Analysis**: See `../001-analysis/research/research.md`
<!-- /ANCHOR:cross-refs -->
