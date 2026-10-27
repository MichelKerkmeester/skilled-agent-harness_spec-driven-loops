---
title: "Tasks: Phase 2: quality-hygiene-policy"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "quality hygiene policy tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: quality-hygiene-policy

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

`Q` is `.skilled/skills/sk-code/sk-code-quality`. "Before" runs use the source files at HEAD with the new tests in place, and "after" runs use the final source.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the checker's rule table and the config validator (`$Q/scripts/check-comment-hygiene.sh:121-143`, `$Q/scripts/lib/quality-config.cjs`). Verify: the table holds 21 rules and `HYGIENE_KEYS` refuses any other key. Observed: 21 rules, 6 tracker ids and 15 spec-kit vocabulary ids.
- [x] T002 Find every caller of the checker that blocks. Verify: `rg -l check-comment-hygiene` outside specs and changelogs. Observed: the runner, `.skilled/scripts/git-hooks/pre-commit`, the legacy `.skilled/hooks/git/pre-commit`, `.github/workflows/comment-hygiene.yml`, and the advisory post-edit router and legacy `claude-posttooluse.sh`.
- [x] T003 Capture baselines. Verify: the quality node suite, the checker suite, the pre-commit suite and the doctor suite. Observed: pass 123 fail 0, all checker cases passed, 145 passed 0 failed, pass 9 fail 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `--disable-rule` to the checker, with fixed-id and unknown-id refusals and `disabled_rules` in the JSON document (`$Q/scripts/check-comment-hygiene.sh`). Verify: `bash $Q/scripts/tests/check-comment-hygiene.test.sh`. Before: 7 cases failed, exit 1. After: `All comment hygiene test cases passed`, exit 0.
- [x] T005 Add `commentHygiene.disableRules` to the schema, merge and flag builder, reading rule names from the checker and fixed ids through `loadContract` (`$Q/scripts/lib/quality-config.cjs`, `$Q/assets/quality-config.template.json`). Verify: the three `disableRules:` tests in `$Q/scripts/tests/quality-config.test.cjs`. Before: pass 0 fail 3. After: pass 3 fail 0.
- [x] T006 Pass the flags from the runner and add `config.hygiene.disabled` to the verdict, touching only `hygieneFlags`, `HYGIENE_FLAG_FIELDS`, `configSummary`, the two error-path config objects and the text line (`$Q/scripts/quality-gate.cjs`). Verify: the foreign-fixture test asserts `config.hygiene` and the argv. Observed: passes after, fails before.
- [x] T007 Add the flag helper (`$Q/scripts/hygiene-config-flags.cjs`). Verify: `node $Q/scripts/hygiene-config-flags.cjs --json` in this repository prints `"source": "none"` and empty flags, exit 0, in 0.062 s.
- [x] T008 Read the flags in the pre-commit hook and the legacy helper (`.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit`). Verify: case 44b in `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. Before: 146 passed, 3 failed. After: 152 passed, 0 failed, with the round 1 cases.
- [x] T009 Read the flags in the CI hygiene job (`.github/workflows/comment-hygiene.yml`). Verify: its run block replayed in a scratch repository. Observed: no config exit 1 with two annotations, `disableRules: ["issue","adr"]` exit 0 `All clear`, an unknown id prints the `::warning::` line and exits 1.
- [x] T010 Add the disabled list to `status` and the spec-kit suggestion to `init` (`.skilled/commands/doctor/scripts/sk-code-quality-config.cjs`). Verify: the two new tests in `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs`. Before: pass 0 fail 2. After: the suite prints pass 11 fail 0.
- [x] T011 Document the key, the flag, the helper and the field (`$Q/references/quality-config.md`, `$Q/references/runner-contract.md`, `$Q/scripts/README.md`, `$Q/SKILL.md`). Verify: `validate_document.py` on each. Observed: `total_issues` 0 on all four.
- [x] T012 Write the changelog and step the carrier (`$Q/changelog/v1.13.4.0.md`, `$Q/SKILL.md`). Verify: `validate_document.py` 0 issues and `grep '^version' $Q/SKILL.md` prints `version: 1.13.4.0`. Observed: both.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the whole quality node suite. Verify: `node --test $Q/scripts/tests/*.test.cjs`. Observed: tests 127, pass 127, fail 0, exit 0.
- [x] T014 Run the other quality bash suites. Verify: ceiling report, typo flags and the post-edit adapter. Observed: each prints its pass line, exit 0.
- [x] T015 Run the neighboring suites. Verify: `node --test` over the shared suite, the post-edit router suite and the setup-check suite. Observed: pass 41 fail 0.
- [x] T016 Check this repository is unchanged. Verify: the checker over every tracked and untracked file prints 0 lines, and `hygiene-config-flags.cjs` reports source `none`. Observed: 0 lines, source none.
- [x] T017 Check the workflow. Verify: the YAML parses, `actionlint` exits 0 and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`. Observed: all three, failures=0.
- [x] T018 Run the quality runner on the change. Verify: `quality-gate.cjs --format text --worktree`. Observed: `gate=NO_BLOCKER_FOUND exit=0`, findings 0.
- [x] T019 Sync Hermes. Verify: `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`. Observed: that line, after one copy was written.
- [x] T021 Review round 1: the helper passed every `commentHygiene` flag to pre-commit and CI, so a ticket prefix in a runner-excluded file and a pattern only JavaScript accepts both changed the commit and CI result. Make the helper emit only `hygieneDisableFlags` and restore the documented design (`$Q/scripts/hygiene-config-flags.cjs`, `$Q/scripts/lib/quality-config.cjs`). Verify: the new helper test in `$Q/scripts/tests/quality-config.test.cjs` and the three new cases in `pre-commit.test.sh`. Before the fix: helper test pass 0 fail 1, pre-commit 150 passed 2 failed. After: pass 1 fail 0, 152 passed 0 failed. The CI run block replayed with `{ticketPrefixes, exclude}` and with the bad pattern prints `All clear`, exit 0, as HEAD does.
- [x] T020 Validate this folder. Verify: `validate.sh <folder> --recursive --strict` prints `RESULT: PASSED`. Observed: see `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every new test fails before the change and passes after it
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-009 in section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `rule-overrides.json` from phase 001 is on main.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: the runner reports `NO_BLOCKER_FOUND`, with `syntax-cjs`, `syntax-python`, `syntax-shell` and `syntax-yaml` `RAN_CLEAN`, and `actionlint` exits 0.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the suites print no stderr outside the asserted cases.
- [x] CHK-012 [P1] Error handling implemented. Evidence: an unreadable contract fails closed in the checker and the validator, and a helper failure keeps every core rule on.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the helper copies the `MODULE:` header, numbered sections and `require.main` guard of the doctor script.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. Evidence: T009, the CI run block replayed three ways.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a qualified id, a duplicate id, a non-list value and a missing flag value.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: unknown and fixed ids in the config, the checker and the pre-commit hook.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the runner's `secrets RAN_CLEAN`.
- [x] CHK-031 [P0] Input validation implemented. Evidence: each `disableRules` entry is checked against the checker's table and the fixed list before any check starts.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no authentication surface. The key cannot touch the secret or conflict-marker sensors.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three name the same files and the same two decisions.
- [x] CHK-041 [P1] Code comments adequate. Evidence: WHY comments only, and the whole-tree hygiene check prints 0 lines.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `$Q/scripts/README.md` contents tree and file table.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the fixtures and the before-copies lived in the session scratchpad, outside the repository.
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
