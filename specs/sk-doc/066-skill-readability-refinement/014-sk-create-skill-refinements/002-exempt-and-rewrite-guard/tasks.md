---
title: "Tasks: Phase 2: exempt-and-rewrite-guard"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "exempt and rewrite guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: exempt-and-rewrite-guard

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

`SS` is `.skilled/skills/sk-doc/shared/scripts/`. `L` is `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json`. `G` is `SS/doc-rewrite-guard.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the replay fixture: find the base `diff-1.patch` applies to and record it (`specs/sk-doc/066-skill-readability-refinement/013-system-spec-kit/scratch/diff-1.patch`). Verify: `git apply --check` against a worktree at that base exits 0, and the base sha is logged in `goal.md` section 4.
- [ ] T002 Capture the pre-change outputs: the 13-skill strict loop, `validate_document.py` on `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md`, and a read-call scan for `.md` literals in `check-rule-copies.js`. Verify: each output is saved under `scratch/` and logged.
- [ ] T003 [P] List every exempt rule copy. Verify: `rg -n "FORMAT_SPEC_FILES|style-reference|def load_render_exempt|exempt" SS/validate_document.py .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py` output is logged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the exempt and pinned loader in `SS` with doc-exists and consumer-names-doc checks (item 5, REQ-001, REQ-002). Verify: `python3 -m pytest -q` on its test file passes the entry matrix, and a ledger copy with a missing doc key exits non-zero naming the key.
- [ ] T005 Move the DESIGN.md and style-reference skips in `SS/validate_document.py` into the exempt map with their consumers, and make the validator call the loader and label exempt findings with the consumer (REQ-001, REQ-006). Verify: `python3 SS/validate_document.py .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md` names the consumer next to `render_h2_numbering`.
- [ ] T006 Replace `load_render_exempt` in `package_skill.py` with the loader (REQ-001). Verify: the 13-skill strict loop output matches the T002 capture.
- [ ] T007 Point `scope-gate.py` at the loader (REQ-001). Verify: a rerun on one finished 066 leaf prints the same `render_warnings` line as before.
- [ ] T008 Add the `pinned` list to `L`, starting with `sk-code/shared/references/universal/code-quality-standards.md` and `sk-code/sk-code-review/references/review-core.md`, and add the advisory read-call scan (REQ-003, REQ-007). Verify: the scan lists both docs and reports no unlisted pinned doc, or logs each one it finds.
- [ ] T009 Write `G` with the hard checks (frontmatter beyond `version`, fenced blocks, citations, cited H2 numbers and anchors, exempt and pinned docs) and the advisory checks (lost lines, intro diff), ported from the seven 066 scratch tools (REQ-004). Verify: `python3 G --help` exits 0 and each check has a bad and a good pytest pair.
- [ ] T010 Add the replay test (REQ-005). Verify: the guard run on the T001 base with `diff-1.patch` applied reports `.skilled/skills/system-spec-kit/shared/parsing/README.md`, and on an unchanged tree prints no finding and exits 0.
- [ ] T011 [P] Add a "refine existing docs" step that runs `G` to the Update Workflow in `sk-create-skill/references/skill/examples-and-maintenance.md` and to `creation-workflow.md` (REQ-008). Verify: `rg -n "doc-rewrite-guard.py" .skilled/skills/sk-doc/sk-create-skill/references/skill/` prints a line in each file.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the full sk-doc suites from the final state. Verify: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed` and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0`.
- [ ] T013 Run the 13-skill strict loop, the compiled-route suite and the snake-case guard. Verify: 13 of 13 exit 0, `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`, and `python3 SS/check_no_new_snake_case.py --changed-since <phase start sha>` prints nothing.
- [ ] T014 Orchestrator reads the whole diff, then an independent opus-medium review runs before the phase commit. Verify: the review verdict and the diff range are logged in `goal.md` section 4.
- [ ] T015 Validate the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard --strict` prints `RESULT: PASSED`.
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

- [ ] CHK-010 [P0] `python3 -m py_compile` on the loader, `doc-rewrite-guard.py`, `validate_document.py` and `package_skill.py` exits 0
- [ ] CHK-011 [P0] `python3 -c "import json;json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))"` exits 0
- [ ] CHK-012 [P1] The guard prints file, rule and line for every finding
- [ ] CHK-013 [P1] No ephemeral ids in code comments: `rg -n "REQ-|ADR-|T0[0-9]{2}" .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is Met
- [ ] CHK-021 [P0] Each loader rule and guard check has a bad and a good test
- [ ] CHK-022 [P1] Missing doc, missing consumer and consumer-without-name cases tested
- [ ] CHK-023 [P1] The replay of `diff-1.patch` is reported and an unchanged tree is quiet
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Path handling in the loader and guard includes outside-root, missing-file, no-op and fallback table tests.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] N/A unless a test reads process-wide state, in which case a hostile env variant runs.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the changed files
- [ ] CHK-031 [P0] The loader rejects a doc or consumer path outside the repository root
- [ ] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md name the same checks and files
- [ ] CHK-041 [P1] Code comments state the durable why for each guard check
- [ ] CHK-042 [P2] The ledger description names the pinned list
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

- [ ] CHK-110 [P1] The guard on one skill diff finishes under 30 seconds (NFR-P01)
- [ ] CHK-111 [P1] The guard on an unchanged tree reports 0 hard findings (NFR-R01)
- [ ] CHK-112 [P2] N/A: no load testing
- [ ] CHK-113 [P2] Guard wall time on the replay logged in `goal.md` section 4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback is one `git revert` of the phase commit
- [ ] CHK-121 [P1] The guard honors the sk-doc validation switch like the other shared scripts
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
- [ ] CHK-141 [P1] The Update Workflow and creation-workflow name the same guard command
- [ ] CHK-142 [P2] N/A: no user-facing doc beyond the sk-create-skill docs
- [ ] CHK-143 [P2] The pinned entries and scan output logged for phase 003
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Operator, approves the phase commit | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
