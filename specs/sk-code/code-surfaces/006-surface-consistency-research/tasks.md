---
title: "Tasks: sk-code surface consistency"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "surface consistency research tasks"
  - "sk-code surface remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code surface consistency

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

- [x] T001 Run round 1, 5 iterations (`research_archive/20261019T081751Z/research.md`)
- [x] T001a Run round 2, 3 iterations on doctor, scaffold and routing (`research/research.md`)
- [x] T002 Operator confirmed the sk-code-obsidian grouping and the 15-step plan as written (2026-10-19)
- [ ] T003 Record the step-1 baseline: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs`, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`, `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` (`scratch/baseline/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Step 2, wording**
- [ ] T004 [P] Replace the "no root-level `workflow-*.md` trio is assumed" line with the shared workflow-link wording (`sk-code-skilled/SKILL.md:46`, `sk-code-webflow/SKILL.md:55`)
- [ ] T005 [P] Reword the hub-union comment to name "registered surface packets" instead of one sibling (`sk-code-skilled/SKILL.md:53`, `sk-code-webflow/SKILL.md:62`, `sk-code-obsidian/SKILL.md:75`)
- [ ] T006 Rename sk-code-skilled §4 "Assets and other surface areas" to "Assets" and fix any anchor that names it (`sk-code-skilled/SKILL.md:181`)

**Step 3, section order**
- [ ] T007 Move sk-code-obsidian §5 Rules and §6 Integration points ahead of §4 Assets as §3c and §3d (`sk-code-obsidian/SKILL.md:254`, `:291`)
- [ ] T008 Grep for links to the old section anchors and update them (`.skilled/skills/sk-code/**`)

**Step 4, checklist homes**
- [ ] T009 `git mv` the 7 sk-code-obsidian checklists into `assets/checklists/` (`sk-code-obsidian/assets/`)
- [ ] T010 `git mv` `webflow-debugging-checklist.md` and `webflow-verification-checklist.md` into `assets/checklists/` (`sk-code-webflow/assets/`)
- [ ] T011 Update every path to the moved checklists: surface §2b blocks, hub RESOURCE_MAP, `ROUTER.md`, playbooks, READMEs, cross-surface references, live fixtures
- [ ] T012 Regenerate the leaf manifest and refresh the compiled route; commit step 4

**Step 5, obsidian reference grouping**
- [ ] T013 `git mv` the 13 root references into the confirmed folders (`sk-code-obsidian/references/`)
- [ ] T014 Fix relative links inside each moved file
- [ ] T015 Update every path to the moved references: obsidian §2 map and §2b block, hub RESOURCE_MAP, `ROUTER.md`, playbooks, READMEs
- [ ] T016 Regenerate the leaf manifest and refresh the compiled route; commit step 5

**Step 6, mirrors and indexes**
- [ ] T017 Run `sync-skills-hermes.cjs` and its check (`.hermes/skills/sk-code*`)
- [ ] T018 Run `advisor_rebuild`, then a hub probe per surface that resolves a moved resource
- [ ] T019 Regenerate the trigger index and run `generate-trigger-index.mjs --check`
- [ ] T019a Checkpoint: rerun the step-1 commands and compare with `scratch/baseline/`

**Step 8, surface list from the registry**
- [ ] T024 Add a fourth-surface fixture to the router-sync tests and confirm it fails on today's guard
- [ ] T025 Derive `SURFACES` and `SURFACE_PACKETS` from `mode-registry.json` `packetKind: surface`; run `legSurfaceMap` and `legBijection` over every surface; fail on a surface with no route signal or tie-break position (`verify-router-sync.cjs:33`, `:200`, `:261`)
- [ ] T026 Fix any sk-code-obsidian union mismatch the derived list exposes, in the same commit

**Step 9, union wording**
- [ ] T027 Confirm T005's wording in all three §2b blocks; load tiers stay only in `ROUTER.md`

**Step 10, replay and hint coverage**
- [ ] T028 Add Obsidian's prefix to `SURFACE_PREFIXES` and its markers to `detectSurface` (`router-replay-lib.cjs:492`)
- [ ] T029 [P] Add matched-prompt hint tests for SKILLED, OBSIDIAN and WEBFLOW and an unmatched-hint control (`compiled-route-surface-hint.test.cjs`)
- [ ] T030 [P] Add advisor workspace-marker cases for all three surfaces (`system-skill-advisor-plugin.vitest.ts`)

**Steps 11-13, doctor alignment** (after steps 4 and 5)
- [ ] T031 Add `3g-layout`, `3g-workflow-trio`, `3g-checklists-home` and `3g-reference-depth` to `parent-skill-check.cjs`, called from `checkModes(ctx)` for each surface
- [ ] T032 Add the strict `13d-surface-version` path to `checkPacketChangelogVersions`
- [ ] T033 Add an injected-violation test per new check id (`parent-skill-check-invariants.test.cjs`)
- [ ] T034 Map each check id to its repair line in the setup check's `parent-skill` judge (`sk-code-setup-check.cjs:200`)
- [ ] T035 Update the leg text in `doctor-sk-code-setup.yaml` and the summary in `/doctor:sk-code` (`.skilled/commands/doctor/sk-code.md`)

**Step 14, surface scaffold**
- [ ] T036 Create `shared/assets/surface-scaffold/` with the template `SKILL.md`, README, references tree, `assets/checklists/` and `changelog/v0.1.0.0.md`
- [ ] T037 Write `REGISTRATION.md`: every file a new surface touches, in order, with the check that proves each
- [ ] T038 Decide whether `SK_CODE_EXAMPLE_SURFACES` is derived or listed in `REGISTRATION.md` (`parent-skill-check.cjs:1164`)
- [ ] T039 Dry run: copy the scaffold into a temp hub and run the parent check and router sync on it
- [ ] T040 Link the scaffold from the hub `SKILL.md` and `shared/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run `/doctor:sk-code` and the step-1 commands, and compare with `scratch/baseline/` (`scratch/after/`)
- [ ] T021 `git grep` each old path outside `specs/` and recorded reports; expect no hits
- [ ] T022 Heading diff of the three `SKILL.md` files shows the shared order
- [ ] T023 `validate.sh specs/sk-code/code-surfaces/006-surface-consistency-research --strict` gives `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every `acceptance-criteria.md` row is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md` (round 2) and `research_archive/20261019T081751Z/research.md` (round 1)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Step-1 baseline recorded and every check passing before any edit
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Drift guards and router-sync guard pass after each step
- [ ] CHK-011 [P0] Parent-skill check and compiled-route guard pass after steps 4 and 5
- [ ] CHK-012 [P0] Each new guard or doctor test fails before its change and passes after
- [ ] CHK-013 [P1] Moved files keep their content apart from repaired relative links
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] A hub probe per surface resolves its moved resources
- [ ] CHK-022 [P1] No old path left outside `specs/` and recorded reports
- [ ] CHK-023 [P0] `/doctor:sk-code` prints `STATUS=OK legs=8` on the final tree
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-002 [P0] Consumer inventory (`git grep -F` per old path) done before each move
- [ ] CHK-FIX-007 [P1] Evidence pinned to each step's commit SHA
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-042 [P2] Surface READMEs list the moved files at their new paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-19 (planning only)
<!-- /ANCHOR:summary -->

---
