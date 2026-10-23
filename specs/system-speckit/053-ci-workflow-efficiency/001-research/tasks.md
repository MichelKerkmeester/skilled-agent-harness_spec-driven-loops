---
title: "Tasks: Phase 1: CI workflow efficiency research"
description: "Ordered tasks for the 20-iteration CI workflow research: setup and dataset, the loop, synthesis and verification."
trigger_phrases:
  - "ci research tasks"
  - "053 research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: CI workflow efficiency research

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

- [x] T001 Create the worktree from origin/main with sk-git's allocator and scaffold the phased parent with child 001 (`../spec.md`, `spec.md`)
- [x] T002 Collect the measured dataset with `gh run list` and `gh run view --json jobs` (`scratch/ci-run-data/`)
- [x] T003 Initialize the run: lock, config, ledger opening, strategy with 12 key questions, registry (`research/deep-research-config.json`, `research/deep-research-strategy.md`)
- [x] T004 Verify the config before iteration 1: cli-pi, `deepseek-v4.1-flash-1017`, reasoningEffort max, 20 iterations, max-iterations, convergence off (`research/deep-research-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run iterations 1-9: cost, triggers, provisioning, caching, spec-kit-check, concurrency, flakiness, overengineering, security (`research/iterations/`)
- [x] T006 Run iterations 10-12: on/off control parts 1 and 2, provisioning fix design (`research/iterations/`)
- [x] T007 Run iterations 13-17: `/doctor:ci` surface and safety, sk-code-ci contents and registration, the two together (`research/iterations/`)
- [x] T008 Run iterations 18-20: consolidation, verification pass, phase plan (`research/iterations/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-check the top claims independently: rebuild fan-out, grep counts, rulesets, GitHub skip semantics, visibility (`research/research.md` section 20)
- [x] T010 Synthesize `research/research.md`, emit `research/resource-map.md`, run synthesis closeout through the gateway
- [x] T011 Update the parent phase map with 001 Complete and 002-008 Pending (`../spec.md`)
- [x] T012 Strict recursive validation of the packet, then commit and push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md - the auto YAML's single-executor path
- [x] CHK-003 [P1] Dependencies identified and available - `pi` 1.4.0, key present (not printed), `gh` scopes `repo, workflow`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - no code changed; strict validation PASSED
- [x] CHK-011 [P0] No console errors or warnings - 20/20 dispatches exited 0; one reducer note per iteration (route proof read from the delta)
- [x] CHK-012 [P1] Error handling implemented - the redispatch-once path was in place and was never needed
- [x] CHK-013 [P1] Code follows project patterns - every state write went through `append-mode-event.cjs`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete - `verify-iteration.cjs` OK for iterations 1-20
- [x] CHK-022 [P1] Edge cases tested - settings changed before iteration 1, so the state was re-initialized
- [x] CHK-023 [P1] Error scenarios validated - three iteration figures that did not reproduce were corrected (`research/research.md` section 20)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - not applicable: research only, no fix shipped; the findings are classed by evidence label instead
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - not applicable, no fix
- [x] CHK-FIX-003 [P0] Consumer inventory completed - not applicable, no changed helpers
- [x] CHK-FIX-004 [P0] Adversarial table tests for security fixes - not applicable, no fix
- [x] CHK-FIX-005 [P1] Matrix axes listed - the 11 research angles are in the config topic
- [x] CHK-FIX-006 [P1] Hostile env variant executed - not applicable, no code
- [x] CHK-FIX-007 [P1] Evidence pinned - dataset window 2026-10-22T07:07Z to 2026-10-23T06:35Z, run ids in `scratch/ci-run-data/summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - the llmgateway key was only tested for presence
- [x] CHK-031 [P0] Input validation implemented - not applicable; no repository setting written
- [x] CHK-032 [P1] Auth/authz working correctly - rulesets and variables read with `gh`, no write call
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate - not applicable, no code
- [x] CHK-042 [P2] README updated (if applicable) - not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the driver and logs stayed in the session scratchpad, outside the repo
- [x] CHK-051 [P1] scratch/ cleaned before completion - `scratch/ci-run-data/` is kept on purpose because `research.md` and the iterations cite it as evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
