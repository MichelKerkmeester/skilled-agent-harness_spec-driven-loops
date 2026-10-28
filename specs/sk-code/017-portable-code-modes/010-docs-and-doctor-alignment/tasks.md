---
title: "Tasks: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "docs and doctor alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior

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

`K` is `.skilled/skills/sk-code`. `HEADCOUNT` is `git show HEAD:<file> | grep -c "<phrase>"` and `NOWCOUNT` is `grep -c "<phrase>" <file>`; each probe below reads `HEAD` count, then the changed-tree count.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the gates (`K/sk-code-review/manual-testing-playbook`, `K/sk-code-quality/manual-testing-playbook`, `K/manual-testing-playbook`). Verify: `validate-playbook-package.cjs --package` printed review `PASS scenarios=34 violations=0 warnings=0`, quality `PASS` with 11 warnings, hub `PASS`; the canary `OK`; `check-rule-copies.test.sh` all passed; the setup battery 8 of 9 legs, `FAIL drift-guards`.
- [x] T002 Find every surface and record the stale claims (`spec.md` section 3). Verify: `rg` over the READMEs, references, catalog, doctor text and hook docs produced the 23 rows of the stale-claim table.
- [x] T003 Build the three foreign-repository fixtures and run them (scratch folder, `builders/*.sh`). Verify: each builder runs twice and `diff -r` prints nothing; the linter, the resolver and the runner outputs were saved.
- [x] T004 Run three live `@review` reviews over the fixtures (the `@review` agent). Verify: the terse repository read `APPROVED` with no documentation finding, the every-function repository read `APPROVED` with a P2 documentation finding, the refusing repository read `REQUESTED_CHANGES` with `Refused: docs/code-style.md`; `check-review-final-line.js` and `check-review-findings.js` exit 0 on all three.
- [x] T005 Read the sk-doc contracts before the first non-spec `.md` edit (`sk-doc`, `sk-create-readme`, `sk-create-manual-testing-playbook`, `sk-create-feature-catalog`, `sk-create-changelog`, `sk-create-frontmatter`). Verify: the playbook validator's rule about the literal word for the blocking gate value and the backtick-path warning were applied (T012, T013).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Fix the review scripts README: broken linter path, fixture tree (`K/sk-code-review/scripts/README.md`). Verify: the path probe `\.\./\.\./shared/scripts/check-rule-overrides` read 0 then 1; `status-commented-open-p1` read 1 then 2; the setup battery `drift-guards` read `FAIL` then `PASS`.
- [x] T007 Rewrite the review README for the floor, the default lens, the `Rule sources:` line and the agent verdict (`K/sk-code-review/README.md`). Verify: `Rule sources` read 0 then 9, `Floor, Default Lens` 0 then 1, `advisory` 0 then 2; `check_readme_references.py` printed `PASS ... unresolved=0`.
- [x] T008 Add the `Rule sources:` line and retire the older verdict words in the report flow (`K/sk-code-review/references/review-ux-single-pass.md`). Verify: `Rule sources` read 0 then 1; `validate_document.py --json` `total_issues` 0.
- [x] T009 Add the review playbook category and scenarios CR-029 to CR-031, renumber the later sections, extend the index and the ledger (`K/sk-code-review/manual-testing-playbook/`). Verify: `validate-playbook-package.cjs --package` read `scenarios=34 categories=10` then `scenarios=37 categories=11 violations=0 warnings=0`; `CR-031` count in the root read 0 then 9.
- [x] T010 Add the `--mode-only` supplement to the canary scenario (`K/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md`). Verify: `validate_document.py --json` `total_issues` 0 and the playbook validator `violations=0`.
- [x] T011 Update the quality README, `SKILL.md`, scripts README and library README (`K/sk-code-quality/README.md`, `SKILL.md`, `scripts/README.md`, `scripts/lib/README.md`). Verify: `disableRules` read 0 then 3 in the README, `explain <path>` 0 then 1 in the scripts README, `hygieneCheckerFlags` 0 then 1 in the library README; `check_readme_references.py` `PASS` on all three; `check_derived_readme_counts.py` shows only the two failures that exist at `HEAD`.
- [x] T012 Add quality scenario CQ-012 and run it (`K/sk-code-quality/manual-testing-playbook/quality-gate/disabled-hygiene-rules.md`). Verify: the replay printed `exit_code 0`, `disabled hygiene.issue`, `findings none`, then without the key `exit_code 1`, `findings hygiene.issue@src/total.js:1`; matches the expected block in this tree and in an `origin/main` archive.
- [x] T013 Add quality scenario CQ-013 and run it (`K/sk-code-quality/manual-testing-playbook/quality-gate/floor-override-refused.md`). Verify: linter `exit 1`, resolver `refused true rows 0`, gate with the row alone `gate ERROR` and `gate exit 3` on the `origin/main` archive, config with `secret.private-key` `gate ERROR`, `gate exit 3`; the doc states the `origin/main` result (see implementation-summary, judgment call 4).
- [x] T014 Extend the quality playbook root (`K/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md`). Verify: heading `CQ-001..CQ-013`; `CQ-013` read 0 then 6; the validator `scenarios=13 warnings=11`, the same 11 as at `HEAD`; the drift guard path check passes after the test-module path was corrected to `../../shared/`.
- [x] T015 Describe the house style in the SKILLED README (`K/sk-code-skilled/README.md`). Verify: `House Style Lives Here` read 0 then 1; `check_readme_references.py` `PASS`.
- [x] T016 Update the hub README, the shared README and the contract scope (`K/README.md`, `K/shared/README.md`, `K/shared/references/universal/rule-overrides.md`). Verify: `Rules A Repository Can Change` 0 then 1, `v3.9.1.0` 1 then 0, `will call` 1 then 0; `node --test K/shared/scripts/tests/*.test.cjs` `tests 18 pass 18`.
- [x] T017 Update the feature catalog root, three leaves and add three leaves (`K/feature-catalog/`). Verify: `rule-overrides-and-hygiene-policy` read 0 then 1 in the root; `validate_catalog_package.py --package sk-code --json` `"verdict": "PASS"`, `violationCount` 0; `validate_document.py --type feature_catalog` `total_issues` 0.
- [x] T018 Update the doctor command text and assets (`.skilled/commands/doctor/sk-code.md`, `assets/doctor-sk-code-presentation.txt`, `assets/doctor-sk-code-quality.yaml`, `assets/doctor-setup-presentation.txt`, `scripts/README.markdown`). Verify: `Hygiene:` read 0 then 2 in the presentation; `node --test .skilled/commands/doctor/scripts/tests/` `pass 485 fail 0`.
- [x] T019 Name the config key in the hook and CI docs (`.skilled/scripts/git-hooks/README.md`, `.skilled/hooks/git/README.md`, `.github/workflows/README.md`). Verify: `commentHygiene` read 0 then 1 in both hook READMEs; `disable` 1 then 2 in the workflows README; `ci-report.test.cjs` and `doctor-ci-contract.test.cjs` pass inside the 485.
- [x] T020 Update the root README (`README.md`). Verify: `Rule sources` read 0 then 1; `advisory` 3 then 4; `check_readme_references.py` `PASS README.md: references=379 unresolved=0`.
- [x] T021 Check the agents (`.skilled/agents/review.md`, `deep-review.md`, `orchestrate.md`, `code.md`). Verify: each already states the severity verdict, the advisory score, the marker and the `Quality Gate` field, so no edit and no mirror run; `git diff --stat -- .skilled/agents` is empty.
- [x] T022 Write four changelog entries and step the carriers (`K/changelog/v3.9.14.0.md`, `K/sk-code-quality/changelog/v1.13.8.0.md`, `K/sk-code-review/changelog/v1.9.7.0.md`, `K/sk-code-skilled/changelog/v2.1.9.0.md`; the four `SKILL.md` versions, `description.json`, `hub-router.json`, `mode-registry.json`). Verify: `validate_document.py --json` `total_issues` 0 on all four; the local newest versions were 3.9.12.0, 1.13.6.0, 1.9.6.0 and 2.1.8.0 and `origin/main` held 3.9.13.0 and 1.13.7.0, so the hub and quality entries sit above both.
- [x] T023 Bump the frontmatter version of every changed non-SKILL doc and start new docs at 1.0.0.0 (17 changed docs). Verify: a script printed the third segment up by one and the fourth reset for each, for example `README.md 1.3.3.0 -> 1.3.4.0`.
- [x] T024 Regenerate the compiled-route manifest and the Hermes copies (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived copy, `.hermes/skills/`). Verify: the guard read `stale-manifest` then `PASS guard`; `sync-skills-hermes.cjs` printed `Wrote 4 of 67 Hermes skill copies` and `--check` printed `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Validate every changed doc. Verify: a loop over 39 changed or new docs printed `39 files, with issues: 0` (the two root playbooks need `--type playbook`, the catalog root `--type feature_catalog`).
- [x] T026 Run the playbook and catalog validators. Verify: review `scenarios=37 categories=11 violations=0 warnings=0`; hub `scenarios=28 violations=0 warnings=0`; quality `violations=0` with the baseline 11 warnings; catalog `PASS`.
- [x] T027 Run the drift guards and the setup battery. Verify: `node K/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` `3/4` before the path fix, then the battery printed `STATUS=OK legs=9`.
- [x] T028 Run the suites. Verify: `check-rule-copies.js` exit 0; `check-rule-copies.test.sh` `All rule-canary test cases passed`; the quality suite `tests 137 pass 137 fail 0`; the doctor suite `pass 485 fail 0`; the shared suite `tests 18 pass 18 fail 0`.
- [x] T029 Validate the spec folder. Verify: `validate.sh <folder> --recursive --strict` prints `RESULT: PASSED` and the parent prints `RESULT: PASSED` non-recursively (see implementation-summary, Verification).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: three live `@review` runs matched their scenarios and the report checkers exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Outcome**: See `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`: REQ-001 to REQ-007.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified: the landed children, and the two commits on `origin/main` noted as a merge risk.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py --json` shows 0 issues on all 39 changed or new docs.
- [x] CHK-011 [P0] No new warning in any playbook validator: review 0, quality 11 (the baseline), hub 0.
- [x] CHK-012 [P1] The README reference checker shows no new failure; the four failing READMEs fail the same way at `HEAD` (hook READMEs and two count claims).
- [x] CHK-013 [P1] Each changed doc keeps its own structure and voice.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: see `acceptance-criteria.md`.
- [x] CHK-021 [P0] The three live `@review` runs and the quality replays were done, and their output is the expected output in the playbooks.
- [x] CHK-022 [P1] Edge cases tested: a refused row beside valid rows is not applied (CQ-013 triage), and a repository with no override section behaves as before.
- [x] CHK-023 [P1] Error scenarios validated: the refused floor row (linter exit 1) and the fixed hygiene id (`CONFIG_INVALID`, exit 3).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each stale claim has a class: all 23 are `instance-only` wording fixes except rows 1 and 2, which are `cross-consumer` (a path and a tree the drift guard reads).
- [x] CHK-FIX-002 [P0] Same-class inventory: `rg -n "will call|v3.9.1.0|Baseline Plus Surface" .skilled/skills/sk-code --glob '*.md'` finds none of the three phrases in a changed doc.
- [x] CHK-FIX-003 [P0] Consumer inventory: the READMEs, the catalog, the playbooks, the doctor text and the hook docs were each searched for the old phrases.
- [x] CHK-FIX-004 [P0] N/A: no security, path or parser fix. The floor-refusal scenarios are the adversarial cases for the contract.
- [x] CHK-FIX-005 [P1] Matrix: three review scenarios by (drop, replace, refused) and two quality scenarios by (hygiene key, floor row), five rows run.
- [x] CHK-FIX-006 [P1] Hostile env variant: the replays ran from a scratch folder with no git history and a different working directory from the checkout.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `HEAD` `780cbd7cd8` for the baselines and to an `origin/main` archive (`2aaf7070e0`) for the replays.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the fixtures hold none and a fixture with a private-key id only names the rule.
- [x] CHK-031 [P0] N/A: no input handling changes.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree on the 23 claims, the five scenarios and the four changelogs.
- [x] CHK-041 [P1] No code comments changed.
- [x] CHK-042 [P2] READMEs updated: ten of them.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the session scratchpad, not in the tree.
- [x] CHK-051 [P1] `scratch/` of this packet holds nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
