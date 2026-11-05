---
title: "Tasks: Phase 1: render-checks-and-gate"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "render checks and gate tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: render-checks-and-gate

<!-- SPECKIT_LEVEL: 3 -->

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

`V` is `.skilled/skills/sk-doc/shared/scripts/validate_document.py`. `PK` is `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`. `L` is `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the start commit and the baselines in `goal.md` section 4: the 13-skill strict loop, `run-script-tests.sh`, the sk-create-skill node suite and the compiled-route suite. Verify: the log row shows 13 of 13 exit 0, `all sk-doc script tests passed`, `fail 0` and `fail 0`.
- [ ] T002 Re-locate every cited line for items 1, 2, 3, 4, 7, 8, 11, 13 and 14 in `../scratch/review-report.md` (`V`, `PK`, `L`, `SKILL.md`, `creation-workflow.md`). Verify: `rg -n "related" .skilled/skills/sk-doc/shared/scripts/validate_document.py` shows the substring match, and each re-located line is logged.
- [ ] T003 [P] Time a dry fleet sweep with `PK --check --strict` over every skill. Verify: the loop finishes and its wall time is logged against the 10-minute job timeout.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Fix the `related` substring match in `render_section_order` so only a leading `related` token or the alias set matches (`V`, item 11). Verify: a fixture headed `## 9. UNRELATED CHANGES` before a final `## 10. RELATED RESOURCES` raises no finding, and the existing negative fixtures still fire.
- [ ] T005 Fix `bold_label_join` to ignore a two-space hard break, make `h2_numbering` treat `7.1` as a sub-number, report gaps and duplicates under a new code, and add the "render check" marker to the stale-debt message (`V`, `PK`, item 13). Verify: `python3 V .skilled/skills/system-deep-loop/runtime/references/integration-points.md` no longer says `Unnumbered H2 "7.1`, and a `## 1, ## 3, ## 3` fixture reports both the gap and the duplicate.
- [ ] T006 Make the SKILL.md section scan at `PK:461-462` skip fenced lines with `_fenced_spans` and retire the `\##` advice in `references/shared/common-pitfalls.md:33` (item 14). Verify: a fixture SKILL.md whose only `## REFERENCES` sits in a fence fails the required-section check.
- [ ] T007 Add `render_overview_subsections` with reference (Purpose then When to Use) and asset (Purpose then Usage) rules in `V` and `.skilled/skills/sk-doc/shared/assets/template-rules.json` (item 1). Verify: a reference fixture without `### Purpose` fires, the fixed copy clears.
- [ ] T008 Add `render_section_reference` for in-file `§N` and `Section N`, and resolve `file.md §N` with the `inbound-anchors.py` regex (`V`, item 7). Verify: a fixture citing `§8 EXAMPLES` in a file whose section 8 has another title fires, and a correct citation clears.
- [ ] T009 Add `render_intro_missing`, `render_intro_pointer` with the closed phrase list from `rubric.md:4`, and a per-sentence restate check against Purpose and description (`V`, item 8). Verify: a two-sentence intro whose second sentence copies Purpose fires, and a hook intro clears.
- [ ] T010 Widen `_render_findings` to SKILL.md, ROUTER.md, the hub `shared/references` trees and `system-deep-loop/runtime/references` (`PK`, item 3). Verify: on a fixture skill with one render finding each in `SKILL.md`, `ROUTER.md`, `shared/references/` and `runtime/references/`, `python3 PK <fixture> --check --json` lists all four, and the sweep output for `system-deep-loop` is logged.
- [ ] T011 Add `RENDER_SCAN_SCOPES` (`SKILL.md`, `ROUTER.md`, `shared/references`, `runtime/references`) with the scope recorded on each finding, `RENDER_STAGED_CODES` (every code from T005 and T007 to T009) and `RENDER_STAGED_SCOPES` (every scope from T010 plus `README.md`) to `PK`, make `describe()` in `validate_render` print a staged finding as `render advisory:`, add the new codes to `RENDER_CHECK_TYPES`, and add the `RENDER_STAGED_OFF=1` switch (ADR-001, REQ-011, REQ-012). Verify: the 13-skill strict loop prints `exit=0` for all 13 skills with staged findings shown as `render advisory:` warnings, on the T010 fixture skill `python3 PK <fixture> --check --strict` exits 0 while `RENDER_STAGED_OFF=1 python3 PK <fixture> --check --strict` exits non-zero naming all four files, and `debt` in `L` still prints `{}`.
- [ ] T012 Add `render-known-debt-ratchet.test.cjs` and its frozen fixture under `sk-create-skill/scripts/tests/fixtures/`, covering the empty `debt`, the exempt keys and both staged sets, which the test reads by running `python3` to import `PK` and print them as JSON (item 4). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` passes, fails on a copy with a debt entry or a staged code added, and passes on a copy with a staged code removed.
- [ ] T013 Add the ratchet step and the fleet sweep step to `.github/workflows/sk-doc-script-tests.yml`. The sweep runs `PK --check --strict` per skill, so staged findings print as advisory and only enforced ones fail (items 3 and 4, ADR-002). Verify: `rg -n "render-known-debt-ratchet|package_skill.py" .github/workflows/sk-doc-script-tests.yml` prints both steps.
- [ ] T014 [P] Make `validate_skill_package.py <path> --strict` the one gate form in `sk-create-skill/SKILL.md`, `README.md` and `references/skill/creation-workflow.md`, and delete "The gate reads resource frontmatter only" (item 2). Verify: `rg -n "frontmatter only" .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the full sk-doc suites from the final state. Verify: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed` and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0`.
- [ ] T016 Run the 13-skill strict loop and the compiled-route suite. Verify: 13 of 13 exit 0 with staged findings shown as `render advisory:` warnings, and `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`.
- [ ] T017 Orchestrator reads the whole diff, then an independent opus-medium review runs before the phase commit. Verify: the review verdict and the diff range are logged in `goal.md` section 4.
- [ ] T018 Validate the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review report**: See `../scratch/review-report.md`
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

