---
title: "Tasks: Phase 7: hub-routing-integration"
description: "Priority-tagged setup, hub-wiring and verification tasks for sk-create-goal routing."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: hub-routing-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P0]` | Required blocker |
| `[P1]` | Required or approved deferral |
| `[P2]` | Optional |

**Task Format**: `T### [P0|P1|P2] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm phase 006's positive fixture passes and each negative fixture fails for its named reason; back up the seven hub surfaces with `cp -p` into a temporary directory outside the repository; record the backup path and pre-change mode/packet counts in `implementation-summary.md` (specs/sk-doc/060-create-goal-mode/spec.md:147; all seven paths in spec.md §3). Evidence: phase 006 controls pass (8 of 8 tests). Deviation: no `cp -p` copy was taken; the seven hub files were tracked and unmodified before the edit, so git HEAD is the rollback source. Pre-change counts, 14 modes across 13 packets: `specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-before.md:11`.
- [x] T002 [P0] Read the completed mode packet's `Keyword triggers:` line and its actual reference/asset tree; record the alias source and on-disk leaf paths without editing packet files. If the source line does not already support the candidate aliases, stop for scope resolution (.skilled/skills/sk-doc/SKILL.md:50-52). Evidence: the packet line is `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:30`. Deviation: the registry carries seven aliases beyond that line (`packet goal`, `goal.md`, `nested goal`, `write a goal file`, `draft a goal file`, `goal document`, `binding table`). The packet file was left unedited per scope, and the probe replay shows none of them captures a session-goal request.
- [x] T003 [P0] Run the fixed ten newcomer prompts and six out-of-domain prompts through advisor and compiled-route before edits; preserve each output and exit status in `implementation-summary.md`. Evidence: 0 of 10 newcomer prompts and 0 of 6 probes reach the mode before the edit (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-before.md:36`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Add one registry row with `workflowMode: sk-create-goal`, `packetKind: workflow`, `backendKind: template-scaffold`, `packet` and `packetSkillName: sk-create-goal`, `grandfatheredFolderMismatch: false`, the matching tool surface, `/create:goal`, lower-case unique aliases and `routingClass: metadata` (.skilled/skills/sk-doc/mode-registry.json). Evidence: `.skilled/skills/sk-doc/mode-registry.json:567`.
- [x] T005 [P0] Add `sk-create-goal` to `hub-router.json` with a dedicated vocabulary class, `routerSignals` resources and an exact-permutation `routerPolicy.tieBreak` entry (.skilled/skills/sk-doc/hub-router.json). Evidence: `.skilled/skills/sk-doc/hub-router.json:178`; the parent-skill check passes the tie-break permutation.
- [x] T006 [P0] Add the goal-authoring prose intent plus equal-key `INTENT_SIGNALS` and `RESOURCE_MAP` entries, and include its real leaves in `FULL_INVENTORY` (.skilled/skills/sk-doc/ROUTER.md). Evidence: `GOAL_AUTHORING` at `.skilled/skills/sk-doc/ROUTER.md:172` and `:258`.
- [x] T007 [P0] Add advisor intent signals and update the description, hub mode-table row and count from 14 modes across 13 packets to 15 modes across 14 packets (.skilled/skills/sk-doc/graph-metadata.json, .skilled/skills/sk-doc/description.json, .skilled/skills/sk-doc/SKILL.md:15,25-39). Evidence: `.skilled/skills/sk-doc/SKILL.md:15` and `:39`; `.skilled/skills/sk-doc/graph-metadata.json:240`; `.skilled/skills/sk-doc/description.json:3`.
- [x] T008 [P0] Regenerate the leaf manifest with `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-doc`; do not edit its JSON directly (.skilled/skills/sk-doc/leaf-manifest.json). Evidence: `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK`; the mode leaves start at `.skilled/skills/sk-doc/leaf-manifest.json:109`.
- [x] T013 [P0] Add the `sk-create-goal` canary case and refresh the harness topology counts, then republish compiled routing: `compiled-route-manifest.cjs refresh --hub sk-doc`, `compiled-route-sync.cjs`, the status, verify and canary gates, then `--finalize` (operator-approved amendment). Evidence: the case sits in both fixture copies; republished and finalized with no lock or rollback left; canary 22 of 22 (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/publication-notes.md:86`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Parse all four authored JSON files, run the manifest `--check`, and run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`. Evidence: four JSON files parse; manifest `--check` OK; `parent-skill-check.cjs` prints `OK: all hard invariants passed, 0 warnings`.
- [x] T010 [P0] Repeat all ten baseline prompts through the advisor CLI and compiled-route CLI; record the same ten after-results and the before/after target counts in `implementation-summary.md`. Evidence: after the edit 10 of 10 route to the mode at the hub and 9 of 10 reach `sk-doc` at the advisor (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-after.md:13`; `specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-replay-final.txt:3`).
- [x] T011 [P0] Replay the four session-goal phrases and `/goal-opencode` and `/goal-cursor` through both stages; require zero `sk-create-goal` targets and rerun the recorded sibling controls. Evidence: 0 of 6 probes reach the mode at either stage; the canary sibling cases all pass (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-after.md:18`).
- [x] T012 [P0] Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/007-hub-routing-integration --strict`, read its output and exit status, and reconcile the planning documents with the observed evidence. Evidence: strict validation `RESULT: PASSED` on 2026-09-26.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] [P0] All twelve T001-T012 tasks are checked with evidence.
- [x] [P0] All acceptance criteria are `Met`, and each has evidence from a named route replay, check command or generated artifact.
- [x] [P0] Strict validation prints `RESULT: PASSED` for this phase folder.
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

