---
title: "Tasks: Phase 13: clear-pre-existing-ci-and-doc-debt"
description: "Ordered tasks for clearing the two red CI workflows, guarding the Hermes mirrors and removing the retired skill-benchmark lane."
trigger_phrases:
  - "pre-existing ci debt tasks"
  - "skill-benchmark removal tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: clear-pre-existing-ci-and-doc-debt

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

- [x] T001 Capture the baseline at `d10ec9d549`: node runner, spec-kit vitest, scorer ratchet, playbook validator
- [x] T002 Read each red workflow's failure list from its CI log
- [x] T003 Dump the route of all 289 advisor prompts at the last green commit and at the tip, and diff them
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Name what a deep-review wave produces in the deep-loop hub keywords (`.skilled/skills/system-deep-loop/SKILL.md`)
- [x] T005 [P] Set sk-design's router version to its release authority (`.skilled/skills/sk-design/ROUTER.md`)
- [x] T006 [P] State the seven-model Hermes roster in the hub summary (`.skilled/skills/cli-external-orchestration/graph-metadata.json`)
- [x] T007 [P] Fix the eleven playbook violations in five scenario files
- [x] T008 [P] Add the `hermes-mirror` job and its README row (`.github/workflows/command-tree-parity.yml`)
- [x] T009 Delete the lane's template, storage guide, serving-snapshot schema, two scripts and two scenarios (`.skilled/skills/sk-doc/sk-create-benchmark/`)
- [x] T010 Remove the family from the packet's `SKILL.md`, renumber its sections, and update the four documents that cite them
- [x] T011 Remove the lane's alias from the sk-doc hub and regenerate its leaf manifest
- [x] T012 Drop re-run sections and removed-guide links from eleven benchmark READMEs, keeping accurate retirement notes as written
- [x] T013 Delete the two compiled-routing parity scenarios, and resolve the chart scenario's second stage by hand
- [x] T014 Stop the scaffolder writing the retired run command (`.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py`)
- [x] T015 Rewrite the playbook-authoring skill's persistence contract to record results by hand
- [x] T016 Regenerate the Hermes copies
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Rerun the whole local gate at `cafeff809e` and compare with the baseline
- [x] T018 Confirm all 289 prompts route as before
- [x] T021 Recompile the three deep command contracts whose recorded hub digest the keyword change made stale (`.skilled/commands/deep/assets/compiled/`)
- [ ] T019 Rebase the phase commits onto the main checkout's tip, fast-forward it, and push both branches after the operator's go-ahead
- [ ] T020 Watch CI until the three target workflows pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Every commit passed the pre-commit gates
- [x] CHK-011 [P0] No console errors or warnings introduced. The node runner's one failure is the baseline's
- [x] CHK-012 [P1] Error handling implemented. The mirror job exits 1 on drift
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. AC-007 waits on CI after the push
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested. Live-lane READMEs kept their run sections
- [x] CHK-023 [P1] Error scenarios validated. `--check` exits 1 on a stale copy
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class. Routing: `algorithmic`. Version and summary: `instance-only`. Playbook: `instance-only` per scenario. Mirrors: `class-of-bug`. Retired lane: `cross-consumer`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with the `rg` census in `plan.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for every deleted file and removed alias.
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction code changed. Not applicable.
- [x] CHK-FIX-005 [P1] Matrix axes listed: six prompt buckets by two commits, 289 rows.
- [x] CHK-FIX-006 [P1] No test reads new process-wide state. Not applicable.
- [x] CHK-FIX-007 [P1] Evidence pinned to `d10ec9d549..cafeff809e`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No private home-derived path in any tracked file
- [x] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments
- [x] CHK-042 [P2] READMEs updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-18
<!-- /ANCHOR:summary -->

---
