---
title: "Tasks: Phase 51: Save writer continuity fields"
description: "Ordered tasks to restore the save writer's continuity write, route phase-parent saves to the active leaf and fix the fingerprint stamp order."
trigger_phrases:
  - "save writer continuity tasks"
  - "continuity write tasks"
  - "parent save routing tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 51: Save writer continuity fields

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

Decisions: answered by the operator on 2026-09-23 and recorded in `spec.md` §7. Parent saves route through nested children, and continuity is written under `--full-auto` only.

- [x] T001 Read the removed handler at `3095cadc0f9^` for its continuity field mapping (`mcp-server/handlers/memory-save.ts`)
  - Evidence: the handler never read continuity from the payload. It derived `recent_action` from the document title and `next_safe_action` from a fixed phrase per route, and reset `completion_pct` to 0 and every list to empty on each save (`memory-save.ts:1436-1452` at that commit). The new write takes the fields from the payload and keeps valid stored ones.
- [x] T002 [P] Run `upsertThinContinuityInMarkdown` over a sample of current hand-edited blocks and record any it rejects (`scratch/`)
  - Evidence: `scratch/upsert-sample.md`, 3 of 60 accepted. A wider dry run over 421 summaries then found the upsert rewriting frontmatter outside the block in 17 of them, fixed at the upsert (0 of 421 after).
- [x] T003 [P] Build the nested fixture: a parent, a child parent and a leaf with an `implementation-summary.md` (`runtime/tests/`)
  - Evidence: `buildWorkspace` in `runtime/cli/tests/save-continuity-write.vitest.ts` builds an anchored temp workspace with a track, a parent, a child parent, a leaf, a sibling and a root-level parent. It lives in `runtime/cli/tests/` beside the writer it drives.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Accept the seven continuity fields with snake_case and camelCase aliases (`runtime/cli/utils/input-normalizer.ts`)
  - Evidence: `CONTINUITY_FIELD_ALIASES` and `extractContinuityFields`; `input-normalizer-unit.vitest.ts:342` passes with no unknown-field warning.
- [x] T005 Share one bounded pointer walk between the resume ladder and the writer (`runtime/lib/resume/resume-ladder.ts`)
  - Evidence: `resolvePhaseParentPointerHop` is the one pointer step; `followPhaseParentRedirect` loops over it and the writer calls it through the public API.
- [x] T006 Resolve a phase-parent target to its active leaf: fresh pointer chain first, then the one child holding every payload path (`runtime/cli/continuity/generate-context.ts`)
  - Evidence: `resolveContinuityLeaf`. The order is reversed from this task's wording by the operator's decision in `spec.md` §7: payload paths first, the pointer only at a level with no path inside it. `runtime/cli/tests/save-continuity-write.vitest.ts:295`, `:310`.
- [x] T007 Update every ancestor's `last_active_child_id` on a leaf save, and stop a parent save from clearing it (`runtime/cli/continuity/generate-context.ts`)
  - Evidence: `updatePhaseParentPointersAfterSave` walks up to five ancestors and stops below the specs root. `runtime/cli/tests/save-continuity-write.vitest.ts:278`, `:344`; `phase-parent-pointer.vitest.ts:82`.
- [x] T008 Upsert the continuity block inside the canonical-save lock, in `--full-auto` mode only (`runtime/cli/core/workflow.ts`)
  - Evidence: `planContinuityWrite` and `writePlannedContinuity`; a routed leaf takes its own canonical-save lock. `runtime/cli/tests/save-continuity-write.vitest.ts:221`, `:268`.
- [x] T009 Move the fingerprint stamp ahead of the graph refresh (`runtime/cli/core/workflow.ts`, `runtime/cli/core/memory-metadata.ts`)
  - Evidence: the stamp runs in the workflow after the continuity write and before the graph refresh, through a temp file and a rename. `runtime/cli/tests/save-continuity-write.vitest.ts:353`, `:363`.
- [x] T010 [P] Describe the fields, the `--full-auto` condition and the parent routing (`runtime/cli/continuity/generate-context.ts` help, `.skilled/commands/speckit/save.md`, `references/memory/save-workflow.md`)
  - Evidence: the `--help` "Continuity fields" section, `save.md` Outputs and step 6, and `save-workflow.md` Continuity Fields plus Phase Parent Save Routing. sk-doc validation reports 0 issues on both docs; the Hermes skill and prompt checks pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add save tests for REQ-001, REQ-002 and REQ-004 (`runtime/tests/`)
  - Evidence: `runtime/cli/tests/save-continuity-write.vitest.ts:221`, `:240`, `:248`, `:257`, `:268`.
- [x] T012 Add nested-fixture tests for REQ-006, REQ-007 and REQ-008, including `/speckit:resume` from the top parent
  - Evidence: `runtime/cli/tests/save-continuity-write.vitest.ts:278`, `:295`, `:310`, `:323`. The resume check runs the runtime ladder's `followPhaseParentRedirect`; the `/speckit:resume` command workflow itself is agent-executed YAML and is not under test.
- [x] T013 Reproduce the edit, save and strict-validate sequence and confirm `RESULT: PASSED` on the first run (REQ-003)
  - Evidence: on `sk-doc/057-sk-create-changelog-v4-style`, a summary edit, a `--full-auto` save from `dist` (exit 0) and `validate.sh --strict` gave `RESULT: PASSED`, Errors 0, no `SOURCE_FINGERPRINT_MISMATCH`. The four files the save touched were restored with `git checkout` and `git status` matched the pre-run snapshot.
