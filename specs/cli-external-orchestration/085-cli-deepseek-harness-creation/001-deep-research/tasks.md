---
title: "Tasks: Phase 1: deep-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: deep-research

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/`. `L` is `R/lineages/`. The workflow is `/deep:research` from `system-deep-loop`, with synthesis by the orchestrating Claude session.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the ten research angles and rules of engagement (`research-angles.md`). Verify: the file lists ten angles.
- [x] T002 Record the confirmed install and source-clone facts (`resource-map.md`). Verify: the file names commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`.
- [x] T003 Write the fan-out config for two lineages (`R/deep-research-config.json`). Verify: `node -e` read prints `maxIterations` 20.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run lineage `luna` on `cli-codex` `gpt-6-luna` `xhigh` (`L/luna/`). Verify: `ls L/luna/iterations` lists `iteration-001.md` to `iteration-010.md`.
- [x] T005 [P] Run lineage `deepseek` on `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` `max` (`L/deepseek/`). Verify: `ls L/deepseek/iterations` lists `iteration-001.md` to `iteration-010.md`.
- [x] T006 Merge both registries (`R/findings-registry.json`). Verify: `metrics.keyFindings` is 145 and `metrics.iterationsCompleted` is 20.
- [x] T007 Write the merged synthesis with conflicts settled against the source clone (`R/research.md`). Verify: section 10 lists conflicts C1 to C12.
- [x] T008 Write the ranked phase plan (`R/phase-plan.md`). Verify: `rg -c '^### 0' R/phase-plan.md` prints 13.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Read the run summary. Verify: `node -e` read prints `"succeeded":2,"total":2,"failed":0`.
- [x] T010 Confirm the closeout event and config status. Verify: `R/deep-research-state.jsonl` holds `synthesis_complete` with `stopReason` `maxIterationsReached` and the config `status` is `complete`.
- [x] T011 Fill the phase docs with `system-spec-kit`. Verify: `validate.sh <phase folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `R/research.md` and `R/phase-plan.md` exist
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: `research/research.md` and `research/phase-plan.md`
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

No task was blocked. A failed lineage would have been recorded in `failure_classes` and rerun.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (five REQ rows)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Both executors available before the run (both lineages succeeded)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `R/deep-research-state.jsonl` parses line by line (`node -e` reported 0 unparseable lines)
- [x] CHK-011 [P0] `R/findings-registry.json` parses and reports `reconstructionGaps` 0
- [x] CHK-012 [P1] `failure_classes` in the run summary are all 0
- [x] CHK-013 [P1] Harness citations use the `dsh-src/<path>:<line>` form
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-005 met with the evidence named in each row
- [x] CHK-021 [P0] 20 iteration files exist across the two lineages
- [x] CHK-022 [P1] Lineage conflicts recorded and resolved in research section 10
- [x] CHK-023 [P1] Key-gated unknowns listed in phase-plan section 2
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: research phase. It fixed no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -l -i 'sk-[A-Za-z0-9]{20,}|api_key=' research` finds no file (exit 1)
- [x] CHK-031 [P0] No keyed provider call to dsh was made
- [x] CHK-032 [P1] No `.env` content was read or recorded
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized on two lineages and ten iterations each
- [x] CHK-041 [P1] `research.md` names the mode id `cli-deepseek-harness` and the reasons in section 3
- [x] CHK-042 [P2] `phase-plan.md` names an authoring mode and executor for every phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Research artifacts live under `research/` only
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06
<!-- /ANCHOR:summary -->

---