A blocked P0 task stops the phase. A blocked P1 task needs a recorded reason in `goal.md` section 4 and operator approval.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md, each tied to a review item
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Baselines from T001 logged in `goal.md` section 4
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `python3 -m py_compile .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` exits 0
- [ ] CHK-011 [P0] `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` exits 0
- [ ] CHK-012 [P1] Each new check returns findings in the existing `render_*` shape
- [ ] CHK-013 [P1] No ephemeral ids in code comments: `rg -n "REQ-|ADR-|T0[0-9]{2}" .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints nothing new
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is Met
- [ ] CHK-021 [P0] Each new or fixed check has a bad and a good fixture
- [ ] CHK-022 [P1] Fence and frontmatter edge cases tested for the section scan and the intro checks
- [ ] CHK-023 [P1] Ratchet fails on a new debt entry and on a staged-set addition, and passes on a staged-set removal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Parser fixes include table tests for fenced, frontmatter, no-op and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] N/A unless a test reads process-wide state, in which case a hostile env variant runs.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the changed files
- [ ] CHK-031 [P0] The sweep reads only paths under `.skilled/skills`
- [ ] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md name the same checks and files
- [ ] CHK-041 [P1] Code comments state the durable why for each check
- [ ] CHK-042 [P2] sk-create-skill README names the strict gate
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section
- [ ] CHK-101 [P1] ADR-001 and ADR-002 carry a status
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] N/A: no migration path
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The fleet sweep finishes inside the job timeout (NFR-P01)
- [ ] CHK-111 [P1] Clean skills report 0 new findings (NFR-R01)
- [ ] CHK-112 [P2] N/A: no load testing
- [ ] CHK-113 [P2] Sweep wall time logged in `goal.md` section 4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback is one `git revert` of the phase commit
- [ ] CHK-121 [P1] The CI steps respect the `SKILLED_CI` switch the job already checks
- [ ] CHK-123 [P1] N/A: no runbook, the gate command is the runbook
- [ ] CHK-124 [P2] N/A: no deployment
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Independent opus-medium review completed before commit
- [ ] CHK-131 [P1] No new dependency added
- [ ] CHK-132 [P2] N/A: no web surface
- [ ] CHK-133 [P2] N/A: no user data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] sk-create-skill SKILL.md, README and creation-workflow name one gate form
- [ ] CHK-142 [P2] N/A: no user-facing doc beyond the sk-create-skill docs
- [ ] CHK-143 [P2] Staged finding counts per skill logged for phase 003
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Operator, approves the phase commit | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