- [x] T014 Rebuild `dist`, run the full vitest suite and strict validation on this phase, and mark `acceptance-criteria.md`
  - Evidence: `npm run build` exit 0; the full suite gave 2,736 passed, 2 failed, 32 skipped of 2,770. One failure was a file-time false positive, cleared by a forced rebuild with byte-identical output. The other two import the unbuilt `dist` of `system-skill-advisor/runtime` and `sk-communication/cli-communication-projection`, which this phase does not touch. Strict validation and the criteria are recorded in `implementation-summary.md` and `acceptance-criteria.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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
  - Evidence: REQ-001 to REQ-008 in `spec.md` §4.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - Evidence: `plan.md` §3, with the deviations recorded there.
- [x] CHK-003 [P1] Upsert sample recorded (T002)
  - Evidence: `scratch/upsert-sample.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript builds and lint passes
  - Evidence: `npm run typecheck` and the CLI `npm run check` (which runs lint) both exit 0.
- [x] CHK-011 [P0] No new warning in a save run that carries only accepted fields
  - Evidence: `input-normalizer-unit.vitest.ts:342` asserts no unknown-field warning for every spelling. The real-packet save printed two warnings, the topic-alignment check on the summary text and a stale trigger-index note for `spec.md`, and neither concerns the fields.
- [x] CHK-012 [P1] Rejected continuity values fail the save with the validator's error code
  - Evidence: `runtime/cli/tests/save-continuity-write.vitest.ts:257`, and the real-packet save that exited 1 with `MEMORY_007`.
- [x] CHK-013 [P1] Code comments carry the durable reason only, with no packet or phase ids
  - Evidence: A grep of every added comment line for requirement, checklist, task, decision and spec-path ids found none.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
  - Evidence: every row in `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] The 057-style sequence passes on the first strict run
  - Evidence: T013 on `sk-doc/057-sk-create-changelog-v4-style`.
- [x] CHK-022 [P1] Nested fixture covers fresh, stale and missing pointers
  - Evidence: fresh chain `runtime/cli/tests/save-continuity-write.vitest.ts:310`; stale, escaping and malformed pointers in the table case after `:323`; missing pointer in the same case, which leaves no usable pointer.
- [x] CHK-023 [P1] Plan-only mode writes no continuity
  - Evidence: `runtime/cli/tests/save-continuity-write.vitest.ts:268`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug` for the missing write, `algorithmic` for the stamp order and the pointer walk
  - Evidence: recorded in this row: `class-of-bug` for the missing continuity write, `algorithmic` for the stamp order and the pointer walk.
- [x] CHK-FIX-002 [P0] Same-class producer inventory from the plan's affected-surfaces table completed
  - Evidence: Pointer writers are `updatePhaseParentPointer` in `generate-context.ts` (JSON) and `recordFreshnessPointer` in `access-telemetry.ts` (store); `graph-metadata-parser.ts` carries the pointer through a refresh. The other hits are readers, validators, fixtures and tests.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed save and pointer symbols
  - Evidence: Code consumers are `generate-context.ts`, `workflow.ts`, `memory-metadata.ts`, `input-normalizer.ts` and `phase-parent-pointer.vitest.ts`, all updated. The feature-catalog and playbook entries naming `KNOWN_RAW_INPUT_FIELDS` stay accurate. Historical spec docs are left as written.
- [x] CHK-FIX-004 [P0] Pointer handling tested against outside-root, missing-child and malformed pointers
  - Evidence: table case after `runtime/cli/tests/save-continuity-write.vitest.ts:323` covers a missing child, a pointer that climbs out of the parent, and a malformed pointer; with the child-shape check disabled the escape case fails.
- [x] CHK-FIX-005 [P1] The plan's matrix axes and row count listed before completion is claimed
  - Evidence: Target kind (leaf, direct parent, nested parent) × pointer (fresh, stale, missing) × payload (fields, none) × mode (full-auto, plan-only) is 36 cells. The save tests cover the rows that change where a write lands: leaf with and without fields in both modes, nested parent by pointer chain and by payload paths, ambiguous paths, three refused pointers, and a root-level parent's child.
- [x] CHK-FIX-006 [P1] Tests isolate from the live `specs/` tree and any session state
  - Evidence: Each case builds a fresh temp workspace and points `SPEC_KIT_DB_DIR` at a temp store before any import.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range
  - Evidence: Working-tree diff against `4072bb9e7a`; nothing is committed yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - Evidence: The diff adds no credentials, tokens or keys.
- [x] CHK-031 [P0] Every pointer hop checked for existence and child shape before use
  - Evidence: `resolvePhaseParentPointerHop` checks shape, containment and child existence before any hop the writer or the resume ladder takes.
- [x] CHK-032 [P1] Writes stay inside the packet tree apart from the documented ancestor pointers
  - Evidence: The real-packet save touched the packet's three files and its ancestor's `graph-metadata.json`, nothing else.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
  - Evidence: Spec, plan and tasks updated to the built behaviour, including the reversed routing order and the extra files.
- [x] CHK-041 [P1] `save-workflow.md` Phase Parent Save Routing rewritten to match the code
  - Evidence: `save-workflow.md` Phase Parent Save Routing rewritten; sk-doc validation reports 0 issues.
- [x] CHK-042 [P2] Writer `--help` lists the continuity fields
  - Evidence: `generate-context.ts:156`, the `--help` Continuity fields section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - Evidence: Probe files and backups live in the session scratchpad outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - Evidence: `scratch/` holds only `.gitkeep` and the cited sample, which is evidence and stays.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-23
<!-- /ANCHOR:summary -->
