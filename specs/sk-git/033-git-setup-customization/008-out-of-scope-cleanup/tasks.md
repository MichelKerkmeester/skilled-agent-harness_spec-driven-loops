---
title: "Tasks: Phase 8: out-of-scope-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "out of scope cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: out-of-scope-cleanup

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Verify each issue against the code and record baselines (drift guards, drift verifier suite, doctor runner, Hermes sync check). All four held. Baselines: drift guards 1 guard FAILED with 16 `ROUTER-DEAD-PATH` errors, drift verifier 27 passed, doctor runner 7 suites passed with node:test 332/332, Hermes sync `PASS: 68`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Issue 1: skip spec evidence in the router dead-path walk, with a test (`verify_alignment_drift.py`, `test_verify_alignment_drift.py`). FIXED: `check_router_paths()` now calls the existing `is_unscanned_record_path()`. Drift guards `all 4 guards PASSED`, verifier 28 passed.
- [x] T003 Issue 2: add the phrase-reach suite and restore the coverage claim (`tests/doctor-phrase-reach.test.cjs`, `scripts/README.md`, `tests/README.md`). FIXED: 2 tests pass, node:test in the runner 334/334. The README names `skill-graph-freshness.cjs` as the one script whose test lives in the advisor runtime.
- [x] T004 Issue 3: drop the header semicolons, update the marker pattern and regenerate the mirrors (`sync-skills-hermes.cjs`, `verify_alignment_drift.py`, `.hermes/skills/*/SKILL.md`). FIXED: 68 mirrors regenerated, the diff touches only the 68 marker lines and the 57 skill-header sentence lines, header semicolons 0 in all 68, `PASS: 68 Hermes skill copies in sync`.
- [x] T005 Issue 4: state one gate position across sk-create-command (`SKILL.md`, `README.md`, references, `assets/command-template.md`, playbook). FIXED in the direction the shipped commands follow, not the proposed one: the gate sits after the H1 and its purpose line, before any workflow step. Eight of the nine shipped commands with a `MANDATORY INPUT GATE` follow it. Three template skeletons and the worked example moved their gate below the H1.
- [x] T009 Move the `/doctor:git` input gate below the H1 and its purpose line (`.skilled/commands/doctor/git.md`), so all nine shipped commands follow the rule T005 settled. FIXED by the orchestrator after the build reported `git.md` as the one remaining exception. The gate text is unchanged and `sync-runtime-mirrors.cjs --check` still prints `PASS: 185 mirrors across 8 trees are in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Mutation check for each code fix. Old router walk: the evidence test fails. Freshness refusal disabled: the stale-build test fails. Old marker pattern: the generated-copy test fails. Each fix restored and rechecked.
- [x] T007 Run every gate and record the result lines. See `implementation-summary.md` Verification.
- [x] T008 Update implementation-summary.md and save continuity
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
<!-- /ANCHOR:cross-refs -->

---