- [x] CHK-001 [P0] The seven-file hub boundary and P0/P1 requirements are documented in spec.md.
- [x] CHK-002 [P0] The command sequence, ten-prompt corpus, negative probes and rollback are defined in plan.md.
- [x] CHK-003 [P0] Phase 006's named positive/negative controls are satisfied, and phases 002-006 have left a real mode packet whose leaves can be inspected before routing writes.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Registry, hub-router, graph-metadata and description JSON parse with `python3 -m json.tool`.
- [x] CHK-011 [P0] Registry aliases, hub-router vocabulary and tie-break are read back and agree.
- [x] CHK-012 [P1] The generated leaf-manifest `--check` passes for `.skilled/skills/sk-doc`.
- [x] CHK-013 [P1] The registry tool surface matches the existing template-scaffold workflow entries.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion has a corresponding observed check or replay result.
- [x] CHK-021 [P0] All ten newcomer prompts have before and after advisor and compiled-route outcomes.
- [x] CHK-022 [P1] All six session-goal and host-command probes return zero mode targets.
- [x] CHK-023 [P1] The recorded sibling-control prompts retain their expected routes. The canary sibling cases pass 22 of 22.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] No source-code fix is in this phase; confirm the scoped change remains limited to the seven routing metadata/document surfaces. Deviation: the approved amendments add the runtime and authored canary fixtures and the two activation manifests to the seven files; no source code changed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No session-goal phrase or host command is added as a goal-authoring alias. `goal chat slice` names the mode's own output, and 0 of 6 probes reach the mode.
- [x] CHK-031 [P0] Every stage-two resource path names a real leaf in the completed mode packet.
- [x] CHK-032 [P1] No runtime goal state, host command or system-spec-kit file is modified.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md and implementation-summary.md agree on planned status and scope.
- [x] CHK-041 [P1] No code comments or runtime files are part of this documentation-only routing plan.
- [x] CHK-042 [P2] README updates remain out of scope for phase 007.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Replay evidence is recorded in the existing implementation-summary.md; no new evidence file is created by this phase. Deviation: the dispatch kept its measurement records under `scratch/` (before, after, final replay and publication notes); `implementation-summary.md` summarizes them.
- [x] CHK-051 [P1] No temporary replay output remains in the repository after verification.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-09-26
<!-- /ANCHOR:summary -->

---



