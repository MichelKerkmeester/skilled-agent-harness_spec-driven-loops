---
title: "Tasks: Phase 1: research-communication-context"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "research tasks"
  - "lineage dispatch tasks"
  - "citation verification"
  - "artifact verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research-communication-context

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

- [x] T001 Probe the Pi binary and read the output text rather than the exit code (`command -v pi`)
  - DONE 2026-09-14: pi resolved on PATH and the probe reply was read, not the exit code
- [x] T002 Pre-flight the Codex OAuth session and surface the login command rather than substituting a model
  - DONE 2026-09-14: codex-cli 0.154.0 on PATH, the session authenticated, the dispatch reached gpt-5.6-luna on the first attempt
- [x] T003 [P] Confirm the three vendored sources are present and readable (`../context/`)
  - DONE 2026-09-14: three vendored sources present under ../context/ and read by iteration 1
- [x] T004 Write the research questions per source into the dispatch brief, with the frozen write authority and the required citation format
  - DONE 2026-09-14: the dispatch brief carried the per-source questions, the frozen write authority and the file:line citation rule
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Dispatch the DeepSeek V4.1 Flash lineage through `cli-pi` at max effort, convergence disabled
  - DONE 2026-09-14: ten iterations on deepseek-v4.1-flash through cli-pi at max effort, convergence off
- [x] T006 Dispatch the GPT-5.6 LUNA lineage through `cli-codex` at max effort on the fast service tier, convergence disabled
  - DONE 2026-09-14: five iterations, stop policy max-iterations, runner run 1789402391295-tfhy3y completed 17:07Z, synthesis and resource map under research/luna-fanout/lineages/luna/
- [x] T007 Hold the repository frozen outside this phase folder for the whole time a lineage is live
  - DONE 2026-09-14: the repository was frozen outside this folder while each iteration ran
- [x] T008 Salvage artifacts and resume rather than restart if a lineage stops on a provider limit
  - Not needed: no lineage stopped on a provider limit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Read each lineage's state log and confirm the recorded iteration count matches the requested depth
  - DONE 2026-09-14: state log holds ten complete iteration records, matching the requested depth
- [x] T010 Open a sampled citation from each lineage and confirm it resolves to the line it names
  - DONE 2026-09-14: communication.md:104-106 cited for the em dash ban resolves at the run's commit
- [x] T011 Confirm the scoped diff contains no change outside this phase folder
  - DONE 2026-09-14: git status on the phase folder shows only research artifacts
- [x] T012 Record the contradiction list, or state explicitly that no contradiction was found
  - DONE 2026-09-14: the contradiction page in research.md section 3 lists four conflicts, one closed and three carried to phase 002
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (checklist worked 2026-09-15 with the folder validated PASSED)
<!-- /ANCHOR:completion -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md REQ-001 through REQ-006, section 3)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md defines the lineage-dispatch approach)
- [x] CHK-003 [P1] Executor availability confirmed by reading probe output, not exit status (T001, T002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Not applicable, this phase writes documents and runs no build (not applicable: documentation phase, no build)
- [x] CHK-011 [P0] Every dispatch log read for provider, auth and extension failures in its output text (T002, T005, T006, T009: full requested depth reached with no early stop)
- [x] CHK-012 [P1] A lineage that failed verification is re-dispatched or recorded as a finding, never dropped (T008: not needed, no lineage failed; AC-004 both lineages produced findings)
- [x] CHK-013 [P1] Artifacts follow the canonical deep-research packet names (research/ holds research.md, deep-research-state.jsonl, iterations/, deltas/, dispatch-receipts/, resource-map.md, the canonical shape)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md AC-001 through AC-007 all Met)
- [x] CHK-021 [P0] Artifact existence checked by path and shape, not by having written it (T009, T011)
- [x] CHK-022 [P1] Empty-result lineage recorded as its own finding rather than padded (T008, AC-004: both lineages non-empty)
- [x] CHK-023 [P1] Unresolved citations reported as unresolved (full scan 2026-09-15 over both syntheses: DeepSeek 25 cited, 25 resolve on the current tree; LUNA 192 cited, 175 resolve on the current tree, 17 resolve on the tree the research read, AGENTS.md:397-405 against the 496-line root doc and the rest against repo-rules/prose-mechanics.md before its rename in dc79a591e0; zero unresolved)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not applicable, this phase fixes nothing and has no finding classes to assign (not applicable: this phase fixes nothing and has no finding classes to assign)
- [x] CHK-FIX-002 [P0] Not applicable, no producer class is being changed (not applicable: no producer class is being changed)
- [x] CHK-FIX-003 [P0] Not applicable, no helper, policy, schema field or response field is being changed (not applicable: no helper, policy, schema field or response field is being changed)
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope (not applicable: no path, parser, redaction or security logic is in scope)
- [x] CHK-FIX-005 [P1] The lineage matrix axes are source and executor family, and the rows are listed in Phase 2 (T005, T006: DeepSeek and GPT-5.6 LUNA lineages by source and executor family)
- [x] CHK-FIX-006 [P1] Not applicable, no test or code reads process-wide state here (not applicable: no test or code reads process-wide state here)
- [x] CHK-FIX-007 [P1] Evidence is pinned to the lineage directories, which are immutable once the run settles (T005, T006, AC-002, AC-004: evidence pinned to research/luna-fanout/lineages/luna/ and research/iterations/)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No provider key or credential value appears in any brief, prompt or artifact (credential scan of research/ clean, only field-name mentions and a templated placeholder, no actual value)
- [x] CHK-031 [P0] Vendored source content treated as data to cite, never as instructions to obey (T004, AC-002: citation format cites source lines, vendored sources read as data)
- [x] CHK-032 [P1] Write authority bound to this phase folder before any delegate starts (T004, T007: write authority bound before dispatch, repository frozen outside this folder)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md REQ-001..006, plan.md, tasks.md T001-T012 aligned)
- [x] CHK-041 [P1] Not applicable, no code comments are written in this phase (not applicable: no code comments are written in this phase)
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md Phase Documentation Map row 1, Status Complete)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep, no temp files elsewhere)
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch/ empty except .gitkeep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15, CHK rows checked against T-task evidence, acceptance-criteria.md and the current repository state, a full citation scan of both syntheses, then validate.sh --strict run
**Validate RESULT (strict)**: RESULT: PASSED, errors 0, warnings 1, exit 0
**Metadata repair**: the first strict run reported 1 error, a stale graph-metadata.json source_fingerprint against the edited tasks.md, repair-derived.cjs regenerated it, the rerun above is the final state
<!-- /ANCHOR:summary -->

---

