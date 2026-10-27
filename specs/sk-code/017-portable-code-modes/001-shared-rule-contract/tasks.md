---
title: "Tasks: Phase 1: shared-rule-contract"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "shared rule contract tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: shared-rule-contract

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

`S` is `.skilled/skills/sk-code/shared`. `T` is `$S/scripts/tests/check-rule-overrides.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the rule id grammar (`.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` section 5). Verify: the section defines `<class>.<name>` with the `hygiene`, `conflict`, `secret`, `syntax`, `debug` and `dist` classes. Observed: it does.
- [x] T002 Read the floor and the superseded decisions (`code-quality-standards.md` sections 3 to 5, `specs/sk-code/015-quality-agnostic-gate/spec.md` section 5). Verify: `rg -n '^### ADR-00[13]' specs/sk-code/015-quality-agnostic-gate/spec.md` prints lines 227 and 241. Observed: both lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the hard floor list (`$S/references/universal/rule-overrides.json`). Verify: `node -e "console.log(require('./$S/references/universal/rule-overrides.json').fixed.length)"` prints 13. Observed: 13, after the two review minimum ids joined.
- [x] T004 Write the contract (`$S/references/universal/rule-overrides.md`). Verify: `validate_document.py` on it reports `"total_issues": 0`. Observed: 0 issues, type `reference`.
- [x] T005 Write the linter (`$S/scripts/check-rule-overrides.cjs`). Verify: `node $S/scripts/check-rule-overrides.cjs $S/references/universal/rule-overrides.md` prints `OK ...: no Rule overrides section` and exits 0. Observed: exit 0, the fenced example is not read as a section.
- [x] T006 Write the suite (`T`): valid none and replace rows, a numbered heading, a floor-id refusal, malformed rows, a repeated id and a second section, an absent section and a fenced example, usage errors, the floor agreement and the reference linting clean. Verify: `node --test T` prints `pass 11` and `fail 0`. Observed: pass 11, fail 0.
- [x] T007 Index the new files (`$S/README.md`). Verify: `check_readme_references.py $S/README.md` prints `unresolved=0`. Observed: references=61 unresolved=0.
- [x] T008 Write the hub changelog and step the carriers (`.skilled/skills/sk-code/changelog/v3.9.7.0.md`). Verify: `parent-skill-check.cjs .skilled/skills/sk-code` prints `13b-version: SKILL.md version 3.9.7.0 matches the newest changelog entry`. Observed: that line, and `OK: parent-skill-check`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the suite before the linter exists, in a scratch copy holding only the test file. Verify: `node --test` fails. Observed: `Cannot find module '../check-rule-overrides.cjs'`, pass 0, fail 1, exit 1.
- [x] T010 Prove the agreement test catches drift, in a scratch copy whose JSON gains `floor.extra`. Verify: the floor agreement test fails. Observed: pass 8, fail 1, the failing test is the floor agreement, exit 1.
- [x] T011 Run the quality runner on the four new files. Verify: `quality-gate.cjs --format text --files ...` prints `gate=NO_BLOCKER_FOUND exit=0`. Observed: that line, `findings: 0`.
- [x] T012 Sync Hermes. Verify: `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`. Observed: that line.
- [x] T013 Validate this folder and the parent. Verify: `validate.sh <folder> --recursive --strict` prints `RESULT: PASSED`. Observed: see `implementation-summary.md`.
- [x] T014 Confirm the scope held. Verify: `git status --short` lists no path under `sk-code-quality/` or `sk-code-review/`. Observed: none listed.
- [x] T015 Run the shared suite in CI (`.github/workflows/sk-code-script-tests.yml`), with the switch, timeout, permissions and path filters unchanged. Verify: the YAML parses, `actionlint` exits 0 and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`. Observed: all three, with `failures=0` and 361 twin pairs.
- [x] T016 Review round 1: make `lintOverrides` the only exported reading path, add `review.security-minimums` and `review.correctness-minimums` to the floor, refuse a `replace:` row on a machine-checked id, write each mode's outcomes once, and correct the changelog, README and workflow comment. Verify: in a scratch copy without the machine-check refusal and the two ids, the suite fails 3 tests, and on the real files it prints `pass 11` and `fail 0`. Observed: fail 3 (the machine-check test, the reading-path test and the agreement test), then pass 11, fail 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The suite fails without the linter and passes with it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Program decisions**: See `../spec.md` section 5
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

A blocked P0 task keeps the phase open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005 in section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: Node built-ins only.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: the quality runner reports `NO_BLOCKER_FOUND` with `syntax-cjs RAN_CLEAN` and `comment-hygiene RAN_CLEAN`.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the suite prints no stderr outside the asserted cases.
- [x] CHK-012 [P1] Error handling implemented. Evidence: an unreadable file or floor list exits 2 with the read error.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: `MODULE:` header, `'use strict'`, numbered sections and `node:test`, as in `sk-code-quality/scripts/lib/quality-config.cjs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the linter on the contract reference exits 0.
- [x] CHK-022 [P1] Edge cases tested. Evidence: absent section, fenced example, second section, repeated id.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: no argument and a missing file both exit 2.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the runner's `secrets RAN_CLEAN`.
- [x] CHK-031 [P0] Input validation implemented. Evidence: the floor JSON is validated on load, and every row is checked for grammar and action.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: the linter reads local files only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three name the same four files.
- [x] CHK-041 [P1] Code comments adequate. Evidence: WHY comments only, and the hygiene check runs clean.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `shared/README.md` sections 1, 2, 5 and 6.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the probes ran in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: only `.gitkeep` remains.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
