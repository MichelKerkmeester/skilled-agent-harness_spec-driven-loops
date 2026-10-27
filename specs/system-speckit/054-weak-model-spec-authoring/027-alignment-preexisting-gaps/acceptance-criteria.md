---
title: "Acceptance Criteria: Phase 27: alignment-preexisting-gaps"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment preexisting gaps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/027-alignment-preexisting-gaps"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked AC-004 Met, so AC-001 to AC-007 are Met"
    next_safe_action: "Run the closeout gates AC-008 to AC-011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-027-alignment-preexisting-gaps"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 27: alignment-preexisting-gaps

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `027-alignment-preexisting-gaps`
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the root README and the six other READMEs, When `check_readme_references.py` runs on them, Then no existing slash command, bare filename or gitignored personal file is reported, and a README naming a missing command or path still exits 1 | Observed: `check_readme_references.py` on the seven READMEs prints `SUMMARY files=7 pass=7 fail=0` and exit 0, with the root README at `references=403 unresolved=0 skipped=32`. Real broken references and command typos still fail in the new tests (`.skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py:111`, `.skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py:143`) | Met | - |
| AC-002 | REQ-002 | Given the eight probes in `scratch/items.md`, When `advisor_recommend` scores each one, Then sk-doc ranks first on the four packet-local changelog probes and system-spec-kit first on the four spec-kit probes, with no scorer change | Observed: the golden, prompt-policy and holdout suites pass (36 tests) with the fixture adding 15 cases in total, five sk-doc changelog cases and ten controls, the thin-margin case included. The full advisor suite printed 1267 passed, 8 skipped and 0 failed against a 1253 baseline. **Amended 2026-10-27:** the "no scorer change" clause is replaced by the one approved changelog-from-packet rule in `primaryIntentBonus` and its two constants, recorded in the spec.md scope amendment (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:736`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:224`) | Met | - |
| AC-003 | REQ-003 | Given a copy of `20261027T154036Z` whose `critic.json` carries overrides for CR-1, CR-2 and CR-5, When the aggregator reruns, Then D2 sits in the outside-scope section, PRB-01 to PRB-03 and A-2 sit under "Overturned by the critic", and the counts drop by those findings | Observed by the conductor on the rerun: 27 findings with P1=8 became 23 with P1=5 and overturned=4, and `overturned.json` is written. Both workflow YAMLs ask the critic for `overrides` with the same shape. The aggregator is gitignored, so the rerun output is the evidence (the alignment command's aggregator, gitignored and operator-local) | Met | - |
| AC-004 | REQ-004 | Given the root README, When `check_derived_readme_counts.py` runs, Then it reports no failure on count-free prose such as line 221, and a README with a wrong numeric count still exits 1 | Observed: the count checker verifies a claim against the folder the sentence names, or against a tree line, and reports unverifiable claims separately, which `--strict` fails. On the seven READMEs it prints `files=7 pass=7 fail=0 unverified=6`, exit 0. It caught one real wrong count, `system-spec-kit/README.md:382` "two committed scripts" for a folder of five, and that line now names the two scripts. A wrong count still fails in the new tests (`.skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py`) | Met | - |
| AC-005 | REQ-005 | Given Lane R landed, When `run-script-tests.sh` runs and both checkers rerun on the seven READMEs, Then every new test passes and fails with its fix reverted, and a before and after table lists every residual failure judged real or not | Observed: `run-script-tests.sh` passes, `test_validation_switch.py` passes 8, and the test file holds 40 pytest cases, each fix shown to fail before it. Unresolved references across the seven READMEs went from 608 to 0, so no residual is left to judge: the references checker prints `files=7 pass=7 fail=0` and the count checker `files=7 pass=7 fail=0 unverified=6`, both exit 0 (`.skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py:244`) | Met | - |
| AC-006 | REQ-006 | Given a lane file with numeric finding ids, When the aggregator runs, Then it exits 0 with no `localeCompare` error and each id is a string prefixed with the lane id | Observed by the conductor: the numeric-id run no longer crashes, ids are coerced to strings and `source_id` is kept. The aggregator is gitignored, so the rerun output is the evidence (the alignment command's aggregator, gitignored and operator-local) | Met | - |
| AC-007 | REQ-007 | Given all lanes landed, When the conductor gates run, Then the sk-doc script tests and the advisor gates pass, the CLI suite runs only if spec-kit code changed, the Hermes sync is clean, strict validation prints `RESULT: PASSED` and a fresh Opus medium review reports no P0 | Observed: `run-script-tests.sh` passes. Compiled-route-guard, compiled-route-admission `--all`, skill-graph-freshness `--strict`, router-intent-signals `--check`, the skill_graph_compiler validation, typecheck and build exit 0. The spec-kit runtime diff is empty, so the CLI suite was not needed. The Hermes skill check prints 67 copies in sync and the prompt check 39, both exit 0. Strict validation of this phase prints `RESULT: PASSED`, and the per-lane fresh reviews reported no P0. A fresh Opus medium review of the whole phase also found no P0, and its P1 and P2s are being fixed (`specs/system-speckit/054-weak-model-spec-authoring/027-alignment-preexisting-gaps/scratch/after/advisor-suite.txt:11`) | Met | - |
| AC-008 | REQ-008 | Given the phase docs are closed, When `validate.sh --strict --recursive` runs on packet 054, Then every folder prints `RESULT: PASSED` | Open: run by the conductor at closeout | Unmet | - |
| AC-009 | REQ-008 | Given every gate above passed, When the change is committed on the worktree branch, Then `git status --short` lists no file this phase changed | Open: run by the conductor at closeout | Unmet | - |
| AC-010 | REQ-008 | Given the commit, When the branch is rebased onto main, Then no conflict is left and this branch's system-spec-kit entry reads v2.12.10.0 after main's v2.12.8.0 and v2.12.9.0, with the new advisor v0.17.10.0 and sk-create-readme v1.3.2.0 entries in place | Open: run by the conductor at closeout | Unmet | - |
| AC-011 | REQ-008 | Given the rebase, When `generate-trigger-index.mjs` rebuilds the trigger index, Then its `--check` exits 0 | Open: run by the conductor after the rebase | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

AC-001 to AC-007 are Met. AC-008 to AC-011 are the closeout gates the conductor runs: recursive validation, the commit, the rebase and the trigger-index rebuild.
<!-- /ANCHOR:closure -->
