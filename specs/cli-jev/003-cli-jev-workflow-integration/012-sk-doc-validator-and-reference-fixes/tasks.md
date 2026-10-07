---
title: "Tasks: sk-doc Validator Notices and Dead Playbook Citations"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk doc validator and reference fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-doc Validator Notices and Dead Playbook Citations

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

- [x] T001 Rerun `git log -5 --format='%h %ad %s' --date=short` and `git status --short` on every path in the spec's Files to Change table. Stop and report if any path changed after 2026-09-27 or holds uncommitted work. Evidence: the orchestrator found no uncommitted change on the eight paths before the first brief, at build-start HEAD `6f47c32dce` (after the main merge `d6e512e6b5`). `validate_document.py` had changed after planning (`666abc1a22e` and `e33f1a6ff3e`, 2026-09-27), which moved its pins by 11 lines. The orchestrator reported it in `scratch/briefs/00-index.md` and brief 01 used the new lines
- [x] T002 Reopen every cited line at the build HEAD: `validate_document.py:255-256` (`:266-267` at the build-start HEAD), `quick_validate.py:239-251`, `deep-research-presentation.txt:233-236` and `:379-388`, the playbook rows at `exhausted-approach-respect.md:119`, `pause-sentinel-halt.md:105` and `session-capturing-pipeline-quality-coverage.md:100`, `:117-118`. Update the pins in this phase's docs if a line moved. Evidence: `scratch/briefs/00-index.md` records the reread at the post-merge HEAD. `validate_document.py` moved to README default `:266-267`, `detect_document_type` `:221-267`, `validate_document()` `:1574-1678`. The `quick_validate.py`, presentation-file and playbook pins held. `research.md` has 159 lines and `memory-pipeline-regressions.vitest.ts` 62. This closure rewrote the stale pins in `spec.md`, `plan.md` and this file, citing by function name where the build shifts a line
- [x] T003 Run `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and save the failing set by name to `scratch/suite-baseline.txt` (expected on 2026-09-27: the four files named in REQ-006). Evidence: 24 files PASS, 2 FAIL (`test_readme_manifest.py`, `test_rename_tooling_fixture_harness.py`), exit 1. The failing set is recorded by name in the orchestrator's build evidence, not in `scratch/suite-baseline.txt`, which is not in `scratch/`. Two of REQ-006's four planning-time failures remained
- [x] T004 [P] Rerun the two fallback probes with `--json` and save their output and exit status to `scratch/fallback-baseline.txt`: `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` (exit 0) and `.skilled/repo-rules/communication.md` (exit 1). Evidence: the playbook root index exits 0 as `readme`, `warnings` `[]`, `total_issues` 0. `communication.md` exits 1 as `readme`, `total_issues` 1, no fallback entry. Recorded in the orchestrator's build evidence, not in `scratch/fallback-baseline.txt`
- [x] T005 [P] Recount non-qualified MCP tokens in `allowed-tools` across tracked markdown outside `specs/` with `is_non_fq_mcp_token` and `iter_allowed_tools` from `quick_validate.py`. Expect 0. Stop and report if any skill carries one. Evidence: 0 non-qualified tokens, counted with `quick_validate.py`'s own `_MCP_FULLY_QUALIFIED_RE`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Separate the README default from the path rules so `validate_document()` can tell it was hit, keeping `detect_document_type()`'s signature and return value (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`). Evidence: brief 01 (codex gpt-5.5 medium), commit `a9dbac98ef`. A private `_detect_document_type_with_source()` returns the type with `'rule'` or `'default'`, and `detect_document_type()` wraps it and still returns a string
- [x] T007 Append one `document_type_fallback` warning with a `fix_hint` naming `--type` when `doc_type` was `None` on entry and the default was hit. `valid` and `exit_code` stay computed from blocking errors only (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`). Evidence: brief 01, commit `a9dbac98ef`. The playbook probe exits 0 with exactly one `document_type_fallback` warning. `--type readme` exits 0 with no fallback entry. `py_compile` ok
- [x] T008 Make the MCP-token branch return invalid for every package kind and add the rule to the docstring's `Validates:` list (`.skilled/skills/sk-doc/shared/scripts/quick_validate.py`). Evidence: brief 02 (cursor grok-4.7-xhigh-fast, codex having hit its usage limit), commit `a9dbac98ef`. The skill-only warning branch is gone and the docstring's `Validates:` list names the rule
- [x] T009 [P] Add two pytest cases: an untyped document with no `doc_type` carries the warning and keeps its exit code, and the same document with `doc_type='readme'` carries none (`.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py`). Evidence: `test_untyped_document_reports_readme_fallback` and `test_typed_or_named_readme_gets_no_fallback`. `ONLY_TESTS=test_structure_validation.py run-script-tests.sh` prints `PASS`
- [x] T010 [P] Add two cases to the runner: a skill fixture with `allowed-tools: [Read, mcp__code_mode]` is invalid, and one with `mcp__code_mode__*` is valid (`.skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py`). Evidence: Case 6 (`[Read, mcp__code_mode]` invalid, message names `mcp__<server>__<tool>`) and Case 7 (`[Read, mcp__code_mode__*]` valid, no token warning). `test_quick_validate_086.py` prints `PASS`, exit 0
- [x] T011 Update the "Wrong document type detected" row to say a fallback now prints a `document_type_fallback` warning (`.skilled/skills/sk-doc/README.md`). Evidence: brief 03 (pi deepseek-v4.1-flash), commit `a9dbac98ef`. `git diff --stat` 1 file, 1 insertion, 1 deletion. `validate_document.py` on the README prints `VALID`, exit 0
- [x] T012 [P] Repoint the source rows: `research.md:307-317` becomes `.skilled/commands/deep/assets/deep-research-presentation.txt:379-388` and `research.md:176-185` becomes `.skilled/commands/deep/assets/deep-research-presentation.txt:233-236`, anchor text unchanged (`exhausted-approach-respect.md`, `pause-sentinel-halt.md`). Evidence: briefs 04 and 05 (pi), commit `a9dbac98ef`. `grep -c 'deep-research-presentation.txt:379-388'` and `grep -c 'deep-research-presentation.txt:233-236'` each print 1, anchor text unchanged
- [x] T013 [P] Remove capture rows `:117-118` and extend the note at `:100` to say the two `memory-pipeline-regressions.vitest.ts` rows were removed because the file no longer imports `../../shared/embeddings` (`session-capturing-pipeline-quality-coverage.md`). Evidence: brief 06 (pi), commit `a9dbac98ef`. `grep -c 'memory-pipeline-regressions'` prints 1, the note. `git diff --stat` 1 insertion, 3 deletions. The `17 violation(s)` line is kept
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun the two fallback probes and compare with `scratch/fallback-baseline.txt`: the same exit codes and a `document_type_fallback` entry in `warnings` for both. Evidence: the playbook root index keeps exit 0 and now carries one `document_type_fallback` warning (`total_issues` 0 to 1, every JSON key kept). `communication.md` keeps exit 1 with the fallback entry present
- [x] T015 Run `ONLY_TESTS="test_structure_validation.py test_quick_validate_086.py" bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and read `PASS` for both. Evidence: `PASS test_structure_validation.py` and `PASS test_quick_validate_086.py`, in the targeted runs and in the full suite
- [x] T016 Run `rg -n -e 'deep/research\.md:307' -e 'deep/research\.md:176' -e 'regressions\.vitest\.ts:67' -e 'regressions\.vitest\.ts:109' .skilled/skills` and read no output. Run `sed -n '379,388p'` and `sed -n '233,236p'` on the presentation file and read the anchor text. Evidence: the `rg` prints nothing, exit 1. `sed -n '379,388p'` on the presentation file prints `### Key Differences (vs. single-pass research)` with `Externalized state` and `Negative knowledge`, and `sed -n '233,236p'` prints `### Contract` and the `**Outputs:**` line (reread read-only while closing these docs; the file has 407 lines)
- [x] T017 Run `validate_document.py` on each of the three edited playbook files and read `VALID` and `playbook_feature` with exit 0. Evidence: `validate_document.py` on each of the three files prints `VALID` and `Document type: playbook_feature`, exit 0 (rerun read-only while closing these docs)
- [x] T018 Rerun the full owner suite and compare its failing set by name with `scratch/suite-baseline.txt`. No new name may appear. Evidence: 24 PASS, the same 2 FAIL by name (`test_readme_manifest.py`, `test_rename_tooling_fixture_harness.py`), exit 1. No new failing name
- [x] T019 Mark each row of `acceptance-criteria.md` with its evidence, fill `implementation-summary.md`, empty `scratch/` except `.gitkeep`, then run `validate.sh --strict` on this phase. Evidence: `acceptance-criteria.md` 6/6 Met, `implementation-summary.md` filled, `validate.sh --strict` prints `RESULT: PASSED` on the final state. Deviation: `scratch/briefs/` stays as the record of what each executor was sent, so `scratch/` holds `.gitkeep` and `briefs/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. Evidence: T014, T016 and T017
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 to 5 and the affected-surfaces addendum
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6. The presentation file has 407 lines and holds both anchor blocks
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `py_compile` ok on `validate_document.py` (brief 01), and both edited test files import and run their validator (`PASS` each). No linter is part of the owner's gate, so none ran
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the two targeted test files print `PASS`, and the full suite shows no failure outside the baseline set
- [x] CHK-012 [P1] Error handling implemented. Evidence: the fallback entry is a `warning`, so `valid` and `exit_code` stay computed from blocking errors, and the cross-family review found JSON keys and exit codes unchanged on an empty file, with `--type readme` and under `references/`
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the notice uses the result's existing error-dict shape (`type`, `severity`, `message`, `fix_hint`, `auto_fixable`), and the source helper mirrors `extract_structure.py`'s `('generic', 'default')`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 6/6 Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: T014, T016 and T017, and the AC-002 fixture outside the repository
- [x] CHK-022 [P1] Edge cases tested. Evidence: `--type readme` and a file named `README.md` get no notice. A wildcard `mcp__code_mode__*` stays valid. The review also saw one notice after `--fix` re-validation and `auto_fixable_count` unchanged
- [x] CHK-023 [P1] Error scenarios validated. Evidence: `communication.md` still exits 1 with the notice added, and a server-only token exits 1 naming `mcp__<server>__<tool>`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Class: `instance-only` for the fallback and the four citations, `cross-consumer` for the MCP-token severity, which `validate_document.py` already blocked for commands
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `plan.md` affected surfaces, the `Default to readme` and `kind == 'command'` greps, and the dead-citation `rg`, which prints nothing after the build
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `plan.md` affected surfaces. The three test files importing `detect_document_type` run inside the full suite, and the review found none of 307 skill folders changing verdict
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A for a table: neither change is a security, path or redaction fix. The fallback case has its own pytest pair, and the token rule has server-only and wildcard cases. The review's P2 on quoted tokens is recorded in `implementation-summary.md`
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` affected surfaces, four detection rows and the token-kind axis
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. N/A: neither change reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: build commit `a9dbac98ef`, base `6f47c32dce`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff of `a9dbac98ef` adds validator logic, tests and prose, with no credential or token
- [x] CHK-031 [P0] Input validation implemented. Evidence: `quick_validate.py` now rejects a non-qualified MCP token for every package kind (AC-002)
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: the stale pins are rewritten, and spec, tasks, acceptance criteria, goal and summary agree on Complete
- [x] CHK-041 [P1] Code comments adequate. Evidence: the new block carries one WHY comment and the helper a docstring, neither naming a spec path, phase or requirement id
- [x] CHK-042 [P2] README updated (if applicable). Evidence: T011
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the AC-002 fixture lived outside the repository, and `scratch/` holds only `.gitkeep` and `briefs/`
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: `scratch/briefs/` is kept on purpose as the record of what each executor was sent; nothing else is in `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27. CHK-051 keeps `scratch/briefs/` as a recorded deviation
<!-- /ANCHOR:summary -->

---



